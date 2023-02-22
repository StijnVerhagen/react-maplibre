import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import { resolve } from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(['react-moment'])],
    },
  },
  resolve: {
    alias: {
      '@Components': resolve(__dirname, 'src/components'),
      '@Pages': resolve(__dirname, 'src/pages'),
      '@Core': resolve(__dirname, 'src/core'),
      '@Api': resolve(__dirname, 'src/api'),
      
    },
  },
});
