/**
 * Script de una sola vez: crea una cuenta de prueba de Google Ads bajo tu MCC.
 * No requiere acceso Basic aprobado — la creación de cuentas de prueba está
 * siempre permitida sin importar el nivel del developer token.
 *
 * Uso: colocar este archivo en la raíz del proyecto (junto a package.json) y correr:
 *   npx tsx createTestAccount.ts
 */
import "dotenv/config";
import axios from "axios";

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN as string;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN as string;
const LOGIN_CUSTOMER_ID = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID as string)?.replace(/-/g, "");
const API_VERSION = process.env.GOOGLE_ADS_API_VERSION?.trim() || "v24";

async function getAccessToken(): Promise<string> {
  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
  return data.access_token;
}

async function main() {
  if (!LOGIN_CUSTOMER_ID) {
    throw new Error("Falta GOOGLE_ADS_LOGIN_CUSTOMER_ID en el .env (el ID de tu MCC, sin guiones).");
  }

  const accessToken = await getAccessToken();

  const { data } = await axios.post(
    `https://googleads.googleapis.com/${API_VERSION}/customers/${LOGIN_CUSTOMER_ID}/customers:createCustomerClient`,
    {
      customerClient: {
        descriptiveName: "Etiquetar.app",
        currencyCode: "ARS",
        timeZone: "America/Argentina/Buenos_Aires",
        testAccount: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": DEVELOPER_TOKEN,
        "login-customer-id": LOGIN_CUSTOMER_ID,
        "Content-Type": "application/json",
      },
    },
  );

  console.log("Cuenta de prueba creada:");
  console.log(JSON.stringify(data, null, 2));

  const resourceName = data.resourceName as string;
  const newCustomerId = resourceName.split("/").pop();
  console.log(`\n✅ ID de la nueva cuenta (usalo como customerId): ${newCustomerId}`);
}

main().catch((err) => {
  if (axios.isAxiosError(err)) {
    console.error("Error creando la cuenta de prueba:", JSON.stringify(err.response?.data ?? err.message, null, 2));
  } else {
    console.error("Error creando la cuenta de prueba:", err);
  }
  process.exit(1);
});
