// src/lib/svelte-i18n-kit/index.ts
export {
  setupI18n,
  setupI18nSSR,
  resetInitialization,
  changeLocale,
  hasTranslation,
  t,
  initializeI18n,
  i18nConfig,
  currentLocale,
  currentCountry,
  getInitialLocale
} from './core';

export type {
  LocaleCode,
  LocaleConfig,
  LocaleData,
  I18nConfig
} from './types';

export { createI18nHandle } from './hooks';

export { 
  ns, 
  getDateLocale, 
  getLocaleName,
  pluralize
} from './utils';

// Re-export svelte-i18n core for convenience
export { _, locale, dictionary } from 'svelte-i18n';

// Components are exported from a separate entry point
// import via 'svelte-i18n-kit/components'

// Export components via an extra import
// import { default as LanguageSelector } from './components/LanguageSelector.svelte';
// export { LanguageSelector }; 