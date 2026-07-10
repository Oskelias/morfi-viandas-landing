#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { GoogleAdsClient } from "./client.js";
import { registerAllTools } from "./tools/index.js";

async function main() {
  // Falla rápido y con mensaje claro si falta configuración, antes de
  // levantar el transporte stdio (que de otra forma dejaría al cliente MCP
  // esperando una conexión que nunca responde).
  const config = loadConfig();
  const client = new GoogleAdsClient(config);

  const server = new McpServer({
    name: "google-ads-mcp-server",
    version: "1.0.0",
  });

  registerAllTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stdout está reservado para el protocolo MCP (JSON-RPC sobre stdio);
  // cualquier log de diagnóstico debe ir a stderr.
  console.error("google-ads-mcp-server corriendo (stdio)");
}

main().catch((error) => {
  console.error("Error fatal iniciando google-ads-mcp-server:", error instanceof Error ? error.message : error);
  process.exit(1);
});
