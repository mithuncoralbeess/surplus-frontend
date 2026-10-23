/**
 * Profile completion utilities for Surplus Market.
 * Ensures users have completed mandatory onboarding fields before submitting inventory.
 */

export function isProfileComplete(user: any): boolean {
  if (!user || typeof user !== 'object') return false;

  // 1. Country check
  const country = (user.country || user.region || '').toString().trim();
  if (!country || country === '-- Select Country --') {
    return false;
  }

  // 2. Business Location check
  const location = (
    user.business_location ||
    user.businessLocation ||
    user.location ||
    user.business_address ||
    user.address ||
    ''
  ).toString().trim();
  if (!location) {
    return false;
  }

  // 3. Categories Interested check
  const rawCategories =
    user.category_interested ||
    user.categoryInterested ||
    user.categories_interested ||
    user.categories;

  let hasCategory = false;
  if (Array.isArray(rawCategories)) {
    hasCategory = rawCategories.filter(Boolean).length > 0;
  } else if (typeof rawCategories === 'string') {
    hasCategory = rawCategories.trim().length > 0;
  }
  if (!hasCategory) {
    return false;
  }

  // 4. If entity is COMPANY and role is not strictly BUYER, company_name is required
  const entityType = (
    user.account_entity_type ||
    user.accountEntityType ||
    user.entity_type ||
    ''
  ).toString().toUpperCase();

  const userType = (
    user.user_type ||
    user.userType ||
    user.role ||
    ''
  ).toString().toUpperCase();

  const companyName = (
    user.company_name ||
    user.companyName ||
    user.company ||
    user.business_name ||
    ''
  ).toString().trim();

  if (entityType.includes('COMPANY') && userType !== 'BUYER' && !companyName) {
    return false;
  }

  return true;
}
