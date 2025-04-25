import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import babel from 'vite-plugin-babel';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'default',
      }
    }),
    babel()
  ],
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      hashPrefix: 'prefix',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: 'nex.moootvey.ru',
    port: 3000,
    https: {
      key: fs.readFileSync('C:\\cert\\privateKey.key'),
      cert: fs.readFileSync('C:\\cert\\certificate.crt'),
      ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256',
      minVersion: 'TLSv1.2'
    },
    hmr: {
      host: 'nex.moootvey.ru',
      port: 3000,
      protocol: 'wss'
    }
    // allowedHosts: [
    //     '.ngrok-free.app',
    // ],
  },
});
