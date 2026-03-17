import type { CollectionEntry } from 'astro:content';

/** A full episode collection entry (id + data + body). */
export type Episode = CollectionEntry<'episodes'>;

/** Just the frontmatter data of an episode. */
export type EpisodeData = Episode['data'];

/** Progress tracking for a single episode in localStorage. */
export interface EpisodeProgress {
  /** true when >90% of the episode has been played */
  listened: boolean;
  /** Playback position in seconds — for resume */
  lastTimestamp: number;
}

/** Map of episode slug → progress. Stored in localStorage. */
export type ListenHistory = Record<string, EpisodeProgress>;
