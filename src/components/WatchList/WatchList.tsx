import { useEffect, useState } from "react";
import { getWatchlistMovies } from "../../services/movies/movies.services";
import { getWatchListSeries } from "../../services/series/series.services";
import { ContentCard } from "../ContentCard/ContentCard";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../ContentCard/contentCard.utils";
import { type ContentData, ContentModal } from "../ContentModal/ContentModal";
import styles from "./watchList.module.css";

interface WatchListProps {
  accountId?: number;
}

export function WatchList({ accountId = 22245554 }: WatchListProps) {
  const [items, setItems] = useState<ContentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadWatchList() {
      setIsLoading(true);
      const [movies, series] = await Promise.all([
        getWatchlistMovies(accountId),
        getWatchListSeries(accountId),
      ]);
      if (isMounted) setItems([...(movies ?? []), ...(series ?? [])]);
      if (isMounted) setIsLoading(false);
    }

    loadWatchList();

    return () => {
      isMounted = false;
    };
  }, [accountId]);

  return (
    <section
      className={styles.watchListContainer}
      aria-labelledby="watchlist-caption"
    >
      <h1 id="watchlist-caption" className={styles.watchListCaption}>
        Saved Content
      </h1>
      <div className={styles.contentCardContainer}>
        {isLoading && <p>Loading Watchlist...</p>}
        {!isLoading && items.length === 0 && (
          <p>There is no saved content yet</p>
        )}
        {!isLoading &&
          items.map((item) => (
            <ContentCard
              key={`${item.media_type ?? item.title ?? item.name}-${item.id}`}
              content={item}
              variant="watchList"
              onOpen={setSelectedContent}
            />
          ))}
      </div>
      <ContentModal
        content={selectedContent}
        onAdd={addToWatchlist}
        onRemove={removeFromWatchlist}
        onClose={() => setSelectedContent(null)}
      />
    </section>
  );
}
