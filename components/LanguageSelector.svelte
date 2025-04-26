<script lang="ts">
  import { locale } from 'svelte-i18n';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import { i18nConfig, changeLocale, t } from '../core';
  import { fade } from 'svelte/transition';

  export let buttonClass = '';
  export let dropdownClass = '';
  export let iconOnly = false;
  export let showLabel = false;
  export let showFlag = true;
  export let useGlobeIcon = true;
  
  let isOpen = false;
  let dropdownRef: HTMLDivElement;
  let currentLoc = '';
  let localeNamesByCode: Record<string, string> = {};
  
  // ロケール変更を監視
  locale.subscribe(value => {
    currentLoc = value || '';
  });
  
  i18nConfig.subscribe(config => {
    localeNamesByCode = config.localeNames || {};
  });
  
  function handleChangeLanguage(newLocale: string) {
    changeLocale(newLocale);
    isOpen = false;
  }
  
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  
  $: availableLocales = get(i18nConfig).locales;
  $: languageSelectorLabel = t('language.select', 'Select Language', {});
  $: currentLanguageLabel = t('language.current', 'Current Language', {});
</script>

<div class="i18n-language-selector relative" bind:this={dropdownRef}>
  <button
    class="{buttonClass} p-2 rounded hover:bg-white/20 transition-colors duration-300 flex items-center"
    on:click={() => isOpen = !isOpen}
    aria-label={languageSelectorLabel}
  >
    {#if useGlobeIcon}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="globe-icon">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    {/if}
    
    {#if showLabel}
      <span class="ml-2">
        {localeNamesByCode[currentLoc] || currentLoc}
      </span>
    {/if}
  </button>
  
  {#if isOpen}
    <div
      class="{dropdownClass} absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
      transition:fade={{ duration: 150 }}
    >
      <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        {languageSelectorLabel}
      </div>
      
      <div class="max-h-60 overflow-y-auto">
        {#each availableLocales as localeCode}
          <button
            class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between {currentLoc === localeCode ? 'bg-gray-100 dark:bg-gray-700' : ''}"
            on:click={() => handleChangeLanguage(localeCode)}
          >
            <span>
              {localeNamesByCode[localeCode] || localeCode}
            </span>
            {#if currentLoc === localeCode}
              <span class="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .i18n-language-selector {
    display: inline-block;
  }
</style> 