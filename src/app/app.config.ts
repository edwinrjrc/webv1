import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ErrorHttpInterceptor } from './interceptor/errorhttp.Interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(NgbAccordionModule),

    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),

    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),

    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: ErrorHttpInterceptor, 
      multi: true 
    }
  ]
};
