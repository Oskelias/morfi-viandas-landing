import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleAdsClient } from "../client.js";
import { campaignResourceName, extractId, toMicros, toolSuccess, toolFailure } from "../utils.js";

const inputShape = {
  customerId: z.string().describe("ID de la cuenta de Google Ads (10 dígitos, con o sin guiones)"),
  campaignId: z.string().describe("ID de la campaña a la que pertenecerá el ad group"),
  name: z.string().min(1).describe("Nombre del ad group"),
  cpcBid: z.number().positive().optional().describe("Puja manual de CPC en la moneda de la cuenta (opcional)"),
  status: z.enum(["ENABLED", "PAUSED"]).default("ENABLED").describe("Estado inicial del ad group"),
};

export function registerCreateAdGroupTool(server: McpServer, client: GoogleAdsClient) {
  server.tool(
    "create_ad_group",
    "Crea un ad group dentro de una campaña existente.",
    inputShape,
    async ({ customerId, campaignId, name, cpcBid, status }) => {
      try {
        const [result] = await client.mutate(customerId, "adGroups", [
          {
            create: {
              name,
              status,
              campaign: campaignResourceName(customerId, campaignId),
              type: "SEARCH_STANDARD",
              ...(cpcBid !== undefined ? { cpcBidMicros: String(toMicros(cpcBid)) } : {}),
            },
          },
        ]);

        return toolSuccess({
          adGroupId: extractId(result.resourceName),
          adGroupResourceName: result.resourceName,
          campaignId,
          name,
          status,
        });
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}
