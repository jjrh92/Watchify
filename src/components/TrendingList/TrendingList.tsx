import { useEffect, useState } from "react";
import { getTrendingMovies } from "../../services/movies/movies.services";
import { getTrendingSeries } from "../../services/series/series.services";
import { ContentCard } from "../ContentCard/ContentCard";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../ContentCard/contentCard.utils";
import { type ContentData, ContentModal } from "../ContentModal/ContentModal";
import styles from "./trendingList.module.css";

type TrendingVariant = "all" | "movies" | "series";

interface TrendingListProps {
  variant?: TrendingVariant;
}

const captions: Record<TrendingVariant, string> = {
  all: "Trending Movies & Series",
  movies: "Trending - Movies Only",
  series: "Trending - Series Only",
};

export function TrendingList({ variant = "all" }: TrendingListProps) {
  const [items, setItems] = useState<ContentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadTrending() {
      setIsLoading(true);
      const [movies, series] = await Promise.all([
        variant === "all" || variant === "movies"
          ? getTrendingMovies()
          : Promise.resolve([]),
        variant === "all" || variant === "series"
          ? getTrendingSeries()
          : Promise.resolve([]),
      ]);

      if (isMounted) setItems([...(movies ?? []), ...(series ?? [])]);
      if (isMounted) setIsLoading(false);
    }

    loadTrending();

    return () => {
      isMounted = false;
    };
  }, [variant]);

  return (
    <section className={styles.trendingListContainer}>
      <h1 className={styles.trendingListCaption}>{captions[variant]}</h1>
      <div className={styles.contentCardContainer}>
        {isLoading && <p>Loading trending content...</p>}
        {!isLoading && items.length === 0 && (
          <p>There is no trending content at this time, try again later</p>
        )}
        {!isLoading &&
          items.map((item) => (
            <ContentCard
              key={`${item.media_type ?? item.title ?? item.name}-${item.id}`}
              content={item}
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
