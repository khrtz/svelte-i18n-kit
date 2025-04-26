import type { Handle } from '@sveltejs/kit';
import { setupI18nSSR, resetInitialization } from './core';

/**
 * Provides SvelteKit server hooks
 * For use in hooks.server.ts
 */
export function createI18nHandle(options?: { sequence?: Handle[] }): Handle {
  return async ({ event, resolve }) => {
    // Initialize i18n before each request
    resetInitialization();
    setupI18nSSR();
    
    // Execute other handlers in sequence if available
    let response;
    if (options?.sequence) {
      let updatedEvent = event;
      for (const handle of options.sequence) {
        const result = await handle({ event: updatedEvent, resolve });
        if (result instanceof Response) {
          response = result;
          break;
        }
        // @ts-ignore - Allow event updates
        updatedEvent = result.event || updatedEvent;
      }
    }
    
    if (!response) {
      response = await resolve(event);
    }
    
    return response;
  };
} 