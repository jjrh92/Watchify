const StoragePrefix = {
  token: "t",
  sessionId: "s",
  accountId: "u",
  imageURL: "i",
  language: "l",
  region: "r",
};

export class Store {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  clear() {
    this.storage.clear();
  }

  setToken(token: string) {
    this.storage.setItem(StoragePrefix.token, token);
  }

  getToken() {
    return this.storage.getItem(StoragePrefix.token);
  }

  getSessionId() {
    return this.storage.getItem(StoragePrefix.sessionId);
  }

  setSessionId(sessionId: string) {
    this.storage.setItem(StoragePrefix.sessionId, sessionId);
  }

  getAccountId() {
    const number = this.storage.getItem(StoragePrefix.accountId);
    return number ? parseInt(number) : null;
  }

  setAccountId(accountId: number) {
    this.storage.setItem(StoragePrefix.accountId, `${accountId}`);
  }

  getImageURL() {
    return this.storage.getItem(StoragePrefix.imageURL);
  }

  setImageURL(imageURL: string) {
    this.storage.setItem(StoragePrefix.imageURL, imageURL);
  }

  getLanguage() {
    return this.storage.getItem(StoragePrefix.language);
  }

  setLanguage(language: string) {
    this.storage.setItem(StoragePrefix.language, language);
  }

  getRegion() {
    return this.storage.getItem(StoragePrefix.region);
  }

  setRegion(region: string) {
    this.storage.setItem(StoragePrefix.region, region);
  }
}
