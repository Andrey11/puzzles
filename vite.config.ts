import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: fileURLToPath(new URL('./src/app', import.meta.url)),
      features: fileURLToPath(new URL('./src/features', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      config: fileURLToPath(new URL('./src/config', import.meta.url)),
      helpers: fileURLToPath(new URL('./src/helpers', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [rootDir, fileURLToPath(new URL('./src', import.meta.url))],
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
