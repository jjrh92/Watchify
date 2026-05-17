import { fetchBase } from "../utils";
import { getLang, getRegion } from "./lang";

export async function fetchTMDB(uri: string, options = {}) {
  const url = new URL("https://api.themoviedb.org/3/" + uri);
  url.searchParams.set("language", getLang());
  url.searchParams.set("region", getRegion());

  return fetchBase(
    url.href,
    {
      headers: {
        authorization: import.meta.env.VITE_ACCESS_TOKEN,
      },
    },
    options || {},
  );
}
