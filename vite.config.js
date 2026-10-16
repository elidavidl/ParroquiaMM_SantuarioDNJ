import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: 'localhost', port: 5173, open: true },
  preview: { host: 'localhost', port: 4173 },
});
