import type { TGenericStatusResponse, TIdName } from "../tmdb/tmdb.interfaces";

export type TSetWatchlistResponse = TGenericStatusResponse;
export type TGenre = TIdName;

export type EMediaTypes = "movies";

export type EMediaType = "movie";

export type TMediaResponse<T> = {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
};

export type TMovie = {
  id: number;
  // TODO Agregar
};

export type TMoviesResponse = TMediaResponse<TMovieThumbnail>;

export type TMovieThumbnail = {
  id: number;
  // TODO Agregar
};
