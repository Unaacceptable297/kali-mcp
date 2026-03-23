# kali-mcp

An MCP server that gives AI assistants access to a full Kali Linux environment running in Docker. Connect it to Claude Desktop, Claude Code, or any MCP-compatible client and let the AI run security tools like nmap, sqlmap, hydra, nikto, gobuster, and more.

## How it works

```
Claude <--stdio--> MCP Server <--Docker API--> Kali Linux Container
```

The MCP server manages a Docker container running Kali Linux. It exposes tools that let the AI start/stop the container, execute commands, and transfer files — all through the [Model Context Protocol](https://modelcontextprotocol.io).

## Tools

| Tool | Description |
|---|---|
| `container_start` | Start the Kali Linux container |
| `container_stop` | Stop and remove the container |
| `container_status` | Check if the container is running |
| `execute_command` | Run any shell command inside Kali |
| `upload_file` | Write a file to the container |
| `download_file` | Read a file from the container |
| `list_files` | List directory contents |

## Pre-installed tools

nmap, nikto, gobuster, sqlmap, hydra, john, hashcat, metasploit-framework, dirb, enum4linux, curl, wget, python3, wordlists, and more.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Hannes221/kali-mcp.git
cd kali-mcp
npm install
npm run build
```

### 2. Build the Kali Docker image

```bash
cd docker
docker compose build
cd ..
```

This downloads and builds the Kali Linux image (~4GB). It takes a few minutes on the first run.

### 3. Connect to your AI client

#### Claude Desktop

Open **Settings** > **Developer** > **Edit Config** and add the `kali` server to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kali": {
      "command": "node",
      "args": ["/absolute/path/to/kali-mcp/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/kali-mcp` with the actual path where you cloned the repo.

Then **restart Claude Desktop**.

#### Claude Code

If you cloned the repo, the `.mcp.json` file is already included. Just open the project directory in Claude Code:

```bash
cd kali-mcp
claude
```

Or add it manually to your Claude Code config:

```bash
claude mcp add kali node /absolute/path/to/kali-mcp/dist/index.js
```

### 4. Verify

In a conversation, ask the AI to:

> Start the Kali container and run `nmap --version`

It should call `container_start`, then `execute_command` with `nmap --version` and return the version output.

## Usage examples

Once connected, you can ask the AI things like:

- "Scan 192.168.1.0/24 for open ports"
- "Run nikto against http://target.com"
- "Use sqlmap to test http://target.com/page?id=1 for SQL injection"
- "Crack these hashes with john"
- "Enumerate SMB shares on 10.0.0.5"

The AI will use the appropriate Kali tools and interpret the results for you.

## Development

```bash
npm run dev    # Run with tsx (auto-compiles TypeScript)
npm run build  # Compile to dist/
npm start      # Run compiled version
```

## Customizing the Kali image

Edit `docker/Dockerfile` to add or remove tools, then rebuild:

```bash
cd docker
docker compose build
```

## Security

- The container runs with default Docker isolation (no `--privileged` flag)
- Network mode is `bridge` by default
- The container is ephemeral — no persistent volumes
- **Only use this for authorized security testing, CTF challenges, and educational purposes**

## License

MIT
