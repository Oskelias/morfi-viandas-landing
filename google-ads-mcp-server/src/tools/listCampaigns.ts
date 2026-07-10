import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleAdsClient } from "../client.js";
import { fromMicros, toolSuccess, toolFailure } from "../utils.js";

const inputShape = {
  customerId: z.string().describe("ID de la cuenta de Google Ads (10 dígitos, con o sin guiones)"),
  statusFilter: z
    .enum(["ENABLED", "PAUSED", "REMOVED", "ANY"])
    .default("ANY")
    .describe("Filtrar por estado de campaña. ANY no filtra."),
  pageSize: z.number().int().min(1).max(200).default(50).describe("Cantidad de resultados por página"),
  pageToken: z.string().optional().describe("Token de la página siguiente, devuelto por una llamada anterior"),
};

export function registerListCampaignsTool(server: McpServer, client: GoogleAdsClient) {
  server.tool(
    "list_campaigns",
    "Lista las campañas de una cuenta de Google Ads, con su estado, tipo y presupuesto diario. Soporta paginación.",
    inputShape,
    async ({ customerId, statusFilter, pageSize, pageToken }) => {
      try {
        // GAQL (Google Ads Query Language): similar a SQL pero solo de lectura
        // y sobre los "recursos" definidos por el esquema de Google Ads.
        const whereClause = statusFilter === "ANY" ? "" : `WHERE campaign.status = '${statusFilter}'`;
        const query = `
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.advertising_channel_type,
            campaign_budget.amount_micros
          FROM campaign
          ${whereClause}
          ORDER BY campaign.id
        `.trim();

        const response = await client.search(customerId, query, { pageSize, pageToken });

        const campaigns = (response.results ?? []).map((row) => ({
          id: row.campaign?.id,
          name: row.campaign?.name,
          status: row.campaign?.status,
          advertisingChannelType: row.campaign?.advertisingChannelType,
          dailyBudget: fromMicros(row.campaignBudget?.amountMicros),
        }));

        return toolSuccess({
          campaigns,
          count: campaigns.length,
          nextPageToken: response.nextPageToken ?? null,
        });
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}
