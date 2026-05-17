import { FetchMethods, fetchTMDB } from "../../core";

export function isApiKeyValid() {
  return fetchTMDB("authentication");
}

export function newToken() {
  return fetchTMDB("authentication/token/new");
}

export function login(
  requestToken: string,
  username: string,
  password: string,
) {
  return fetchTMDB("authentication/token/validate_with_login", {
    method: FetchMethods.POST,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      request_token: requestToken,
    }),
  });
}

export function createSession(requestToken: string) {
  return fetchTMDB("authentication/session/new", {
    method: FetchMethods.POST,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      request_token: requestToken,
    }),
  });
}

export function deleteSession(sessionId: string) {
  return fetchTMDB("authentication/session", {
    method: FetchMethods.DELETE,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });
}
