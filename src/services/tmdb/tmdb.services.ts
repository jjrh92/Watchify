import { fetchTMDB } from '../../core';

export function getConfiguration() {
  return fetchTMDB('configuration');
}
