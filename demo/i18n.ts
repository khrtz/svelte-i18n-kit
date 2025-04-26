import { initializeI18n } from '../index';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zhTW from './locales/zh-TW.json';
import ko from './locales/ko.json';

/**
 * Initialize i18n configuration for the demo
 * @returns initialized i18n configuration
 */
export const initDemoI18n = () => {
  return initializeI18n({
    locales: ['en', 'ja', 'zh-TW', 'ko'],
    defaultLocale: 'en',
    fallbackLocale: 'en',
    translations: {
      en,
      ja,
      'zh-TW': zhTW,
      ko
    }
  });
}; 