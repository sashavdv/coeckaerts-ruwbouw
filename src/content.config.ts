import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Eén markdown-bestand per project in src/content/realisaties/.
// De foto's staan in src/assets/realisaties/<bestandsnaam>/ (01.jpg = omslagfoto).
const realisaties = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/realisaties' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(['Nieuwbouw', 'Renovatie', 'Gevelwerk']),
    location: z.string().optional(),
    period: z.string().optional(),
    works: z.array(z.string()),
    order: z.number(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { realisaties };
