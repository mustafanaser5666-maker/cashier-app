import { defineConfig } from 'vite';

export default defineConfig({
  // إعدادات أساسية لضمان عمل البناء السريع مباشرة من المجلد الرئيسي
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000
  }
});
