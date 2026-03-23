import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DockerManager } from "../docker-manager.js";

export function registerFilesystemTools(
  server: McpServer,
  docker: DockerManager
) {
  server.tool(
    "upload_file",
    "Upload/write a file to the Kali Linux container. Useful for uploading wordlists, scripts, or configuration files.",
    {
      path: z.string().describe("Absolute path inside the container where the file should be written"),
      content: z.string().describe("File content to write"),
    },
    async ({ path, content }) => {
      try {
        await docker.writeFile(path, content);
        return {
          content: [{ type: "text", text: `File written to ${path}` }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to upload file: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "download_file",
    "Read/download a file from the Kali Linux container. Useful for retrieving scan results and output files.",
    {
      path: z.string().describe("Absolute path of the file inside the container"),
    },
    async ({ path }) => {
      try {
        const content = await docker.readFile(path);
        return {
          content: [{ type: "text", text: content }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to download file: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "list_files",
    "List files in a directory inside the Kali Linux container.",
    {
      path: z
        .string()
        .optional()
        .describe("Directory path inside the container (default: /workspace)"),
    },
    async ({ path }) => {
      try {
        const listing = await docker.listFiles(path ?? "/workspace");
        return {
          content: [{ type: "text", text: listing }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to list files: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
