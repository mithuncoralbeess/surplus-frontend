/**
 * Universal URL slug helper for Surplus Market
 */

export function slugify(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  const str = String(text);
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters and numbers in any language, removing symbols
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function createProductUrl(
  category: string | undefined | null,
  titleOrSku: string | number | undefined | null,
  fallbackId?: string | number | undefined | null
): string {
  const catSlug = slugify(category) || 'general';
  let prodSlug = slugify(titleOrSku);
  if (!prodSlug && fallbackId) {
    prodSlug = slugify(fallbackId);
  }
  return `/buy/${catSlug}/${prodSlug || 'item'}`;
}

export function createLotUrl(
  titleOrId: string | number | undefined | null,
  fallbackId?: string | number | undefined | null
): string {
  let lotSlug = slugify(titleOrId);
  if (!lotSlug && fallbackId) {
    lotSlug = slugify(fallbackId);
  }
  return `/buy/lot/${lotSlug || 'lot'}`;
}
