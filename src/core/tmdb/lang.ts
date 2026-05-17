import { store } from "../config";

export function getLang() {
  return store.getLanguage() || "en";
}

export function getRegion() {
  return store.getRegion() || "ES";
}

export function setLang(region = "ES", lang = "en") {
  store.setRegion(region);
  store.setLanguage(lang);
}
