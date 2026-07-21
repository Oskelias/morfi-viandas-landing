import axios, { AxiosInstance } from "axios";
import { GoogleAdsEnvConfig } from "./config.js";
import { TokenManager } from "./auth/tokenManager.js";
import { normalizeCustomerId, toActionableError } from "./utils.js";

export interface MutateOperation {
  create?: Record<string, unknown>;
  update?: Record<string, unknown>;
  updateMask?: string;
  remove?: string;
}

export interface MutateResult {
  resourceName: string;
}

export interface SearchResponse {
  results?: Array<Record<string, any>>;
  nextPageToken?: string;
  totalResultsCount?: string;
  fieldMask?: string;
}

/**
 * Cliente delgado sobre la interfaz REST de Google Ads API
 * (https://developers.google.com/google-ads/api/rest/overview).
 * Se usa REST en lugar de gRPC para mantener el proyecto liviano
 * (sin generar stubs de protobuf) a costa de algo de verbosidad manual.
 */
export class GoogleAdsClient {
  private http: AxiosInstance;
  private tokenManager: TokenManager;
  private developerToken: string;
  private loginCustomerId?: string;

  constructor(config: GoogleAdsEnvConfig) {
    this.http = axios.create({
      baseURL: `https://googleads.googleapis.com/${config.apiVersion}`,
      timeout: 30_000,
    });
    this.tokenManager = new TokenManager({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
    });
    this.developerToken = config.developerToken;
    this.loginCustomerId = config.loginCustomerId;
  }

  private async headers(): Promise<Record<string, string>> {
    const accessToken = await this.tokenManager.getAccessToken();
    return {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": this.developerToken,
      ...(this.loginCustomerId ? { "login-customer-id": this.loginCustomerId } : {}),
      "Content-Type": "application/json",
    };
  }

  /**
   * Ejecuta una consulta GAQL (Google Ads Query Language) contra el recurso
   * `googleAds:search`. A diferencia de `searchStream`, este endpoint soporta
   * paginación real vía pageToken, por eso es el que usan las tools de listado.
   */
  async search(customerId: string, query: string, opts?: { pageSize?: number; pageToken?: string }): Promise<SearchResponse> {
    try {
      const headers = await this.headers();
      const { data } = await this.http.post<SearchResponse>(
        `/customers/${normalizeCustomerId(customerId)}/googleAds:search`,
        {
          query,
          pageSize: opts?.pageSize ?? 50,
          ...(opts?.pageToken ? { pageToken: opts.pageToken } : {}),
        },
        { headers },
      );
      return data;
    } catch (error) {
      throw toActionableError(error);
    }
  }

  /**
   * Ejecuta operaciones create/update/remove sobre un recurso mutable
   * (campaigns, campaignBudgets, adGroups, adGroupAds, etc).
   * `resourcePath` es el nombre del recurso en plural camelCase, ej. "campaigns".
   */
  async mutate(customerId: string, resourcePath: string, operations: MutateOperation[]): Promise<MutateResult[]> {
    try {
      const headers = await this.headers();
      const { data } = await this.http.post<{ results: MutateResult[] }>(
        `/customers/${normalizeCustomerId(customerId)}/${resourcePath}:mutate`,
        { operations, partialFailure: false },
        { headers },
      );
      return data.results;
    } catch (error) {
      throw toActionableError(error);
    }
  }
}
