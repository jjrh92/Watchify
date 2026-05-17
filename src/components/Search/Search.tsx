import { useCallback, useRef, useState } from "react";
import { searchMovie } from "../../services/movies/movies.services";
import { searchSeries } from "../../services/series/series.services";
import { ContentCard } from "../ContentCard/ContentCard";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../ContentCard/contentCard.utils";
import { type ContentData, ContentModal } from "../ContentModal/ContentModal";
import { SearchModal } from "../SearchModal/SearchModal";
import styles from "./Search.module.css";

type SearchVariant = "all" | "movies" | "series";

interface SearchProps {
  variant?: SearchVariant;
}

function getTitle(variant: SearchVariant, query: string) {
  if (!query) return "Results";
  if (variant === "movies") return `Results (Movies) for "${query}"`;
  if (variant === "series") return `Results (Series) para "${query}"`;
  return `Results (Movies and Series) for "${query}"`;
}

export function Search({ variant = "all" }: SearchProps) {
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [results, setResults] = useState<ContentData[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackState, setFeedbackState] = useState<
    "empty" | "error" | "loading" | ""
  >("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentData | null>(
    null,
  );
  const moviesPageRef = useRef(1);
  const seriesPageRef = useRef(1);
  const requestRef = useRef(0);
  const debounceRef = useRef<number | undefined>(undefined);

  const resetPages = () => {
    moviesPageRef.current = 1;
    seriesPageRef.current = 1;
  };

  const runSearch = useCallback(
    async (nextQuery: string, append = false) => {
      const requestId = requestRef.current + 1;
      requestRef.current = requestId;

      const trimmedQuery = nextQuery.trim();
      setIsModalOpen(true);

      if (!trimmedQuery) {
        setResults([]);
        setFeedback(
          "Type to search first. Search for movies, series, or both! Search query cannot be empty.",
        );
        setFeedbackState("empty");
        setCanLoadMore(false);
        resetPages();
        return;
      }

      if (trimmedQuery !== lastQuery) {
        resetPages();
        setResults([]);
        setLastQuery(trimmedQuery);
      }

      setIsLoading(true);
      setFeedback("Searching...");
      setFeedbackState("loading");

      try {
        let movies: ContentData[] = [];
        let series: ContentData[] = [];

        if (variant === "movies") {
          movies = await searchMovie(trimmedQuery, moviesPageRef.current);
        } else if (variant === "series") {
          series = await searchSeries(trimmedQuery, seriesPageRef.current);
        } else {
          [movies, series] = await Promise.all([
            searchMovie(trimmedQuery, moviesPageRef.current),
            searchSeries(trimmedQuery, seriesPageRef.current),
          ]);
        }

        if (requestRef.current !== requestId) return;

        const combined = [...(movies ?? []), ...(series ?? [])];
        setResults((current) =>
          append ? [...current, ...combined] : combined,
        );
        setFeedback(combined.length ? "" : `No results for "${trimmedQuery}".`);
        setFeedbackState(combined.length ? "" : "empty");
        setCanLoadMore(movies.length >= 20 || series.length >= 20);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Search failed. Please try again later.";
        setFeedback(message);
        setFeedbackState("error");
        setCanLoadMore(false);
      } finally {
        if (requestRef.current === requestId) setIsLoading(false);
      }
    },
    [lastQuery, variant],
  );

  const handleLoadMore = () => {
    if (isLoading || !lastQuery) return;
    if (variant === "movies") {
      moviesPageRef.current += 1;
    } else if (variant === "series") {
      seriesPageRef.current += 1;
    } else {
      moviesPageRef.current += 1;
      seriesPageRef.current += 1;
    }
    runSearch(lastQuery, true);
  };

  const feedbackClassName = [
    styles.feedback,
    feedbackState
      ? styles[`is${feedbackState[0].toUpperCase()}${feedbackState.slice(1)}`]
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={styles.Search}>
      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          placeholder="Search"
          autoComplete="off"
          aria-label="Search"
          value={query}
          id="searchInput"
          name="searchInput"
          onChange={(event) => {
            const nextValue = event.target.value;
            setQuery(nextValue);
            window.clearTimeout(debounceRef.current);
            debounceRef.current = window.setTimeout(
              () => runSearch(nextValue, false),
              600,
            );
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              runSearch(query, false);
            }
          }}
        />
        <button
          className={styles.searchButton}
          type="button"
          aria-label="Search"
          onClick={() => runSearch(query, false)}
        >
          <img className={styles.searchImage} src="/search.svg" alt="" />
        </button>
      </div>

      <SearchModal
        isOpen={isModalOpen}
        title={getTitle(variant, lastQuery || query)}
        onClose={() => setIsModalOpen(false)}
      >
        <div className={feedbackClassName}>{feedback}</div>
        <div className={styles.resultsGrid}>
          {results.map((item) => (
            <ContentCard
              key={`${item.media_type ?? item.title ?? item.name}-${item.id}`}
              content={item}
              onOpen={setSelectedContent}
            />
          ))}
        </div>
        {canLoadMore && (
          <button
            className={styles.loadMore}
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            Load more results
          </button>
        )}
      </SearchModal>

      <ContentModal
        content={selectedContent}
        onAdd={addToWatchlist}
        onRemove={removeFromWatchlist}
        onClose={() => setSelectedContent(null)}
      />
    </section>
  );
}
