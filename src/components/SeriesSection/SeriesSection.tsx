import { Search } from '../Search/Search';
import { TrendingList } from '../TrendingList/TrendingList';
import { WatchList } from '../WatchList/WatchList';
import styles from './SeriesSection.module.css';

export function SeriesSection() {
  return (
    <section className={styles.seriesSection}>
      <Search variant="series" />
      <WatchList />
      <TrendingList variant="series" />
    </section>
  );
}
