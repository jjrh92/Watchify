import { useEffect } from 'react';
import styles from './contentModal.module.css';

export type MediaType = 'movie' | 'tv';

export interface ContentData {
  id?: number;
  title?: string;
  name?: string;
  media_type?: MediaType;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  original_language?: string;
  vote_average?: number;
  vote_count?: number;
  overview?: string;
}

interface ContentModalProps {
  content: ContentData | null;
  onAdd?: (content: ContentData) => void;
  onClose: () => void;
  onRemove?: (content: ContentData) => void;
}

function isMovie(data: ContentData) {
  return data.title !== undefined || data.media_type === 'movie';
}

function isSeries(data: ContentData) {
  return data.name !== undefined || data.media_type === 'tv';
}

function getTitle(data: ContentData) {
  return (isMovie(data) ? data.title : data.name) ?? '';
}

export function ContentModal({
  content, onAdd, onClose, onRemove,
}: ContentModalProps) {
  useEffect(() => {
    if (!content) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [content, onClose]);

  if (!content) return null;

  const movie = isMovie(content);
  const series = isSeries(content);
  const title = getTitle(content);
  const year = (movie ? content.release_date : content.first_air_date)?.slice(0, 4) || '';
  const poster = content.poster_path ? `https://image.tmdb.org/t/p/w342${content.poster_path}` : '';
  const backdrop = content.backdrop_path ? `https://image.tmdb.org/t/p/w780${content.backdrop_path}` : '';

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.modalDialog}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {movie ? 'Movie information and details' : 'Series information and details'}
          </h2>
          <button className={styles.modalClose} type="button" aria-label="Cerrar modal" onClick={onClose}>
            X
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailGrid}>
            {poster && <img className={styles.detailPoster} src={poster} alt={`Poster de ${title}`} />}

            <div className={styles.detailMeta}>
              <h3 className={styles.detailTitle}>
                {title}
                {year ? ` (${year})` : ''}
              </h3>

              <div className={styles.detailChips}>
                {movie && <span className={styles.chip}>Pelicula</span>}
                {series && <span className={styles.chip}>Series</span>}
                {content.original_language && (
                  <span className={styles.chip}>Language: {content.original_language.toUpperCase()}</span>
                )}
                {typeof content.vote_average === 'number' && (
                  <span className={styles.chip}>Score {content.vote_average.toFixed(1)}</span>
                )}
                {typeof content.vote_count === 'number' && (
                  <span className={styles.chip}>{content.vote_count} TMDB Ratings</span>
                )}
              </div>

              {content.overview && <p className={styles.detailOverview}>{content.overview}</p>}
              {backdrop && <img className={styles.detailBackdrop} src={backdrop} alt="" />}

              <div className={styles.actionRow}>
                <button className={styles.btn} type="button" onClick={() => onAdd?.(content)}>
                  Add to Watchlist
                </button>
                <button
                  className={`${styles.btn} ${styles.secondary}`}
                  type="button"
                  onClick={() => onRemove?.(content)}
                >
                  Remove from Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
