import axios from "axios";

/**
 * Google Ads API expresa montos monetarios en "micros": 1 unidad de la
 * moneda de la cuenta = 1.000.000 micros. Estos helpers evitan repetir
 * la conversión (y el redondeo, que la API exige que sea un entero) en
 * cada tool.
 */
export function toMicros(amount: number): number {
  return Math.round(amount * 1_000_000);
}

export function fromMicros(micros: string | number | undefined | null): number {
  if (micros === undefined || micros === null) return 0;
  return Number(micros) / 1_000_000;
}

/** Quita guiones/espacios de un customer ID (la API los espera como solo dígitos). */
export function normalizeCustomerId(customerId: string): string {
  return customerId.replace(/[-\s]/g, "");
}

export function campaignResourceName(customerId: string, campaignId: string): string {
  return `customers/${normalizeCustomerId(customerId)}/campaigns/${campaignId}`;
}

export function campaignBudgetResourceName(customerId: string, budgetId: string): string {
  return `customers/${normalizeCustomerId(customerId)}/campaignBudgets/${budgetId}`;
}

export function adGroupResourceName(customerId: string, adGroupId: string): string {
  return `customers/${normalizeCustomerId(customerId)}/adGroups/${adGroupId}`;
}

/** Extrae el ID numérico final de un resource name (ej: ".../campaigns/123" -> "123"). */
export function extractId(resourceName: string): string {
  const parts = resourceName.split("/");
  return parts[parts.length - 1];
}

export class GoogleAdsApiError extends Error {
  readonly errors: Array<{ errorCode?: unknown; message: string; fieldPathElements?: unknown }>;
  readonly requestId?: string;

  constructor(message: string, errors: Array<{ errorCode?: unknown; message: string; fieldPathElements?: unknown }>, requestId?: string) {
    super(message);
    this.name = "GoogleAdsApiError";
    this.errors = errors;
    this.requestId = requestId;
  }
}

/**
 * Traduce el formato de error de Google Ads API (gRPC-status con
 * `details[].errors[]`) a un mensaje accionable. Google Ads casi siempre
 * incluye el campo específico que falló (fieldPathElements) y una
 * descripción legible en `message`, así que priorizamos eso sobre el
 * mensaje HTTP genérico.
 */
export function toActionableError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          error?: {
            code?: number;
            message?: string;
            status?: string;
            details?: Array<{ errors?: Array<{ errorCode?: unknown; message: string; trigger?: { stringValue?: string }; location?: { fieldPathElements?: Array<{ fieldName: string }> } }> }>;
          };
        }
      | undefined;

    const googleError = data?.error;
    if (googleError) {
      const detailErrors = googleError.details?.flatMap((d) => d.errors ?? []) ?? [];

      if (detailErrors.length > 0) {
        const summary = detailErrors
          .map((e) => {
            const field = e.location?.fieldPathElements?.map((f) => f.fieldName).join(".");
            const trigger = e.trigger?.stringValue;
            return [e.message, field ? `(campo: ${field})` : null, trigger ? `(valor: ${trigger})` : null]
              .filter(Boolean)
              .join(" ");
          })
          .join(" | ");

        return new GoogleAdsApiError(
          `Google Ads API rechazó la solicitud: ${summary}`,
          detailErrors,
          error.response?.headers?.["request-id"],
        );
      }

      return new GoogleAdsApiError(
        `Google Ads API error (${googleError.status ?? googleError.code}): ${googleError.message}`,
        [],
        error.response?.headers?.["request-id"],
      );
    }

    if (error.response) {
      return new Error(`HTTP ${error.response.status} llamando a Google Ads API: ${JSON.stringify(error.response.data)}`);
    }
    return new Error(`No se pudo conectar con Google Ads API: ${error.message}`);
  }

  return error instanceof Error ? error : new Error(String(error));
}

/** Formato de respuesta estándar (JSON estructurado) que devuelven todas las tools. */
export function toolSuccess(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ success: true, data }, null, 2) }],
  };
}

export function toolFailure(error: unknown) {
  const err = toActionableError(error);
  const payload: Record<string, unknown> = { success: false, error: err.message };
  if (err instanceof GoogleAdsApiError && err.errors.length > 0) {
    payload.details = err.errors;
  }
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    isError: true,
  };
}
