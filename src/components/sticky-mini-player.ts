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

    dragging: false,

    get progressPercent() {
      const { currentTime, duration } = this.store;
      if (!duration || duration === 0) return 0;
      return (currentTime / duration) * 100;
    },

    startDrag(event: MouseEvent | TouchEvent) {
      const { audio } = this.store;
      const duration = this.store.duration;
      if (!audio || !duration) return;
      this.dragging = true;

      const bar = (event.currentTarget || event.target) as HTMLElement;

      const applySeek = (e: MouseEvent | TouchEvent) => {
        const rect = bar.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newTime = ratio * duration;
        audio.currentTime = newTime;
      };

      applySeek(event);

      const onMove = (e: MouseEvent | TouchEvent) => applySeek(e);

      const onEnd = () => {
        this.dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend', onEnd);
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
