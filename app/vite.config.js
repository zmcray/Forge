import { readFileSync } from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Load .env into process.env for server-side API plugin
try {
  const env = readFileSync(".env", "utf-8");
  for (const line of env.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2] || "";
    }
  }
} catch {}

function apiDevPlugin() {
  return {
    name: "forge-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/evaluate", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        let body;
        try {
          body = JSON.parse(Buffer.concat(chunks).toString());
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Invalid JSON" }));
          return;
        }

        // Dynamically import the handler to avoid bundling the SDK
        try {
          const { POST } = await import("./api/evaluate.js");
          const request = new Request("http://localhost/api/evaluate", {
            method: "POST",
            headers: { "content-type": "application/json", ...Object.fromEntries(
              Object.entries(req.headers).filter(([k]) => k.startsWith("x-"))
            )},
            body: JSON.stringify(body),
          });
          const response = await POST(request);
          res.statusCode = response.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(await response.json()));
        } catch (err) {
          console.error("[api/evaluate] Dev handler error:", err.message);
          res.statusCode = 502;
          res.end(JSON.stringify({ error: "Evaluation unavailable" }));
        }
      });

      // SSE streaming middleware for chat endpoint
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        let body;
        try {
          body = JSON.parse(Buffer.concat(chunks).toString());
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Invalid JSON" }));
          return;
        }

        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        });

        const ac = new AbortController();
        req.on("close", () => ac.abort());

        try {
          const { POST } = await import("./api/chat.js");
          const request = new Request("http://localhost/api/chat", {
            method: "POST",
            headers: { "content-type": "application/json", ...Object.fromEntries(
              Object.entries(req.headers).filter(([k]) => k.startsWith("x-"))
            )},
            body: JSON.stringify(body),
            signal: ac.signal,
          });

          const response = await POST(request);
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (ac.signal.aborted) { reader.cancel(); break; }
            res.write(decoder.decode(value, { stream: true }));
          }
        } catch (err) {
          if (!ac.signal.aborted) {
            res.write(`data: ${JSON.stringify({ type: "error", message: "Chat unavailable" })}\n\n`);
          }
        } finally {
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [apiDevPlugin(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: ["@anthropic-ai/sdk"],
    },
  },
  test: {
    globals: true,
    setupFiles: ["./src/test-setup.js"],
  },
});
