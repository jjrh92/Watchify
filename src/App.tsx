import { useState } from "react";
import "./App.css";
import { Header, type Route } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { Search } from "./components/Search/Search";
import { WatchList } from "./components/WatchList/WatchList";
import { TrendingList } from "./components/TrendingList/TrendingList";
import { MovieSection } from "./components/MovieSection/MovieSection";
import { SeriesSection } from "./components/SeriesSection/SeriesSection";
import { Footer } from "./components/Footer/Footer";

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>("/");

  return (
    <div className="app">
      <Header currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      <main className="appMain">
        {currentRoute === "/" && (
          <>
            <Hero />
            <Search />
            <WatchList />
            <TrendingList variant="all" />
          </>
        )}
        {currentRoute === "/movies" && <MovieSection />}
        {currentRoute === "/series" && <SeriesSection />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
