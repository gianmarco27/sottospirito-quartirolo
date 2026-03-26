import Alpine from 'alpinejs';

/**
 * AudioPlayer Alpine.js component.
 * Reads data-* attributes from Astro wrapper.
 * Shares state via Alpine.store('player').
 */
export function audioPlayer() {
  return {
    slug: '',
    audioUrl: '',
    audio: null as HTMLAudioElement | null,
    playing: false,
    loading: false,
    currentTime: 0,
    duration: 0,
    error: false,

    init() {
      const el = (this as unknown as { $el: HTMLElement }).$el;
      this.slug = el.dataset.episodeSlug ?? '';
      this.audioUrl = el.dataset.audioUrl ?? '';

      this.audio = el.querySelector('audio');
      if (!this.audio) return;

      this.audio.src = this.audioUrl;
      this.audio.preload = 'metadata';

      // Restore resume position from listen history
      const store = Alpine.store('player') as Record<string, unknown>;
      store.audio = this.audio;
      store.slug = this.slug;
      store.playing = false;

      const history = Alpine.store('history') as Record<string, unknown>;
      const progress = (history.entries as Record<string, { lastTimestamp: number; listened: boolean }> | undefined)?.[this.slug];
      if (progress && progress.lastTimestamp > 0 && !progress.listened) {
        this._seekOnFirstPlay = progress.lastTimestamp;
      }

      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio!.duration;
        (Alpine.store('player') as Record<string, unknown>).duration = this.duration;
        if (this._seekOnFirstPlay) {
          this.audio!.currentTime = this._seekOnFirstPlay;
          this.currentTime = this._seekOnFirstPlay;
          this._seekOnFirstPlay = 0;
        }
      });

      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio!.currentTime;
        const playerStore = Alpine.store('player') as Record<string, unknown>;
        playerStore.currentTime = this.currentTime;

        // Save progress periodically
        if (Math.floor(this.currentTime) % 5 === 0 && this.currentTime > 0) {
          this._saveProgress(false);
        }
      });

      this.audio.addEventListener('play', () => {
        this.playing = true;
        this.loading = false;
        (Alpine.store('player') as Record<string, unknown>).playing = true;
      });

      this.audio.addEventListener('pause', () => {
        this.playing = false;
        this.loading = false;
        (Alpine.store('player') as Record<string, unknown>).playing = false;
      });

      this.audio.addEventListener('ended', () => {
        this.currentTime = 0;
        this._saveProgress(true);
      });

      this.audio.addEventListener('waiting', () => {
        if (this.playing) this.loading = true;
      });

      this.audio.addEventListener('canplay', () => {
        this.loading = false;
      });

      this.audio.addEventListener('error', () => {
        this.error = true;
        this.loading = false;
      });
    },

    _seekOnFirstPlay: 0,

    togglePlay() {
      if (!this.audio || this.error) return;

      if (this.playing) {
        this.audio.pause();
      } else {
        this.loading = true;
        this.audio.play().catch(() => {
          this.error = true;
          this.loading = false;
        });
      }
    },

    seek(event: MouseEvent | TouchEvent) {
      if (!this.audio || this.duration === 0) return;

      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = ratio * this.duration;

      this.audio.currentTime = newTime;
      this.currentTime = newTime;
    },

    seekRelative(seconds: number) {
      if (!this.audio || this.duration === 0) return;
      const newTime = Math.max(0, Math.min(this.duration, this.audio.currentTime + seconds));
      this.audio.currentTime = newTime;
      this.currentTime = newTime;
    },

    get progressPercent() {
      if (this.duration === 0) return 0;
      return (this.currentTime / this.duration) * 100;
    },

    formatTime(seconds: number) {
      if (!seconds || !isFinite(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    },

    _saveProgress(listened: boolean) {
      const historyStore = Alpine.store('history') as { save: (slug: string, timestamp: number, listened: boolean) => void };
      if (historyStore && typeof historyStore.save === 'function') {
        historyStore.save(this.slug, this.currentTime, listened);
      }
    },
  };
}
