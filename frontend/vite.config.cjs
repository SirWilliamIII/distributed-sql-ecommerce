const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
import path from "path";

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000',
      '/users': 'http://127.0.0.1:5000',
      '/products': 'http://127.0.0.1:5000',
      '/stock-by-region': 'http://127.0.0.1:5000',
      '/product-stock': 'http://127.0.0.1:5000',
    },
  },
});
