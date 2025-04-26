import { addMessages, init, getLocaleFromNavigator, locale, dictionary, _ } from 'svelte-i18n';
import { browser } from '$app/environment';
import { derived, get, writable, type Readable } from 'svelte/store';
import type { LocaleConfig, LocaleData, I18nConfig } from './types';

// Track initialization state
let initialized = false;

// Store for i18n configuration
export const i18nConfig = writable<I18nConfig>({
  locales: [],
  defaultLocale: 'en',
  fallbackLocale: 'en',
  localeNames: {},
  localeCountries: {},
  translations: {},
  localStorageKey: 'preferred-locale'
});

// Reset initialization flag
export function resetInitialization(): void {
  initialized = false;
}

// Client-side initialization
export function setupI18n(): void {
  // Do nothing if already initialized
  if (initialized) {
    console.debug('i18n already initialized, skipping');
    return;
  }
  
  const config = get(i18nConfig);
  
  // Add all translations
  Object.entries(config.translations).forEach(([localeCode, translation]) => {
    addMessages(localeCode, translation);
  });
  
  // Set initial locale
  const initialLocale = browser ? getInitialLocale() : (config.defaultLocale || 'en');
  console.debug(`Setting up i18n with initial locale: ${initialLocale}`);
  
  // Initialize
  init({
    fallbackLocale: config.fallbackLocale || 'en',
    initialLocale: initialLocale,
  });
  
  // Set initial language (browser environment only)
  if (browser) {
    setTimeout(() => {
      locale.set(initialLocale);
      console.debug(`Locale set to: ${initialLocale}`);
    }, 0);
  }
  
  // Initialization complete
  initialized = true;
}

// SSR initialization
export function setupI18nSSR(): void {
  // Do nothing if already initialized
  if (initialized) return;

  const config = get(i18nConfig);
  
  // Add all translations
  Object.entries(config.translations).forEach(([localeCode, translation]) => {
    addMessages(localeCode, translation);
  });
  
  // Initialize (always use default language on server-side)
  init({
    fallbackLocale: config.fallbackLocale || 'en',
    initialLocale: config.defaultLocale || 'en',
  });
  
  // Initialization complete
  initialized = true;
}

// Get initial locale (browser environment only)
export function getInitialLocale(): string {
  const config = get(i18nConfig);
  const availableLocales = config.locales;
  const defaultLocale = config.defaultLocale || 'en';
  const storageKey = config.localStorageKey || 'preferred-locale';
  
  // Get language from localStorage
  const savedLocale = browser ? localStorage.getItem(storageKey) : null;
  
  if (savedLocale && availableLocales.includes(savedLocale)) {
    return savedLocale;
  }
  
  // Get from browser language settings
  const navigatorLocale = getLocaleFromNavigator();
  
  // Use if exact match found
  if (navigatorLocale && availableLocales.includes(navigatorLocale)) {
    return navigatorLocale;
  }
  
  // Look for a match with language code only
  const languageCode = navigatorLocale?.split('-')[0] || '';
  const matchedLocale = availableLocales.find(locale => 
    locale.startsWith(languageCode));
  
  return matchedLocale || defaultLocale;
}

// Change language
export function changeLocale(newLocale: string): void {
  const config = get(i18nConfig);
  const availableLocales = config.locales;
  const storageKey = config.localStorageKey || 'preferred-locale';
  
  if (!availableLocales.includes(newLocale)) {
    console.error(`Locale ${newLocale} is not available`);
    return;
  }
  
  console.debug(`Changing locale to ${newLocale}`);
  
  if (browser) {
    // Reset initialization flag
    resetInitialization();
    
    // Reset translations
    Object.entries(config.translations).forEach(([localeCode, translation]) => {
      addMessages(localeCode, translation);
    });
    
    // Set locale
    locale.set(newLocale);
    
    // Save to localStorage
    localStorage.setItem(storageKey, newLocale);
    
    console.debug(`Locale changed to ${newLocale}, reloading page in 100ms`);
    
    // Page reload (can be disabled from config if needed)
    if (config.reloadOnLocaleChange !== false && typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  } else {
    locale.set(newLocale);
  }
}

// Check if translation key exists
export function hasTranslation(key: string, locale: string): boolean {
  let exists = false;
  
  dictionary.subscribe(dict => {
    exists = dict && dict[locale] && typeof dict[locale][key] !== 'undefined';
  })();
  
  return exists;
}

// Translation utility
export function t(key: string, defaultValue: string, values?: Record<string, any>): string {
  const currentLocale = get(locale) || get(i18nConfig).defaultLocale || 'en';
  
  try {
    const translationFn = get(_);
    if (translationFn) {
      const translated = translationFn(key, values);
      if (translated && translated !== key) {
        return translated;
      }
    }
    
    return defaultValue;
  } catch (error) {
    console.error(`Translation error for key ${key}:`, error);
    return defaultValue;
  }
}

// Store to get the current language
export const currentLocale = derived<typeof locale, string>(locale, $locale => $locale || 'en');

// Store to get the country code of the current language
export const currentCountry = derived<typeof locale, string>(locale, $locale => {
  const config = get(i18nConfig);
  const countries = config.localeCountries || {};
  const defaultLocale = config.defaultLocale || 'en';
  
  if (!$locale) return countries[defaultLocale] || '';
  return countries[$locale as keyof typeof countries] || countries[defaultLocale] || '';
});

// Initialize i18n configuration
export function initializeI18n(config: I18nConfig): void {
  i18nConfig.set({
    locales: config.locales,
    defaultLocale: config.defaultLocale || config.locales[0],
    fallbackLocale: config.fallbackLocale || config.defaultLocale || config.locales[0],
    localeNames: config.localeNames || {},
    localeCountries: config.localeCountries || {},
    translations: config.translations || {},
    localStorageKey: config.localStorageKey || 'preferred-locale',
    reloadOnLocaleChange: config.reloadOnLocaleChange !== false
  });
} 