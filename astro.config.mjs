// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Standaard: het eigen domein (pas aan zodra het domein vastligt).
// Voor GitHub Pages zet de workflow SITE_URL en BASE_PATH, zodat de site
// in de submap /<repo>/ werkt. Interne links gebruiken daarom url() uit src/lib/url.ts.
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.bc-bouw.be',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
