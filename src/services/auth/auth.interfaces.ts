import type { TGenericConfirmationResponse, TGenericStatusResponse } from '../tmdb/tmdb.interfaces';

export type TApiKeyValidResponse = TGenericStatusResponse;
export type TSessionDeleteResponse = TGenericConfirmationResponse;

export type TLoginResponse = {
  success: boolean;
  expires_at: string;
  request_token: string;
};

export type TSessionResponse = {
  success: boolean;
  session_id: string;
};
