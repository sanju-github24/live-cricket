import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' loads all env vars regardless of the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "fix-malformed-uri",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            try {
              decodeURI(req.url);
            } catch (e) {
              process.stdout.write("BAD URL: " + req.url + "\n");
              res.writeHead(400, { "Content-Type": "text/plain" });
              res.end("Bad Request: malformed URI");
              return;
            }
            next();
          });
        },
      },
    ],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          // Use the variable from your .env file
          target: env.VITE_API_URL || "http://localhost:5001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});