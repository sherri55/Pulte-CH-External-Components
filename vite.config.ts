import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    plugins: [react(), mkcert()],
    build: {
      lib: {
        formats: ["es"],
        fileName: process.env.npm_config_component,
        entry: `./src/components/${process.env.npm_config_component}/index.tsx`,
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  };
});
