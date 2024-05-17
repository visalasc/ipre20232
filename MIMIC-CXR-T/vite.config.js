import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
   port: 8080,
  },
  server: {
   port: 8080,
   host: true,
  },
 });
