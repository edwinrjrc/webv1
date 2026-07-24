import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService:AuthService) {} // Aquí podrías inyectar un servicio de Notificaciones (Toastr o Swal)

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el token anónimo falló o expiró
        if (error.status === 401) {
          console.warn(
            '[InnovaViajes]: Token expirado, regenerando en silencio...',
          );

          // 1. IMPORTANTE: No navegamos a /login, pedimos token nuevo
          // Asumiendo que tu servicio de auth tiene el método para el token anónimo
          return this.authService.obtenerTokenAnonimo().pipe(
            switchMap((nuevoToken: string) => {
              console.log('✅ Nuevo token obtenido, reintentando petición...');

              // 2. Clonamos la petición original pero con el token nuevo
              const authReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${nuevoToken}`,
                ),
              });

              // 3. La lanzamos de nuevo (Recursividad controlada)
              return next.handle(authReq);
            }),
            catchError((errToken) => {
              // Si incluso generar el token falla, ahí sí mandamos al inicio
              this.router.navigate(['/']);
              return throwError(() => errToken);
            }),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
