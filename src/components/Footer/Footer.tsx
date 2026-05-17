import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://www.julioreyes.dev/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.portfolioLink}
      >
        julioreyes.dev
      </a>
    </footer>
  );
}
