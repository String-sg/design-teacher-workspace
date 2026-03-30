import path from 'node:path';

import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: 'web',
  plugins: [
    TanStackRouterVite({ routesDirectory: './routes', generatedRouteTree: './routeTree.gen.ts' }),
    react(),
    tailwindcss(),
    viteTsConfigPaths({ projects: ['../tsconfig.json'] }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, 'web'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
