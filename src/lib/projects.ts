import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/realisaties/*/*.jpg', {
  eager: true,
});

/** Alle foto's van een project, gesorteerd op bestandsnaam (01.jpg = omslag). */
export function projectImages(id: string): ImageMetadata[] {
  const prefix = `/src/assets/realisaties/${id}/`;
  const list = Object.entries(images)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
  if (list.length === 0) throw new Error(`Geen foto's gevonden voor project "${id}" in ${prefix}`);
  return list;
}

export type Project = CollectionEntry<'realisaties'> & { cover: ImageMetadata; photos: ImageMetadata[] };

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('realisaties');
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => {
      const photos = projectImages(entry.id);
      return { ...entry, cover: photos[0], photos };
    });
}
