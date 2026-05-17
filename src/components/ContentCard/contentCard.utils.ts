import {
  addMovieToWatchlist,
  removeMovieFromWatchlist,
} from "../../services/movies/movies.services";
import {
  addSeriesToWatchlist,
  removeSeriesFromWatchlist,
} from "../../services/series/series.services";
import type { ContentData } from "../ContentModal/ContentModal";

const accountId = 22245554;

function isMovie(content: ContentData) {
  return content.title !== undefined || content.media_type === "movie";
}

function isSeries(content: ContentData) {
  return content.name !== undefined || content.media_type === "tv";
}

export function getContentTitle(content: ContentData) {
  return (isMovie(content) ? content.title : content.name) ?? "";
}

export function addToWatchlist(content: ContentData) {
  const title = getContentTitle(content);
  if (typeof content.id !== "number") return;
  if (isMovie(content)) addMovieToWatchlist(accountId, content.id, title);
  else if (isSeries(content))
    addSeriesToWatchlist(accountId, content.id, title);
}

export function removeFromWatchlist(content: ContentData) {
  const title = getContentTitle(content);
  if (typeof content.id !== "number") return;
  if (isMovie(content)) removeMovieFromWatchlist(accountId, content.id, title);
  else if (isSeries(content))
    removeSeriesFromWatchlist(accountId, content.id, title);
}
