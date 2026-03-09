import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let authReq = req;

    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      if (token) {
        authReq = this.addToken(req, token);
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 401 (Expirado), intentamos renovar
        if (error.status === 401) {
          console.warn('Sesión expirada. Intentando recuperar acceso...');

          return this.authService.renovarToken().pipe(
            switchMap((nuevoToken) => {
              if (nuevoToken) {
                // Si obtenemos un nuevo token, reintentamos la petición original
                console.log('Reintentando petición original con nuevo token.');
                return next.handle(this.addToken(req, nuevoToken));
              }
              // Si no hay token nuevo, cerramos sesión
              this.authService.logout();
              return throwError(() => error);
            }),
            catchError((err) => {
              this.authService.logout();
              return throwError(() => err);
            }),
          );
        }
        return throwError(() => error);
      }),
    );
  }

  /**
   * Helper para clonar la petición y añadir el header de Authorization
   */
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}
