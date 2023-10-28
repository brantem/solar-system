import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      preRenderCSSCode(code) {
        return code.replace(/--tw-/g, '--ganymede-');
      },
    }),
  ],
  preview: {
    port: 7001,
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      input: resolve(__dirname, 'src/Ganymede.tsx'),
      output: {
        format: 'esm',
        entryFileNames: 'bundle.js',
      },
      preserveEntrySignatures: 'exports-only',
    },
  },
});
