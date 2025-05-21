import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.fbx', '**/*.mp3'],
  define: {
    _DEBUG_: JSON.stringify(true),
  },
});
