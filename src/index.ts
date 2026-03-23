#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DockerManager } from "./docker-manager.js";
import { registerContainerTools } from "./tools/container.js";
import { registerExecuteTools } from "./tools/execute.js";
import { registerFilesystemTools } from "./tools/filesystem.js";

const dockerManager = new DockerManager();

const server = new McpServer({
  name: "kali-mcp",
  version: "1.0.0",
});

registerContainerTools(server, dockerManager);
registerExecuteTools(server, dockerManager);
registerFilesystemTools(server, dockerManager);

const transport = new StdioServerTransport();
await server.connect(transport);
