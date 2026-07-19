/**
 * Script: Carga campaña completa de Etiquetar.app en Google Ads
 *
 * Uso: npx tsx loadCampaignEtiquetar.ts
 *
 * Crea automáticamente:
 * - Campaña: [Search] Inteliar Labels — Integraciones
 * - Ad Group: Integraciones
 * - 6 Keywords (Phrase match)
 * - 6 Negative Keywords
 * - 1 Responsive Search Ad (15 títulos + 4 descripciones)
 */

import "dotenv/config";
import axios from "axios";

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN as string;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN as string;
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || "6533447092"; // Etiquetar.app
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

async function mutateGoogleAds(operations: any[]): Promise<any> {
  const accessToken = await getAccessToken();
  const { data } = await axios.post(
    `https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}/googleAds:mutate`,
    { mutateOperations: operations },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": DEVELOPER_TOKEN,
        "login-customer-id": CUSTOMER_ID,
        "Content-Type": "application/json",
      },
    },
  );
  return data;
}

async function main() {
  console.log(`🚀 Cargando campaña para Etiquetar.app (Customer ID: ${CUSTOMER_ID})\n`);

  const operations: any[] = [];
  let tempId = 1;

  // 1. Crear campaña
  console.log("📋 Creando campaña...");
  const campaignResourceName = `customers/${CUSTOMER_ID}/campaigns/~${tempId}`;
  operations.push({
    createOperation: {
      create: {
        resourceName: campaignResourceName,
        name: "[Search] Inteliar Labels — Integraciones",
        status: "PAUSED",
        advertisingChannelType: "SEARCH",
        campaignBudgetId: undefined,
        biddingStrategyType: "MANUAL_CPC",
        manualCpc: {
          enhancedCpcEnabled: false,
        },
      },
    },
  });

  // 2. Crear budget para la campaña
  const budgetResourceName = `customers/${CUSTOMER_ID}/campaignBudgets/~${tempId}`;
  tempId++;
  operations.push({
    createOperation: {
      create: {
        resourceName: budgetResourceName,
        name: "Etiquetar.app Budget - USD 5/día",
        amountMicros: 5000000, // 5 USD
        deliveryMethod: "STANDARD",
        type: "DAILY",
      },
    },
  });

  // Actualizar campaña con budget
  operations[0].createOperation.create.campaignBudgetId = budgetResourceName;

  // 3. Configurar targeting de campaña (Argentina, Español)
  console.log("🌍 Configurando geolocalización y idioma...");
  operations.push({
    createOperation: {
      create: {
        resourceName: `customers/${CUSTOMER_ID}/campaignGeoTargets/~${tempId}`,
        campaign: campaignResourceName,
        geoTargetConstant: "customers/1/geoTargetConstants/2032", // Argentina
      },
    },
  });
  tempId++;

  // 4. Crear Ad Group
  console.log("📢 Creando Ad Group: Integraciones...");
  const adGroupResourceName = `customers/${CUSTOMER_ID}/adGroups/~${tempId}`;
  tempId++;
  operations.push({
    createOperation: {
      create: {
        resourceName: adGroupResourceName,
        campaign: campaignResourceName,
        name: "Integraciones",
        status: "ENABLED",
        type: "SEARCH_STANDARD",
      },
    },
  });

  // 5. Agregar Keywords (Phrase match)
  const keywords = [
    "etiquetas mercado libre",
    "imprimir etiqueta mercado envios",
    "etiquetas tiendanube",
    "integracion tiendanube etiquetas",
    "software etiquetas termicas",
    "alternativa bartender",
  ];

  console.log("🔑 Agregando 6 keywords...");
  keywords.forEach((keyword) => {
    operations.push({
      createOperation: {
        create: {
          resourceName: `customers/${CUSTOMER_ID}/adGroupKeywords/~${tempId}`,
          adGroup: adGroupResourceName,
          text: keyword,
          matchType: "PHRASE",
          status: "ENABLED",
        },
      },
    });
    tempId++;
  });

  // 6. Agregar Negative Keywords (nivel campaña)
  const negativeKeywords = [
    "gratis",
    "descarga",
    "crackeado",
    "curso",
    "trabajo",
    "empleo",
    "pdf gratis",
    "plantilla word",
  ];

  console.log("🚫 Agregando 8 negative keywords...");
  negativeKeywords.forEach((keyword) => {
    operations.push({
      createOperation: {
        create: {
          resourceName: `customers/${CUSTOMER_ID}/campaignNegativeKeywords/~${tempId}`,
          campaign: campaignResourceName,
          text: keyword,
          matchType: "BROAD",
        },
      },
    });
    tempId++;
  });

  // 7. Crear Responsive Search Ad (15 títulos + 4 descripciones)
  console.log("✍️  Creando Responsive Search Ad...");

  const headlines = [
    { text: "Etiquetas desde Mercado Libre" },
    { text: "Conectá Tiendanube y ML" },
    { text: "Imprimí Etiquetas en Segundos" },
    { text: "Alternativa a BarTender" },
    { text: "Trial Gratis 15 Días" },
    { text: "Sin Tarjeta de Crédito" },
    { text: "Diseñador con IA" },
    { text: "Compatible Zebra y TSC" },
    { text: "Software Etiquetas Térmicas" },
    { text: "Etiqueta Mercado Envíos" },
    { text: "Desde Excel o CSV" },
    { text: "Sin Instalar Programas" },
    { text: "Empezá en 5 Minutos" },
    { text: "Etiquetar.app" },
    { text: "Precio Accesible USD$12/mes" },
  ];

  const descriptions = [
    {
      text: "Conectá Mercado Libre y Tiendanube, imprimí etiquetas al instante. Sin BarTender.",
    },
    { text: "Etiqueta oficial de Mercado Envíos con tracking real. Sin descargar PDF." },
    {
      text: "Diseñador visual con IA. Códigos de barras y QR. Trial 15 días sin tarjeta.",
    },
    {
      text: "Compatible con Zebra, TSC, Honeywell, Godex y Brother. Probá gratis hoy.",
    },
  ];

  operations.push({
    createOperation: {
      create: {
        resourceName: `customers/${CUSTOMER_ID}/ads/~${tempId}`,
        adGroup: adGroupResourceName,
        type: "RESPONSIVE_SEARCH_AD",
        responsiveSearchAd: {
          headlines: headlines,
          descriptions: descriptions,
          finalUrls: ["https://etiquetar.app/"],
          pathPart1: "etiquetas",
          pathPart2: "integraciones",
        },
      },
    },
  });

  // Ejecutar todas las operaciones
  console.log(`\n📤 Enviando ${operations.length} operaciones a Google Ads API...\n`);

  try {
    const response = await mutateGoogleAds(operations);

    if (response.results && response.results.length > 0) {
      console.log(`✅ ÉXITO: ${response.results.length} operaciones completadas\n`);

      // Mostrar recursos creados
      response.results.forEach((result: any, idx: number) => {
        if (result.resourceName) {
          console.log(`  [${idx + 1}] ${result.resourceName}`);
        }
      });

      console.log("\n🎉 Campaña cargada exitosamente en Etiquetar.app");
      console.log("⏸️  Estado: PAUSADA (revisa en Google Ads antes de activar)");
      console.log("⚠️  IMPORTANTE: Instala el pixel de conversión en /auth/register antes de activar");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error en API:", JSON.stringify(error.response?.data, null, 2));
    } else {
      console.error("❌ Error:", error);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
