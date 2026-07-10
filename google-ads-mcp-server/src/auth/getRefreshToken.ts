/**
 * Script de setup único (no forma parte del servidor MCP en sí).
 * Ejecuta el flujo de OAuth 2.0 "Authorization Code" para obtener un
 * refresh_token de larga duración, que luego se guarda en GOOGLE_ADS_REFRESH_TOKEN.
 *
 * Uso:
 *   1. Crear un OAuth client "Desktop app" en Google Cloud Console.
 *   2. Agregar http://localhost:8080/oauth2callback como Authorized redirect URI.
 *   3. Definir GOOGLE_ADS_CLIENT_ID y GOOGLE_ADS_CLIENT_SECRET en .env
 *   4. npm run auth
 *   5. Abrir la URL impresa, iniciar sesión y autorizar.
 *   6. El script captura el código de autorización, lo intercambia por un
 *      refresh_token y lo imprime en consola para pegarlo en .env.
 */
import "dotenv/config";
import axios from "axios";
import http from "node:http";
import { URL } from "node:url";

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_ADS_OAUTH_REDIRECT_URI || "http://localhost:8080/oauth2callback";
const PORT = Number(process.env.GOOGLE_ADS_OAUTH_PORT || 8080);

// Scope oficial de Google Ads API, necesario para operar sobre campañas.
const SCOPE = "https://www.googleapis.com/auth/adwords";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Faltan GOOGLE_ADS_CLIENT_ID / GOOGLE_ADS_CLIENT_SECRET.\n" +
      "Definilos en un archivo .env (ver .env.example) antes de correr 'npm run auth'.",
  );
  process.exit(1);
}

function buildAuthUrl(): string {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", CLIENT_ID!);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPE);
  // access_type=offline + prompt=consent son necesarios para que Google
  // devuelva un refresh_token (si no, solo devuelve access_token).
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  return url.toString();
}

async function exchangeCodeForTokens(code: string) {
  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      code,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
  return data as { access_token: string; refresh_token?: string };
}

function main() {
  const authUrl = buildAuthUrl();

  console.log("\n=== Autenticación de Google Ads (OAuth 2.0) ===\n");
  console.log("1. Abrí esta URL en tu navegador y autorizá el acceso:\n");
  console.log(`   ${authUrl}\n`);
  console.log(`Esperando el redirect en ${REDIRECT_URI} ...\n`);

  const server = http.createServer(async (req, res) => {
    if (!req.url) return;
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname !== "/oauth2callback") {
      res.writeHead(404).end();
      return;
    }

    const error = url.searchParams.get("error");
    const code = url.searchParams.get("code");

    if (error || !code) {
      res.writeHead(400, { "Content-Type": "text/plain" }).end(`Error de autorización: ${error ?? "sin código"}`);
      console.error(`Autorización fallida: ${error ?? "no se recibió código"}`);
      server.close();
      process.exit(1);
    }

    try {
      const tokens = await exchangeCodeForTokens(code!);

      if (!tokens.refresh_token) {
        res
          .writeHead(200, { "Content-Type": "text/plain" })
          .end("No se recibió refresh_token. Revocá el acceso previo en myaccount.google.com/permissions y reintentá.");
        console.error(
          "\nGoogle no devolvió un refresh_token (probablemente ya habías autorizado esta app antes).\n" +
            "Revocá el acceso en https://myaccount.google.com/permissions y volvé a correr 'npm run auth'.\n",
        );
        server.close();
        process.exit(1);
      }

      res
        .writeHead(200, { "Content-Type": "text/plain" })
        .end("Autenticación exitosa. Podés cerrar esta pestaña y volver a la terminal.");

      console.log("\n✅ Autenticación exitosa. Guardá esto en tu .env:\n");
      console.log(`GOOGLE_ADS_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    } catch (err) {
      const message = axios.isAxiosError(err) ? JSON.stringify(err.response?.data) : String(err);
      res.writeHead(500, { "Content-Type": "text/plain" }).end("Error intercambiando el código por tokens.");
      console.error(`\nError intercambiando el código por tokens: ${message}\n`);
    } finally {
      server.close();
    }
  });

  server.listen(PORT);
}

main();
