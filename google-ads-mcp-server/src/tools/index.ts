import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleAdsClient } from "../client.js";
import { registerCreateCampaignTool } from "./createCampaign.js";
import { registerListCampaignsTool } from "./listCampaigns.js";
import { registerSetCampaignStatusTool } from "./setCampaignStatus.js";
import { registerGetPerformanceTool } from "./getPerformance.js";
import { registerCreateAdGroupTool } from "./createAdGroup.js";
import { registerCreateAdTool } from "./createAd.js";

export function registerAllTools(server: McpServer, client: GoogleAdsClient) {
  registerCreateCampaignTool(server, client);
  registerListCampaignsTool(server, client);
  registerSetCampaignStatusTool(server, client);
  registerGetPerformanceTool(server, client);
  registerCreateAdGroupTool(server, client);
  registerCreateAdTool(server, client);
}
