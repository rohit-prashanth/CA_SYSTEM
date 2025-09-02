import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';

registerLocaleData(localeIn, 'en-IN');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(withInterceptors([loaderInterceptor])),
    { provide: LOCALE_ID, useValue: 'en-IN' },
  ],
};
