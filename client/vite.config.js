// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-router-dom', 'react-datepicker'],
    },
    
  },
  resolve: {
    alias: {
      'date-fns': path.resolve(__dirname, 'node_modules/date-fns'),
    },
  },

});
