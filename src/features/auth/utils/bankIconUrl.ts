const ASSETS_BUCKET = 'assets'
const BANKS_PREFIX = 'banks'

export function getBankStorageIconUrl(svgFilename: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
  if (!base || !svgFilename) return ''

  return `${base}/storage/v1/object/public/${ASSETS_BUCKET}/${BANKS_PREFIX}/${svgFilename}`
}
