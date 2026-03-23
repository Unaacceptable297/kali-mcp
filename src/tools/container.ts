import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DockerManager } from "../docker-manager.js";

export function registerContainerTools(
  server: McpServer,
  docker: DockerManager
) {
  server.tool(
    "container_start",
    "Start the Kali Linux Docker container. Must be called before running any commands.",
    {},
    async () => {
      try {
        const message = await docker.startContainer();
        return { content: [{ type: "text", text: message }] };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to start container: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "container_stop",
    "Stop and remove the Kali Linux Docker container.",
    {},
    async () => {
      try {
        const message = await docker.stopContainer();
        return { content: [{ type: "text", text: message }] };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to stop container: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "container_status",
    "Check the status of the Kali Linux Docker container.",
    {},
    async () => {
      try {
        const status = await docker.getStatus();
        return {
          content: [{ type: "text", text: JSON.stringify(status, null, 2) }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to get status: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
