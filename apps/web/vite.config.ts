import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, type ViteDevServer } from "vite";
import morgan from "morgan";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [morganPlugin(), remix()],
});

function morganPlugin() {
  return {
    name: "morgan-plugin",
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(morgan("tiny"));
      };
    },
  };
}
