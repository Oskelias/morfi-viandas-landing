/**
 * OAuth Authorization Script
 * Obtiene un refresh token de Google Ads API
 *
 * Uso: npx tsx getRefreshToken.ts
 */

import "dotenv/config";
import axios from "axios";
import http from "http";
import { parse } from "url";
import fs from "fs";
import path from "path";

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET as string;
const OAUTH_REDIRECT_URI =
  process.env.GOOGLE_ADS_OAUTH_REDIRECT_URI || "http://localhost:8877/oauth2callback";
const OAUTH_PORT = parseInt(process.env.GOOGLE_ADS_OAUTH_PORT || "8877");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ Error: Falta GOOGLE_ADS_CLIENT_ID o GOOGLE_ADS_CLIENT_SECRET en .env");
  process.exit(1);
}

const SCOPES = ["https://www.googleapis.com/auth/adwords"];
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES.join(" "))}`;

let authCode = "";

const server = http.createServer((req, res) => {
  const queryData = parse(req.url as string, true).query;

  if (queryData.code) {
    authCode = queryData.code as string;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <html>
        <head><title>Autorización exitosa</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>✅ Autorización exitosa</h1>
          <p>Google Ads está autorizado. Puedes cerrar esta ventana.</p>
        </body>
      </html>
    `);
    server.close();
  } else if (queryData.error) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<html><body><h1>❌ Error: ${queryData.error}</h1></body></html>`);
    server.close();
    process.exit(1);
  }
});

server.listen(OAUTH_PORT, () => {
  console.log(`🔑 Abriendo navegador para autorización...\n`);
  console.log(`ℹ️  Si no se abre automáticamente, ve a:\n${authUrl}\n`);

  // Intentar abrir el navegador
  const openCommand =
    process.platform === "darwin"
      ? `open "${authUrl}"`
      : process.platform === "win32"
        ? `start ${authUrl}`
        : `xdg-open "${authUrl}"`;

  require("child_process").exec(openCommand);
});

server.on("close", async () => {
  if (!authCode) {
    console.error("❌ No se recibió código de autorización");
    process.exit(1);
  }

  console.log("⏳ Intercambiando código por refresh token...\n");

  try {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: authCode,
      grant_type: "authorization_code",
      redirect_uri: OAUTH_REDIRECT_URI,
    });

    const refreshToken = data.refresh_token;
    const accessToken = data.access_token;

    if (!refreshToken) {
      console.error("❌ Error: Google no retornó un refresh token");
      console.error(
        "   (Probablemente ya autorizaste esta app. Revoca el acceso en https://myaccount.google.com/permissions y reintenta)",
      );
      process.exit(1);
    }

    // Guardar refresh token en .env
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
      // Reemplazar línea existente si hay
      envContent = envContent
        .split("\n")
        .filter((line) => !line.startsWith("GOOGLE_ADS_REFRESH_TOKEN="))
        .join("\n");
    }

    // Agregar nuevo token
    if (!envContent.endsWith("\n")) envContent += "\n";
    envContent += `GOOGLE_ADS_REFRESH_TOKEN=${refreshToken}\n`;

    fs.writeFileSync(envPath, envContent);

    console.log("✅ Autenticación exitosa!\n");
    console.log("📝 Información guardada en .env:");
    console.log(`   GOOGLE_ADS_REFRESH_TOKEN=${refreshToken.substring(0, 20)}...`);
    console.log(`   Access Token (temporal): ${accessToken.substring(0, 20)}...\n`);
    console.log("🚀 Ahora puedes ejecutar:\n   GOOGLE_ADS_CUSTOMER_ID=6533447092 npx tsx loadCampaignEtiquetar.ts");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error de OAuth:", JSON.stringify(error.response?.data, null, 2));
    } else {
      console.error("❌ Error:", error);
    }
    process.exit(1);
  }
});
