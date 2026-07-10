import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleAdsClient } from "../client.js";
import { adGroupResourceName, extractId, toolSuccess, toolFailure } from "../utils.js";

const inputShape = {
  customerId: z.string().describe("ID de la cuenta de Google Ads (10 dígitos, con o sin guiones)"),
  adGroupId: z.string().describe("ID del ad group donde se creará el anuncio"),
  headlines: z
    .array(z.string().max(30))
    .min(3)
    .max(15)
    .describe("Títulos del anuncio (3 a 15 textos, máx. 30 caracteres cada uno)"),
  descriptions: z
    .array(z.string().max(90))
    .min(2)
    .max(4)
    .describe("Descripciones del anuncio (2 a 4 textos, máx. 90 caracteres cada uno)"),
  finalUrls: z.array(z.string().url()).min(1).describe("URL(s) de destino del anuncio"),
  status: z
    .enum(["ENABLED", "PAUSED"])
    .default("PAUSED")
    .describe("Estado inicial. Por defecto PAUSED para poder revisar el anuncio antes de que se sirva."),
};

/**
 * Crea un Responsive Search Ad (RSA): el formato recomendado por Google para
 * campañas de Búsqueda, donde Google combina automáticamente los títulos y
 * descripciones provistos para armar distintas variantes del anuncio.
 */
export function registerCreateAdTool(server: McpServer, client: GoogleAdsClient) {
  server.tool(
    "create_ad",
    "Crea un anuncio de búsqueda adaptable (Responsive Search Ad) dentro de un ad group.",
    inputShape,
    async ({ customerId, adGroupId, headlines, descriptions, finalUrls, status }) => {
      try {
        const [result] = await client.mutate(customerId, "adGroupAds", [
          {
            create: {
              status,
              adGroup: adGroupResourceName(customerId, adGroupId),
              ad: {
                finalUrls,
                responsiveSearchAd: {
                  headlines: headlines.map((text) => ({ text })),
                  descriptions: descriptions.map((text) => ({ text })),
                },
              },
            },
          },
        ]);

        return toolSuccess({
          adId: extractId(result.resourceName),
          adResourceName: result.resourceName,
          adGroupId,
          status,
          headlineCount: headlines.length,
          descriptionCount: descriptions.length,
        });
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}
