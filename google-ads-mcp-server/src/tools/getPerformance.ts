import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleAdsClient } from "../client.js";
import { fromMicros, toolSuccess, toolFailure } from "../utils.js";

const DATE_RANGES = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_14_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "LAST_MONTH",
] as const;

const inputShape = {
  customerId: z.string().describe("ID de la cuenta de Google Ads (10 dígitos, con o sin guiones)"),
  campaignId: z.string().optional().describe("Si se especifica, filtra las métricas a una sola campaña"),
  dateRange: z.enum(DATE_RANGES).default("LAST_7_DAYS").describe("Rango de fechas predefinido de GAQL"),
};

export function registerGetPerformanceTool(server: McpServer, client: GoogleAdsClient) {
  server.tool(
    "get_campaign_performance",
    "Obtiene métricas de rendimiento (impresiones, clics, costo, CTR, CPC promedio) " +
      "de una campaña específica o de todas las campañas de la cuenta en un rango de fechas.",
    inputShape,
    async ({ customerId, campaignId, dateRange }) => {
      try {
        const conditions = [`segments.date DURING ${dateRange}`];
        if (campaignId) conditions.push(`campaign.id = ${campaignId}`);

        const query = `
          SELECT
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.ctr,
            metrics.average_cpc
          FROM campaign
          WHERE ${conditions.join(" AND ")}
          ORDER BY metrics.cost_micros DESC
        `.trim();

        const response = await client.search(customerId, query, { pageSize: 200 });
        const rows = response.results ?? [];

        const perCampaign = rows.map((row) => ({
          campaignId: row.campaign?.id,
          campaignName: row.campaign?.name,
          impressions: Number(row.metrics?.impressions ?? 0),
          clicks: Number(row.metrics?.clicks ?? 0),
          cost: fromMicros(row.metrics?.costMicros),
          ctr: row.metrics?.ctr ? Number(row.metrics.ctr) : 0,
          averageCpc: fromMicros(row.metrics?.averageCpc),
        }));

        // Totales agregados, útiles cuando se consulta la cuenta completa.
        const totals = perCampaign.reduce(
          (acc, c) => ({
            impressions: acc.impressions + c.impressions,
            clicks: acc.clicks + c.clicks,
            cost: acc.cost + c.cost,
          }),
          { impressions: 0, clicks: 0, cost: 0 },
        );

        return toolSuccess({
          dateRange,
          campaigns: perCampaign,
          totals,
        });
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}
