# svelte-i18n-kit

SvelteKit向けの包括的な国際化(i18n)ライブラリです。サーバーサイドレンダリング(SSR)にも完全対応しています。

## 特徴

- 完全なSvelteKit統合
- SSR対応
- 簡単なセットアップ
- 言語選択UIコンポーネント付き
- ブラウザの言語設定に基づく自動検出
- localStorage による言語設定の保存
- 型安全な実装

## インストール

```bash
npm install svelte-i18n-kit
```

## 基本的な使い方

### 1. i18n設定とトランスレーションファイルの準備

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

### 2. SvelteKitのフックで初期化

```typescript
// src/hooks.server.ts
import { createI18nHandle } from 'svelte-i18n-kit';
import './lib/i18n'; // i18n設定をインポート

export const handle = createI18nHandle();
```

### 3. クライアントサイドの初期化

```typescript
// src/routes/+layout.ts
import { browser } from '$app/environment';
import { setupI18n, resetInitialization } from 'svelte-i18n-kit';
import '../lib/i18n'; // i18n設定をインポート

export const load = async () => {
  if (browser) {
    // クライアントサイドでi18nを初期化
    resetInitialization();
    setupI18n();
  }
  
  return {};
};
```

### 4. 翻訳の使用

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { _, t } from 'svelte-i18n-kit';
</script>

<h1>{$_('welcome')}</h1>
<p>{t('description', 'This is a default description')}</p>
```

### 5. 言語選択コンポーネントの使用

```svelte
<!-- src/components/Header.svelte -->
<script>
  import { LanguageSelector } from 'svelte-i18n-kit/components';
</script>

<header>
  <nav>
    <!-- その他のナビゲーション要素 -->
    <LanguageSelector />
  </nav>
</header>
```

## API

### コア関数

- `initializeI18n(config)` - i18nの初期設定
- `setupI18n()` - クライアントサイドの初期化
- `setupI18nSSR()` - サーバーサイドの初期化
- `resetInitialization()` - 初期化状態をリセット
- `changeLocale(locale)` - 言語を変更
- `t(key, defaultValue, values?)` - 翻訳取得（デフォルト値付き）
- `hasTranslation(key, locale)` - 翻訳キーが存在するか確認

### ストア

- `i18nConfig` - i18n設定を保持するストア
- `currentLocale` - 現在の言語コード
- `currentCountry` - 現在の言語の国コード

### svelte-i18n再エクスポート

- `_` - svelte-i18nの翻訳関数
- `locale` - 現在の言語ストア
- `dictionary` - 翻訳辞書ストア

## サンプル実装

このプロジェクトに含まれる以下のディレクトリを参照してください：

- `src/lib/svelte-i18n-kit` - ライブラリのソースコード
- `src/lib/svelte-i18n-kit/components` - コンポーネント

## コントリビュート

プルリクエストを歓迎します。大きな変更を加える場合は、まずissueを開いて議論してください。

## ライセンス

MIT 