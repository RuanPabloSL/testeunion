export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

declare global {
  interface Window {
    __SUPABASE_ENV__?: SupabasePublicConfig;
  }
}

/** Lê config pública do Supabase (browser, SSR ou .env local). */
export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  if (typeof window !== "undefined" && window.__SUPABASE_ENV__?.url && window.__SUPABASE_ENV__?.publishableKey) {
    return window.__SUPABASE_ENV__;
  }

  const url =
    import.meta.env.VITE_SUPABASE_URL ||
    (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined) ||
    (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : undefined);

  const publishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof process !== "undefined" ? process.env.SUPABASE_PUBLISHABLE_KEY : undefined) ||
    (typeof process !== "undefined" ? process.env.VITE_SUPABASE_PUBLISHABLE_KEY : undefined);

  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}

/** Usado no servidor (Netlify) para injetar config no HTML — não depende do build VITE_*. */
export function getSupabasePublicConfigForInjection(): SupabasePublicConfig | null {
  if (typeof process === "undefined") return null;

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}

export function getSupabaseConfigErrorMessage(): string {
  return (
    "Supabase não configurado. No Netlify, adicione SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY " +
    "em Site configuration → Environment variables (escopo: All) e faça um novo deploy."
  );
}
