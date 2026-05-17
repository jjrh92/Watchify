import { useEffect, useState } from 'react';
import {
  addMovieToWatchlist,
  getGenreNameById,
  getMovieTrailer,
  getTopWeekMovie,
} from '../../services/movies/movies.services';
import styles from './Hero.module.css';

type TopWeekMovie = {
  id: number;
  backdrop_path?: string | null;
  vote_average?: number;
  original_title?: string;
  title?: string;
  release_date?: string;
  genre_ids?: number[];
  overview?: string;
};

const fallbackTrailer = 'https://www.youtube.com/watch?v=pIWEpbUCwKw';

function pickTitle(movie: TopWeekMovie): string {
  return movie.original_title ?? movie.title ?? '';
}

function pickYear(date?: string): string {
  return date?.split?.('-')?.[0] ?? '';
}

function pickPrimaryGenre(ids?: number[]): string {
  return getGenreNameById(ids?.[0] ?? 0) || 'Genero desconocido';
}

export function Hero() {
  const [movie, setMovie] = useState<TopWeekMovie | null>(null);
  const [trailerUrl, setTrailerUrl] = useState(fallbackTrailer);

  useEffect(() => {
    let isMounted = true;

    async function loadHero() {
      const topMovie = await getTopWeekMovie();
      if (!isMounted || !topMovie) return;

      setMovie(topMovie);
      const trailerKey = topMovie.id ? await getMovieTrailer(topMovie.id) : null;
      if (isMounted) {
        setTrailerUrl(trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : fallbackTrailer);
      }
    }

    loadHero();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!movie) {
    return <section className={styles.Hero} aria-busy="true" />;
  }

  const title = pickTitle(movie);
  const background = movie.backdrop_path
    ? { background: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path}) center/cover no-repeat` }
    : undefined;

  return (
    <section className={styles.Hero} style={background}>
      <div className={styles.heroContainer}>
        <div className={styles.scoreContainer}>
          <span className={styles.scoreCaption}>TMDB Score</span>
          <div className={styles.scoreStarRatingContainer}>
            <span className={styles.scoreRating}>⭐ {(movie.vote_average ?? 0).toFixed(1)}/10</span>
          </div>
        </div>

        <div className={styles.titleYearGenreContainer}>
          <h1 className={styles.contentTitle}>{title}</h1>
          <h2 className={styles.titleYearGenreText}>
            {pickYear(movie.release_date)} | {pickPrimaryGenre(movie.genre_ids)}
          </h2>
        </div>

        {movie.overview && <p className={styles.contentDescription}>{movie.overview}</p>}

        <div className={styles.heroButtonContainer}>
          <a className={styles.trailerButton} href={trailerUrl} target="_blank" rel="noopener noreferrer">
            Trailer
          </a>
          <button
            className={styles.watchLaterButton}
            type="button"
            onClick={() => addMovieToWatchlist(22245554, movie.id, title)}
          >
            <img src="/save.svg" alt="Guardar" />
            Watch Later
          </button>
        </div>
      </div>
    </section>
  );
}
