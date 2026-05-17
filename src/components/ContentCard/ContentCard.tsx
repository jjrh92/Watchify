import type { KeyboardEvent, MouseEvent } from "react";
import type { ContentData } from "../ContentModal/ContentModal";
import { addToWatchlist, removeFromWatchlist } from "./contentCard.utils";
import styles from "./ContentCard.module.css";

type CardVariant = "trendingList" | "watchList";

interface ContentCardProps {
  content: ContentData;
  onOpen: (content: ContentData) => void;
  variant?: CardVariant;
}

export function ContentCard({
  content,
  onOpen,
  variant = "trendingList",
}: ContentCardProps) {
  const poster = content.poster_path
    ? `https://media.themoviedb.org/t/p/w220_and_h330_face${content.poster_path}`
    : "";

  const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (variant === "watchList") removeFromWatchlist(content);
    else addToWatchlist(content);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(content);
    }
  };

  return (
    <div
      className={styles.ContentCard}
      title="Ver detalles"
      role="button"
      tabIndex={0}
      aria-label="Abrir detalles"
      style={
        poster
          ? { background: `url(${poster}) center/cover no-repeat` }
          : undefined
      }
      onClick={() => onOpen(content)}
      onKeyDown={handleKeyDown}
    >
      <button
        className={styles.contentCardButton}
        type="button"
        title={variant === "watchList" ? "Remove" : "Add"}
        aria-label={
          variant === "watchList"
            ? "Remove from watchlist"
            : "Add to watchlist"
        }
        onClick={handleActionClick}
      >
        <img
          className={styles.savedImage}
          src={variant === "watchList" ? "/delete.svg" : "/save_filled.svg"}
          alt=""
        />
      </button>
    </div>
  );
}
