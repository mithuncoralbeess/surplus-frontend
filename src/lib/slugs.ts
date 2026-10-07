/**
 * Universal URL slug helper for Surplus Market
 */

export function slugify(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  const str = String(text);
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric chars except space & dash
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function createProductUrl(category: string | undefined | null, titleOrSku: string | number | undefined | null): string {
  const catSlug = slugify(category) || 'general';
  const prodSlug = slugify(titleOrSku) || 'item';
  return `/buy/${catSlug}/${prodSlug}`;
}

export function createLotUrl(titleOrId: string | number | undefined | null): string {
  const lotSlug = slugify(titleOrId) || 'lot';
  return `/buy/lot/${lotSlug}`;
}
