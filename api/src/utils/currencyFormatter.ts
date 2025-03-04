
/**
 * Formats a given amount to a specific currency format with user preferences.
 * @param amount - The amount to be formatted.
 * @param currency - The currency code (default: 'EUR', or user's preference).
 * @param locale - The locale to format the currency (default: auto-detected or user preference).
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number, currency?: string, locale?: string): string => {
  try {
    // Detect user preferences for locale & currency (if in browser)
    const userLocale = locale || (typeof localStorage !== 'undefined' && localStorage.getItem('userLocale')) || 
                       (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

    const userCurrency = currency || (typeof localStorage !== 'undefined' && localStorage.getItem('userCurrency')) || 'EUR';

    return new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: userCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error(`Error formatting currency: ${error}`);
    return `${currency || 'EUR'} ${amount.toFixed(2)}`; // Fallback
  }
};

/**
 * Saves user currency and locale preferences (if in a browser environment).
 * @param currency - The preferred currency code (e.g., 'USD', 'GBP').
 * @param locale - The preferred locale (e.g., 'en-GB', 'fr-FR').
 */
export const setUserPreferences = (currency: string, locale: string): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('userCurrency', currency);
    localStorage.setItem('userLocale', locale);
  }
};
