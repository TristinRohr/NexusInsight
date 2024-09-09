import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';

// Load .env file manually
dotenv.config({ path: './.env' });

// Use the loaded environment variables
const API_PORT = process.env.VITE_API_PORT || 3001; // Backend API port
const VITE_PORT = process.env.VITE_PORT || 3000;    // Frontend port for Vite dev server


console.log('Vite is running on port:', VITE_PORT); // Add this for debugging

export default defineConfig({
  plugins: [react()],
  server: {
    port: VITE_PORT, // Frontend server port
    proxy: {
      '/graphql': {
        target: `http://localhost:${API_PORT}`, // Backend API target
        changeOrigin: true,
      },
    },
  },
});
