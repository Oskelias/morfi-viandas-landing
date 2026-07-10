import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleAdsClient } from "../client.js";
import { campaignResourceName, toolSuccess, toolFailure } from "../utils.js";

const inputShape = {
  customerId: z.string().describe("ID de la cuenta de Google Ads (10 dígitos, con o sin guiones)"),
  campaignId: z.string().describe("ID numérico de la campaña"),
  status: z.enum(["ENABLED", "PAUSED"]).describe("Nuevo estado: ENABLED para activar, PAUSED para pausar"),
};

export function registerSetCampaignStatusTool(server: McpServer, client: GoogleAdsClient) {
  server.tool(
    "set_campaign_status",
    "Pausa o activa una campaña existente cambiando su estado a PAUSED o ENABLED.",
    inputShape,
    async ({ customerId, campaignId, status }) => {
      try {
        const [result] = await client.mutate(customerId, "campaigns", [
          {
            update: {
              resourceName: campaignResourceName(customerId, campaignId),
              status,
            },
            // Google Ads REST requiere un updateMask explícito indicando
            // qué campos del objeto "update" se deben aplicar.
            updateMask: "status",
          },
        ]);

        return toolSuccess({
          campaignId,
          campaignResourceName: result.resourceName,
          newStatus: status,
        });
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}
