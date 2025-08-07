import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL;
  const plugins = [
    react(),
  ];

  // Solo agrega visualizer si ANALYZE=true
if (process.env.ANALYZE === 'true') {
  plugins.push(
    visualizer({
      filename: './stats.html',
      open: true,
          gzipSize: true,
        brotliSize: true,
    })
  );
}


  return {
    server: {
      host: true,
      port: 5173,
      proxy: mode === 'production' ? undefined : {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    plugins,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['axios'], // reemplaza por tus libs pesadas
          },
        },
      },
    },
  };
});