/**
 * Carga y valida la configuración desde variables de entorno.
 * Se centraliza acá para fallar rápido y con un mensaje claro si falta algo,
 * en lugar de que el error aparezca recién al primer llamado a la API.
 */

export interface GoogleAdsEnvConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  developerToken: string;
  loginCustomerId?: string;
  apiVersion: string;
}

const REQUIRED_VARS = [
  "GOOGLE_ADS_CLIENT_ID",
  "GOOGLE_ADS_CLIENT_SECRET",
  "GOOGLE_ADS_REFRESH_TOKEN",
  "GOOGLE_ADS_DEVELOPER_TOKEN",
] as const;

export function loadConfig(): GoogleAdsEnvConfig {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${missing.join(", ")}.\n` +
        "Copiá .env.example a .env y completá los valores, o configuralos " +
        "en el bloque 'env' del cliente MCP (Claude Desktop, etc).\n" +
        "Para obtener GOOGLE_ADS_REFRESH_TOKEN ejecutá: npm run auth",
    );
  }

  return {
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    // login-customer-id solo es necesario cuando se opera a través de una MCC.
    // Google Ads API lo espera sin guiones.
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, "") || undefined,
    apiVersion: process.env.GOOGLE_ADS_API_VERSION?.trim() || "v17",
  };
}
