import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  build: {
    format: 'file'
  },
  integrations: [
    react(), 
    tailwind({ applyBaseStyles: false }) // CRITICAL: Prevents Tailwind from breaking existing Vanilla CSS
  ]
});