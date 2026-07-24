import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ErrorHttpInterceptor } from './interceptor/errorhttp.Interceptor';

// app.config.ts corregido
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(NgbAccordionModule),

    // ELIMINA: importProvidersFrom(HttpClientModule) <--- ESTO CAUSA EL ERROR
    
    provideHttpClient(
      withFetch(), 
      withInterceptorsFromDi() // Esto permite usar tu AuthInterceptor basado en clase
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
