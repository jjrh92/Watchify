import type { MouseEvent } from 'react';
import styles from './Header.module.css';

export type Route = '/' | '/movies' | '/series';

interface HeaderProps {
  onNavigate: (route: Route) => void;
  currentRoute?: Route;
}

function handleNav(event: MouseEvent<HTMLAnchorElement>, route: Route, onNavigate: (route: Route) => void) {
  event.preventDefault();
  onNavigate(route);
}

export function Header({ currentRoute = '/', onNavigate }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.leftContainer}>
        <a className={styles.logoLink} href="/" onClick={(event) => handleNav(event, '/', onNavigate)}>
          <img className={styles.logoImage} src="/logo.svg" alt="Logo" title="All - Movies & Series" />
        </a>

        <nav className={styles.linksContainer} aria-label="Content">
          <a
            className={`${styles.contentLink} ${currentRoute === '/movies' ? styles.activeContentLink : ''}`}
            href="/peliculas"
            aria-current={currentRoute === '/movies' ? 'page' : undefined}
            onClick={(event) => handleNav(event, '/movies', onNavigate)}
          >
            Movies
          </a>
          <a
            className={`${styles.contentLink} ${currentRoute === '/series' ? styles.activeContentLink : ''}`}
            href="/series"
            aria-current={currentRoute === '/series' ? 'page' : undefined}
            onClick={(event) => handleNav(event, '/series', onNavigate)}
          >
            Series
          </a>
        </nav>
      </div>
    </header>
  );
}
