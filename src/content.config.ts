import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      audioUrl: z.string().url(),
      infographic: image(),
      infographicAlt: z.string().default(''),
      duration: z.string(),
      tags: z.array(z.string()),
      category: z.string(),
      featured: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      welcomeHeading: z.string().optional(),
      welcomeBody: z.string().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional().default(''),
    }),
});

export const collections = { episodes, pages };
