/**
 * StickyMiniPlayer Alpine.js component.
 * Shares state with AudioPlayer via Alpine.store('player').
 * Appears when the expanded player scrolls out of view.
 */
export function stickyMiniPlayer() {
  return {
    visible: false,
    observer: null as IntersectionObserver | null,

    init() {
      const expandedPlayer = document.querySelector('[data-audio-player]');
      if (!expandedPlayer) return;

      this.observer = new IntersectionObserver(
        ([entry]) => {
          // Show mini player when expanded player is NOT visible
          this.visible = !entry.isIntersecting;
        },
        { threshold: 0 },
      );

      this.observer.observe(expandedPlayer);
    },

    destroy() {
      this.observer?.disconnect();
    },

    get store() {
      return Alpine.store('player') as {
        playing: boolean;
        currentTime: number;
        duration: number;
        slug: string;
        audio: HTMLAudioElement | null;
      };
    },

    togglePlay() {
      const { audio } = this.store;
      if (!audio) return;

      if (this.store.playing) {
        audio.pause();
      } else {
        audio.play().catch(() => {
          // silently fail
        });
      }
    },

    get progressPercent() {
      const { currentTime, duration } = this.store;
      if (!duration || duration === 0) return 0;
      return (currentTime / duration) * 100;
    },

    formatTime(seconds: number) {
      if (!seconds || !isFinite(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    },
  };
}

import Alpine from 'alpinejs';
