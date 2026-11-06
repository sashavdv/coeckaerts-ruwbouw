// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Definitieve domeinnaam nog niet gekozen. Pas `site` aan zodra het domein vastligt
// (gebruikt voor canonical URLs, Open Graph en sitemap.xml).
export default defineConfig({
  site: 'https://www.bc-bouw.be',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
