/**
 * TagFilter Alpine.js component.
 * Manages filter state for episode catalogue page.
 * Syncs active tags with URL query parameters.
 */
export function tagFilter() {
  return {
    activeTags: [] as string[],

    init() {
      // Read initial state from URL
      const params = new URLSearchParams(window.location.search);
      const tagParam = params.get('tag');
      if (tagParam) {
        this.activeTags = tagParam.split(',').filter(Boolean);
      }
      this._applyFilter();
    },

    toggle(category: string) {
      const index = this.activeTags.indexOf(category);
      if (index === -1) {
        this.activeTags.push(category);
      } else {
        this.activeTags.splice(index, 1);
      }

      this._syncUrl();
      this._applyFilter();
    },

    isActive(category: string) {
      return this.activeTags.includes(category);
    },

    clearAll() {
      this.activeTags = [];
      this._syncUrl();
      this._applyFilter();
    },

    _syncUrl() {
      const url = new URL(window.location.href);
      if (this.activeTags.length > 0) {
        url.searchParams.set('tag', this.activeTags.join(','));
      } else {
        url.searchParams.delete('tag');
      }
      window.history.replaceState({}, '', url.toString());
    },

    _applyFilter() {
      const cards = document.querySelectorAll<HTMLElement>('[data-episode-card]');
      let visibleCount = 0;

      cards.forEach((card) => {
        if (this.activeTags.length === 0) {
          card.style.display = '';
          visibleCount++;
          return;
        }

        const cardCategory = card.dataset.category ?? '';
        const cardTags = (card.dataset.tags ?? '').split(',').filter(Boolean);
        const allCardValues = [cardCategory, ...cardTags];

        const matches = this.activeTags.some((tag) => allCardValues.includes(tag));
        card.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });

      // Show/hide empty state
      const emptyState = document.querySelector('[data-empty-filter]');
      if (emptyState instanceof HTMLElement) {
        emptyState.style.display = visibleCount === 0 && this.activeTags.length > 0 ? '' : 'none';
      }
    },
  };
}
