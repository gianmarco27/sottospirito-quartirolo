// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://sottospirito.org',
  integrations: [sitemap()],

  image: {
    domains: ['media.sottospirito.org'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});