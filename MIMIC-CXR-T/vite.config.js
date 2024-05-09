import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
/*
export default defineConfig({
  plugins: [react()],
  ssr: false, // Agrega esta línea
  build: {
    // Otras opciones de construcción si las necesitas
  },
});
*/

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
