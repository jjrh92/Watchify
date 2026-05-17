import { mergeDeepWithDefault } from "./merge";

export const FetchMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  OPTIONS: "OPTIONS",
  DELETE: "DELETE",
};

export async function fetchBase(url: string, ...options: RequestInit[]) {
  const optionsInternal = mergeDeepWithDefault(
    {
      method: FetchMethods.GET,
      headers: {
        accept: "application/json",
      },
    },
    ...options,
  );

  try {
    const response = await fetch(url, optionsInternal);
    const responseJson = await response.json();

    if (!response.ok) {
      const msg = responseJson && responseJson.status_message;
      throw Error(msg);
    }
    return responseJson;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    throw error;
  }
}
