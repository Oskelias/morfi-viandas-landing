import axios from "axios";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number; // segundos
  scope: string;
  token_type: string;
}

interface TokenManagerConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

/**
 * Intercambia el refresh_token de larga duración por un access_token de corta
 * duración (~1h). El access_token se cachea en memoria y se renueva solo
 * cuando está por vencer, para no pegarle al endpoint de OAuth en cada tool call.
 */
export class TokenManager {
  private config: TokenManagerConfig;
  private accessToken: string | null = null;
  private expiresAtMs = 0;

  constructor(config: TokenManagerConfig) {
    this.config = config;
  }

  async getAccessToken(): Promise<string> {
    const now = Date.now();
    // Margen de 60s para evitar usar un token que vence en el instante
    // en que llega a la API de Google Ads.
    if (this.accessToken && now < this.expiresAtMs - 60_000) {
      return this.accessToken;
    }

    try {
      const { data } = await axios.post<RefreshTokenResponse>(
        TOKEN_ENDPOINT,
        new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
          grant_type: "refresh_token",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      this.accessToken = data.access_token;
      this.expiresAtMs = now + data.expires_in * 1000;
      return this.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.error_description ?? error.response?.data?.error ?? error.message;
        throw new Error(
          `No se pudo renovar el access token de Google OAuth: ${detail}. ` +
            "Verificá GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET y GOOGLE_ADS_REFRESH_TOKEN. " +
            "Si el refresh token fue revocado, regeneralo con: npm run auth",
        );
      }
      throw error;
    }
  }
}
