import type { EISO639_1 } from '../../core/tmdb/tmdb.interfaces';

export type TGenericStatusResponse = {
  success: boolean;
  status_code: number;
  status_message: string;
};

export type TGenericConfirmationResponse = {
  success: boolean;
};

export type TAPIConfiguration = {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
};

export type TIdName = {
  id: number;
  name: string;
};

export type TSpokenLanguage = {
  english_name: string;
  iso_639_1: EISO639_1;
  name: string;
};
