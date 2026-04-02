import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "fix-malformed-uri",
      configureServer(server) {
  server.middlewares.use((req, res, next) => {
    try {
      decodeURI(req.url);
    } catch (e) {
      // Force it to stdout so it can't be swallowed
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
      "/api": { target: "http://localhost:5001", changeOrigin: true },
    },
  },
});