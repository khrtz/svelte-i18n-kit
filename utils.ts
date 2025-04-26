import { get } from 'svelte/store';
import { locale, dictionary } from 'svelte-i18n';
import type { I18nConfig } from './types';
import { i18nConfig } from './core';

/**
 * Generate a namespaced translation key path
 * @param namespace The namespace
 * @param key The key
 * @returns Namespaced key
 */
export function ns(namespace: string, key: string): string {
  return `${namespace}.${key}`;
}

/**
 * Get locale settings for date and time formatting
 * @returns Locale settings for date and time formatting
 */
export function getDateLocale(): string {
  const config = get(i18nConfig);
  const currentLocale = get(locale) || config.defaultLocale || 'en';
  
  // Convert language code to date formatting locale
  switch (currentLocale) {
    case 'ja':
      return 'ja-JP';
    case 'en':
      return 'en-US';
    case 'zh-TW':
      return 'zh-TW';
    case 'ko':
      return 'ko-KR';
    default:
      return currentLocale;
  }
}

/**
 * Get language name
 * @param localeCode Language code
 * @returns Language name
 */
export function getLocaleName(localeCode: string): string {
  const config = get(i18nConfig);
  return config.localeNames?.[localeCode] || localeCode;
}

/**
 * Select plural text based on current language
 * @param count Number
 * @param singular Singular text
 * @param plural Plural text
 * @param japaneseText Japanese text (regardless of number)
 * @returns Appropriate text
 */
export function pluralize(count: number, singular: string, plural: string, japaneseText?: string): string {
  const currentLocale = get(locale) || 'en';
  
  if (currentLocale === 'ja' && japaneseText) {
    return japaneseText;
  }
  
  return count === 1 ? singular : plural;
} 