import { Search } from '../Search/Search';
import { TrendingList } from '../TrendingList/TrendingList';
import { WatchList } from '../WatchList/WatchList';
import styles from './MovieSection.module.css';

export function MovieSection() {
  return (
    <section className={styles.movieSection}>
      <Search variant="movies" />
      <WatchList />
      <TrendingList variant="movies" />
    </section>
  );
}
