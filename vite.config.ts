import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: [
        'index.html',
        'revenue-os/index.html',
        'sales-journey/index.html',
        'agency/index.html',
        'neurorop/index.html',
      ],
    },
  },
});
