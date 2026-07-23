/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_OCTOMO_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
