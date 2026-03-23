import Docker from "dockerode";
import { Readable } from "node:stream";
import { Buffer } from "node:buffer";
import path from "node:path";
import tar from "tar-stream";

const CONTAINER_NAME = "kali-mcp";
const IMAGE_NAME = "kali-mcp";

export class DockerManager {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async getContainer(): Promise<Docker.Container | null> {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: { name: [CONTAINER_NAME] },
      });
      if (containers.length > 0) {
        return this.docker.getContainer(containers[0].Id);
      }
    } catch {
      // Container doesn't exist
    }
    return null;
  }

  async imageExists(): Promise<boolean> {
    try {
      const images = await this.docker.listImages({
        filters: { reference: [IMAGE_NAME] },
      });
      return images.length > 0;
    } catch {
      return false;
    }
  }

  async startContainer(): Promise<string> {
    // Check if container already exists
    const existing = await this.getContainer();
    if (existing) {
      const info = await existing.inspect();
      if (info.State.Running) {
        return "Kali container is already running.";
      }
      // Container exists but stopped — start it
      await existing.start();
      return "Kali container started.";
    }

    // Check if image exists
    if (!(await this.imageExists())) {
      return "Kali Docker image not found. Please build it first: cd docker && docker-compose build";
    }

    // Create and start a new container
    const container = await this.docker.createContainer({
      Image: IMAGE_NAME,
      name: CONTAINER_NAME,
      Tty: true,
      OpenStdin: true,
      WorkingDir: "/workspace",
      HostConfig: {
        NetworkMode: "bridge",
      },
    });
    await container.start();
    return "Kali container created and started.";
  }

  async stopContainer(): Promise<string> {
    const container = await this.getContainer();
    if (!container) {
      return "No Kali container found.";
    }

    const info = await container.inspect();
    if (info.State.Running) {
      await container.stop();
    }
    await container.remove();
    return "Kali container stopped and removed.";
  }

  async getStatus(): Promise<{
    running: boolean;
    status: string;
    containerId?: string;
  }> {
    const container = await this.getContainer();
    if (!container) {
      const hasImage = await this.imageExists();
      return {
        running: false,
        status: hasImage
          ? "Container not created. Image available."
          : "Container not created. Image not found — build with: cd docker && docker-compose build",
      };
    }

    const info = await container.inspect();
    return {
      running: info.State.Running,
      status: info.State.Status,
      containerId: info.Id.substring(0, 12),
    };
  }

  async executeCommand(
    command: string,
    timeout: number = 300
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const container = await this.getContainer();
    if (!container) {
      throw new Error(
        "Kali container is not running. Use container_start first."
      );
    }

    const info = await container.inspect();
    if (!info.State.Running) {
      throw new Error(
        "Kali container is not running. Use container_start first."
      );
    }

    const exec = await container.exec({
      Cmd: ["/bin/bash", "-c", command],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });

    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      const timer = setTimeout(() => {
        stream.destroy();
        resolve({
          stdout,
          stderr: stderr + "\n[Command timed out after " + timeout + "s]",
          exitCode: -1,
        });
      }, timeout * 1000);

      // Docker multiplexes stdout/stderr in the stream
      // Each frame: [type(1byte), 0, 0, size(4bytes big-endian), payload]
      let buffer = Buffer.alloc(0);

      stream.on("data", (chunk: Buffer) => {
        buffer = Buffer.concat([buffer, chunk]);

        while (buffer.length >= 8) {
          const type = buffer[0];
          const size = buffer.readUInt32BE(4);

          if (buffer.length < 8 + size) break;

          const payload = buffer.subarray(8, 8 + size).toString("utf-8");
          buffer = buffer.subarray(8 + size);

          if (type === 1) {
            stdout += payload;
          } else if (type === 2) {
            stderr += payload;
          }
        }
      });

      stream.on("end", async () => {
        clearTimeout(timer);
        try {
          const inspectResult = await exec.inspect();
          resolve({
            stdout,
            stderr,
            exitCode: inspectResult.ExitCode ?? 0,
          });
        } catch {
          resolve({ stdout, stderr, exitCode: 0 });
        }
      });

      stream.on("error", (err: Error) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  async writeFile(containerPath: string, content: string): Promise<void> {
    const container = await this.getContainer();
    if (!container) {
      throw new Error("Kali container is not running. Use container_start first.");
    }

    const dir = path.posix.dirname(containerPath);
    const filename = path.posix.basename(containerPath);

    // Create a tar archive with the file
    const pack = tar.pack();
    pack.entry({ name: filename }, content);
    pack.finalize();

    const chunks: Buffer[] = [];
    for await (const chunk of pack) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const tarBuffer = Buffer.concat(chunks);

    // Ensure directory exists
    await this.executeCommand(`mkdir -p ${dir}`);

    await container.putArchive(Readable.from(tarBuffer), { path: dir });
  }

  async readFile(containerPath: string): Promise<string> {
    const container = await this.getContainer();
    if (!container) {
      throw new Error("Kali container is not running. Use container_start first.");
    }

    const stream = await container.getArchive({ path: containerPath });

    return new Promise((resolve, reject) => {
      const extract = tar.extract();
      let content = "";

      extract.on("entry", (header, entryStream, next) => {
        const chunks: Buffer[] = [];
        entryStream.on("data", (chunk: Buffer) => chunks.push(chunk));
        entryStream.on("end", () => {
          content = Buffer.concat(chunks).toString("utf-8");
          next();
        });
        entryStream.resume();
      });

      extract.on("finish", () => resolve(content));
      extract.on("error", reject);

      stream.pipe(extract);
    });
  }

  async listFiles(containerPath: string = "/workspace"): Promise<string> {
    const result = await this.executeCommand(`ls -la ${containerPath}`);
    if (result.exitCode !== 0) {
      throw new Error(`Failed to list files: ${result.stderr}`);
    }
    return result.stdout;
  }
}
