import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleAdsClient } from "../client.js";
import { toMicros, extractId, toolSuccess, toolFailure } from "../utils.js";

const CHANNEL_TYPES = ["SEARCH", "DISPLAY", "SHOPPING", "VIDEO", "PERFORMANCE_MAX"] as const;

const inputShape = {
  customerId: z.string().describe("ID de la cuenta de Google Ads (10 dígitos, con o sin guiones)"),
  name: z.string().min(1).describe("Nombre de la campaña"),
  dailyBudget: z.number().positive().describe("Presupuesto diario en la moneda de la cuenta (ej: 50 = $50/día)"),
  advertisingChannelType: z.enum(CHANNEL_TYPES).default("SEARCH").describe("Tipo de campaña"),
  status: z
    .enum(["ENABLED", "PAUSED"])
    .default("PAUSED")
    .describe("Estado inicial. Por defecto PAUSED para evitar gasto accidental antes de revisar la campaña."),
};

export function registerCreateCampaignTool(server: McpServer, client: GoogleAdsClient) {
  server.tool(
    "create_campaign",
    "Crea una nueva campaña de Google Ads junto con su presupuesto diario. " +
      "Por defecto la campaña queda PAUSADA para poder revisarla antes de que empiece a gastar.",
    inputShape,
    async ({ customerId, name, dailyBudget, advertisingChannelType, status }) => {
      try {
        // Google Ads exige que el presupuesto exista como recurso propio
        // ANTES de crear la campaña que lo referencia (no se pueden crear
        // ambos en la misma llamada vía REST, a diferencia de un batch job gRPC).
        const [budgetResult] = await client.mutate(customerId, "campaignBudgets", [
          {
            create: {
              name: `Presupuesto - ${name}`,
              amountMicros: String(toMicros(dailyBudget)),
              deliveryMethod: "STANDARD",
              explicitlyShared: false,
            },
          },
        ]);

        const [campaignResult] = await client.mutate(customerId, "campaigns", [
          {
            create: {
              name,
              status,
              advertisingChannelType,
              campaignBudget: budgetResult.resourceName,
              // Bidding strategy simple por defecto; el usuario puede ajustarla
              // luego desde la UI de Google Ads o con una tool futura.
              manualCpc: {},
            },
          },
        ]);

        return toolSuccess({
          campaignId: extractId(campaignResult.resourceName),
          campaignResourceName: campaignResult.resourceName,
          budgetId: extractId(budgetResult.resourceName),
          budgetResourceName: budgetResult.resourceName,
          name,
          status,
          advertisingChannelType,
          dailyBudget,
        });
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}
