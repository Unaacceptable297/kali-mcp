import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DockerManager } from "../docker-manager.js";

export function registerExecuteTools(
  server: McpServer,
  docker: DockerManager
) {
  server.tool(
    "execute_command",
    "Execute a shell command inside the Kali Linux container. Use this to run security tools like nmap, sqlmap, hydra, nikto, gobuster, john, hashcat, dirb, enum4linux, and any other installed tool.",
    {
      command: z.string().describe("Shell command to execute inside the Kali container"),
      timeout: z
        .number()
        .optional()
        .describe("Timeout in seconds (default: 300)"),
    },
    async ({ command, timeout }) => {
      try {
        const result = await docker.executeCommand(command, timeout ?? 300);

        let output = "";
        if (result.stdout) {
          output += result.stdout;
        }
        if (result.stderr) {
          output += (output ? "\n--- stderr ---\n" : "") + result.stderr;
        }
        if (!output) {
          output = "(no output)";
        }
        output += `\n\n[exit code: ${result.exitCode}]`;

        return {
          content: [{ type: "text", text: output }],
          isError: result.exitCode !== 0,
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to execute command: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
