import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensures that large assets (like images) are bundled and not inlined
    assetsInlineLimit: 0,  // Forces assets like images to be bundled into separate files

    // You can also set an assets directory if needed
    assetsDir: 'assets',  // Optional: specify the directory for static assets

    // If you're using images directly from the public directory, this is the default setting
    // But if you want to process images, you can enable this option
    rollupOptions: {
      output: {
        // Ensures that static assets are handled properly
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
