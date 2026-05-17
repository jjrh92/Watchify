import { fetchTMDB } from '../../core/tmdb/fetch';

// ---------------- Tipos mínimos (opcional, útiles para TS) ----------------
type TMDBVideo = {
  id: string;
  key: string;
  name: string;
  site: 'YouTube' | string;
  type: 'Trailer' | 'Teaser' | string;
  official?: boolean;
};

type TMDBMovie = {
  id: number;
  title?: string;
  original_title?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  overview?: string;
  release_date?: string;
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

// Retorna el top1 de películas populares de la semana para el hero/banner
export async function getTopWeekMovie(): Promise<TMDBMovie | null> {
  const data = (await fetchTMDB('/trending/movie/week')) as TMDBPaginated<TMDBMovie>;
  return data.results?.[0] ?? null;
}

// Géneros de películas desde TMDB para su uso posterior.
const movieGenres = {
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ],
} as const;

// Función para obtener el nombre del género a partir de su ID
export function getGenreNameById(id: number): string | null {
  const genre = movieGenres.genres.find((g) => g.id === id);
  return genre ? genre.name : null;
}

// Obtener el primer trailer de YouTube, priorizando "Trailer" oficial
export async function getMovieTrailer(movieId: number): Promise<string | null> {
  const data = (await fetchTMDB(`/movie/${movieId}/videos`)) as { id: number; results: TMDBVideo[] };
  const vids = Array.isArray(data.results) ? data.results : [];

  // 1) Trailer oficial en YouTube
  const official = vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official);
  if (official?.key) return official.key;

  // 2) Cualquier Trailer en YouTube
  const anyTrailer = vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  if (anyTrailer?.key) return anyTrailer.key;

  // 3) Fallback: primer video de YouTube
  const firstYT = vids.find((v) => v.site === 'YouTube');
  return firstYT?.key ?? null;
}

// Obtener listado de todas las películas en watchlist de un usuario
export async function getWatchlistMovies(accountId: number, page = 1): Promise<TMDBMovie[]> {
  // Ruta correcta, con slash inicial y accountId interpolado
  const data = (await fetchTMDB(`/account/${accountId}/watchlist/movies?page=${page}`)) as TMDBPaginated<TMDBMovie>;
  return data.results ?? [];
}

// Obtener listado de las películas en tendencia actualmente
export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  const data = (await fetchTMDB('/trending/movie/day?language=en-US')) as TMDBPaginated<TMDBMovie>;
  return data.results ?? [];
}

// Agregar una película al watchlist del usuario verificando si ya existe previamente
export async function addMovieToWatchlist(accountId: number, movieId: number, movieTitle: string): Promise<void> {
  const currentList = await getWatchlistMovies(accountId);

  const alreadyExists = currentList.some((movie) => movie.id === movieId);
  if (alreadyExists) {
    alert(`"${movieTitle}" was already on watchlist✅\nNothing new to add❌`);
    return;
  }

  const body = {
    media_type: 'movie',
    media_id: movieId,
    watchlist: true,
  };

  await fetchTMDB(`/account/${accountId}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  alert(`"${movieTitle}" added succesfully ✅`);
  window.location.reload();
}

// Eliminar una película del watchlist
export async function removeMovieFromWatchlist(accountId: number, movieId: number, movieTitle: string): Promise<void> {
  const body = {
    media_type: 'movie',
    media_id: movieId,
    watchlist: false,
  };

  await fetchTMDB(`/account/${accountId}/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  alert(`"${movieTitle}" removed succesfully🗑️`);
  window.location.reload();
}

// Buscar una película por su nombre
export async function searchMovie(query: string, page = 1): Promise<TMDBMovie[]> {
  const q = query?.trim();
  if (!q) {
    throw new Error('You must enter a search query.');
  }

  const data = (await fetchTMDB(
    `/search/movie?query=${encodeURIComponent(q)}&page=${page}`,
  )) as TMDBPaginated<TMDBMovie>;
  return data.results ?? [];
}
