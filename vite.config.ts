import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: ['index.html', 'agency/index.html', 'neurorop/index.html'],
    },
  },
});
