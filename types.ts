// src/lib/svelte-i18n-kit/types.ts
export type LocaleCode = string;

export interface LocaleConfig {
  id: LocaleCode;
  name: string;
  countryCode?: string;
}

export interface LocaleData {
  [key: string]: any;
}

export interface I18nConfig {
  // Array of available locale codes
  locales: string[];
  // Default locale
  defaultLocale?: string;
  // Fallback locale for missing translations
  fallbackLocale?: string;
  // Mapping of locale codes to their display names
  localeNames?: Record<string, string>;
  // Mapping of locale codes to country codes
  localeCountries?: Record<string, string>;
  // Translation data
  translations: Record<string, Record<string, any>>;
  // LocalStorage key for storing the user's preferred locale
  localStorageKey?: string;
  // Whether to reload the page when changing locale
  reloadOnLocaleChange?: boolean;
} 