import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({

  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    global: 'window', // <-- this fixes "global is not defined"
  },
  base: "/", // ✅ Ensures correct path resolution on deployment
  // server: {
  //   proxy: {
  //     '/api': 'http://localhost:8080',
  //   },
  // },
  build: {
    sourcemap: false,   // disables source mapping
  },
})

