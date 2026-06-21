import { createClient } from "@supabase/supabase-js";

import {
  getSupabaseConfigErrorMessage,
  getSupabasePublicConfig,
} from "@/lib/supabase-env";
import type { Database } from "./types";

function createSupabaseClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    const message = getSupabaseConfigErrorMessage();
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(config.url, config.publishableKey, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicConfig() !== null;
}

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
