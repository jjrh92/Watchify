import { fetchTMDB } from '../../core/tmdb/fetch';

// ---------------- Constantes ----------------
export const DEFAULT_ACCOUNT_ID = 22245554 as const;

// ---------------- Tipos mínimos útiles para TS ----------------
type TMDBSeries = {
  id: number;
  name?: string;
  original_name?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  overview?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_average?: number;
};

type TMDBPaginated<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

// ---------------- Servicios ----------------

// Obtener listado de todas las series en watchlist de un usuario (paginado)
export async function getWatchListSeries(accountId: number = DEFAULT_ACCOUNT_ID, page = 1): Promise<TMDBSeries[]> {
  const data = (await fetchTMDB(`/account/${accountId}/watchlist/tv?page=${page}`)) as TMDBPaginated<TMDBSeries>;
  return data.results ?? [];
}

// Obtener listado de las series en tendencia actualmente
export async function getTrendingSeries(): Promise<TMDBSeries[]> {
  const data = (await fetchTMDB('/trending/tv/day?language=en-US')) as TMDBPaginated<TMDBSeries>;
  return data.results ?? [];
}

// Agregar una serie al watchlist del usuario verificando si ya existe previamente
export async function addSeriesToWatchlist(accountId: number, seriesId: number, seriesTitle: string): Promise<void> {
  const currentList = await getWatchListSeries(accountId);

  const alreadyExists = currentList.some((series) => series.id === seriesId);
  if (alreadyExists) {
    alert(`"${seriesTitle}" was already on watchlist✅\nNothing new to add❌`);
    return;
  }

  const body = {
    media_type: 'tv',
    media_id: seriesId,
    watchlist: true,
  };

  await fetchTMDB(`/account/${accountId}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  alert(`"${seriesTitle}" added succesfully ✅`);
  window.location.reload();
}

// Eliminar una serie del watchlist
export async function removeSeriesFromWatchlist(
  accountId: number,
  seriesId: number,
  seriesTitle: string,
): Promise<void> {
  const body = {
    media_type: 'tv',
    media_id: seriesId,
    watchlist: false,
  };

  await fetchTMDB(`/account/${accountId}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  alert(`"${seriesTitle}" removed succesfully🗑️`);
  window.location.reload();
}

// Buscar una serie por su nombre
export async function searchSeries(query: string, page = 1): Promise<TMDBSeries[]> {
  const q = query?.trim();
  if (!q) {
    throw new Error('You must enter a search query.');
  }

  const data = (await fetchTMDB(`/search/tv?query=${encodeURIComponent(q)}&page=${page}`)) as TMDBPaginated<TMDBSeries>;
  return data.results ?? [];
}
