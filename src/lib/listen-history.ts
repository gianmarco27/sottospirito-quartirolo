/**
 * Listen history helpers — localStorage read/write.
 * Key: 'sottoSpirito:listenHistory'
 * Never transmitted to any server. No cookies.
 */

import type { EpisodeProgress, ListenHistory } from '@/types/episode';

const STORAGE_KEY = 'sottoSpirito:listenHistory';

export function getHistory(): ListenHistory {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ListenHistory) : {};
  } catch {
    return {};
  }
}

function saveHistory(history: ListenHistory): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or unavailable — silently degrade
  }
}

export function setProgress(slug: string, timestamp: number, listened: boolean): void {
  const history = getHistory();
  history[slug] = { listened, lastTimestamp: timestamp };
  saveHistory(history);
}

export function isListened(slug: string): boolean {
  const history = getHistory();
  return history[slug]?.listened ?? false;
}

export function getProgress(slug: string): EpisodeProgress | undefined {
  const history = getHistory();
  return history[slug];
}
