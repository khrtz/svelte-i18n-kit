# svelte-i18n-kit

Comprehensive internationalization (i18n) library for SvelteKit with full server-side rendering (SSR) support.

## Features

- Complete SvelteKit integration
- SSR support
- Simple setup
- Language selection UI component
- Automatic detection based on browser language settings
- Language preference storage with localStorage
- Type-safe implementation

## Installation

```bash
npm install svelte-i18n-kit
```

## Basic Usage

### 1. Setup i18n configuration and translation files

```typescript
// src/lib/i18n.ts
import { initializeI18n } from 'svelte-i18n-kit';
import ja from './locales/ja.json';
import en from './locales/en.json';

initializeI18n({
  locales: ['ja', 'en'],
  defaultLocale: 'ja',
  fallbackLocale: 'ja',
  localeNames: {
    'ja': '日本語',
    'en': 'English'
  },
  localeCountries: {
    'ja': 'JP',
    'en': 'US'
  },
  translations: {
    ja,
    en
  },
  localStorageKey: 'preferred-locale'
});
```

### 2. Initialize in SvelteKit hooks

```typescript
// src/hooks.server.ts
import { createI18nHandle } from 'svelte-i18n-kit';
import './lib/i18n'; // Import i18n config

export const handle = createI18nHandle();
```

### 3. Client-side initialization

```typescript
// src/routes/+layout.ts
import { browser } from '$app/environment';
import { setupI18n, resetInitialization } from 'svelte-i18n-kit';
import '../lib/i18n'; // Import i18n config

export const load = async () => {
  if (browser) {
    // Initialize i18n on the client side
    resetInitialization();
    setupI18n();
  }
  
  return {};
};
```

### 4. Using translations

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { _, t } from 'svelte-i18n-kit';
</script>

<h1>{$_('welcome')}</h1>
<p>{t('description', 'This is a default description')}</p>
```

### 5. Using the language selector component

```svelte
<!-- src/components/Header.svelte -->
<script>
  import { LanguageSelector } from 'svelte-i18n-kit/components';
</script>

<header>
  <nav>
    <!-- Other navigation elements -->
    <LanguageSelector />
  </nav>
</header>
```

## API

### Core Functions

- `initializeI18n(config)` - Initial i18n setup
- `setupI18n()` - Client-side initialization
- `setupI18nSSR()` - Server-side initialization
- `resetInitialization()` - Reset initialization state
- `changeLocale(locale)` - Change language
- `t(key, defaultValue, values?)` - Get translation with default value
- `hasTranslation(key, locale)` - Check if translation key exists

### Stores

- `i18nConfig` - Store holding i18n configuration
- `currentLocale` - Current language code
- `currentCountry` - Current language country code

### Re-exports from svelte-i18n

- `_` - Translation function from svelte-i18n
- `locale` - Current language store
- `dictionary` - Translation dictionary store

## Examples

Refer to these directories included in the project:

- `src/lib/svelte-i18n-kit` - Library source code
- `src/lib/svelte-i18n-kit/components` - Components

## License

MIT 