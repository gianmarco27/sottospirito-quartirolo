/**
 * Italian UI strings — single source of truth.
 * Never write inline Italian text in components; always import from here.
 */
export const UI = {
  errors: {
    audioLoad: 'Non riusciamo a caricare l\'audio in questo momento. Prova a ricaricare la pagina.',
    genericError: 'Qualcosa non ha funzionato. Prova a ricaricare la pagina tra qualche istante.',
    noResults: 'Nessun episodio trovato. Prova con altri termini di ricerca.',
    noFilterResults: 'Nessun episodio trovato. Rimuovi filtri per vedere tutti gli episodi.',
    notFound: 'Questa pagina non esiste.',
    goHome: 'Torna alla home',
  },
  labels: {
    play: 'Riproduci',
    pause: 'Pausa',
    loading: 'Caricamento...',
    allEpisodes: 'Tutti gli episodi',
    featuredEpisodes: 'In evidenza',
    latestEpisodes: 'Ultimi episodi',
    listenNow: 'Ascolta ora',
    readMore: 'Leggi tutto',
    search: 'Cerca episodi...',
    minutes: 'min',
    otherEpisodes: 'Altri episodi',
    filterByCategory: 'Filtra per categoria',
    removeFilters: 'Rimuovi filtri',
    skipToContent: 'Salta al contenuto',
    mainNavigation: 'Navigazione principale',
    audioControls: 'Controlli audio',
    home: 'Home',
    archive: 'Archivio',
  },
  site: {
    name: 'Sotto Spirito',
    description: 'Episodi audio pastorali per la comunità cristiana.',
    url: 'https://sottospirito.it',
  },
} as const;
