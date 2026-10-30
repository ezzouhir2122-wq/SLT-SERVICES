/**
 * Choisit le back-end de stockage au démarrage.
 * Supabase si SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY sont définis,
 * sinon repli automatique sur la base fichier (data/db.json).
 */
import type { Store } from './store.ts';
import { FileStore } from './fileStore.ts';
import { SupabaseStore } from './supabaseStore.ts';

export function createStore(): Store {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    console.log('[store] back-end Supabase activé →', url);
    return new SupabaseStore(url, key);
  }

  console.log('[store] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY absents → base fichier (data/db.json)');
  return new FileStore();
}
