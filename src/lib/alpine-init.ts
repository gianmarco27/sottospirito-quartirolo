/**
 * Alpine.js initialization — loaded once in base-layout.astro.
 * Registers all stores and components.
 */
import Alpine from 'alpinejs';
// @ts-expect-error — no type declarations for @alpinejs/persist
import persist from '@alpinejs/persist';
import { audioPlayer } from '@/components/audio-player';
import { stickyMiniPlayer } from '@/components/sticky-mini-player';
import { tagFilter } from '@/components/tag-filter-chip';

type HistoryEntries = Record<string, { listened: boolean; lastTimestamp: number }>;

// Plugins
Alpine.plugin(persist);

// Stores
Alpine.store('player', {
  audio: null as HTMLAudioElement | null,
  slug: '',
  playing: false,
  currentTime: 0,
  duration: 0,
});

/**
 * Listen history store.
 * Uses localStorage directly instead of $persist to avoid TS issues.
 * Key: 'sottoSpirito:listenHistory'
 */
const HISTORY_KEY = 'sottoSpirito:listenHistory';

function loadHistory(): HistoryEntries {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveHistory(entries: HistoryEntries): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

Alpine.store('history', {
  entries: loadHistory(),

  save(slug: string, timestamp: number, listened: boolean) {
    const entries = (this as unknown as { entries: HistoryEntries }).entries;
    entries[slug] = { listened, lastTimestamp: timestamp };
    saveHistory(entries);
  },

  isListened(slug: string): boolean {
    const entries = (this as unknown as { entries: HistoryEntries }).entries;
    return entries[slug]?.listened ?? false;
  },
});

// Components
Alpine.data('audioPlayer', audioPlayer);
Alpine.data('stickyMiniPlayer', stickyMiniPlayer);
Alpine.data('tagFilter', tagFilter);

// Start
Alpine.start();
