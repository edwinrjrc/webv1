import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { Observable, tap, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/security`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      }),
    );
  }

  /**
   * Solicita un nuevo token cuando el actual ha expirado.
   */
  renovarToken(): Observable<string | null> {
    // Usamos el endpoint de anónimo o un endpoint específico de refresh
    const url = `${environment.apiUrl}/api/auth/anonymous`;
    
    return this.http.get<any>(url).pipe(
      tap(res => {
        if (res && res.token) {
          this.saveToken(res.token);
          console.log('--- TOKEN RENOVADO AUTOMÁTICAMENTE ---');
        }
      }),
      map(res => res.token || null)
    );
  }

  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  obtenerTokenAnonimo(): Observable<any> {
    const url = `${environment.apiUrl}/api/auth/anonymous`;
    return this.http.get<any>(url).pipe(
      tap(res => {
        if (res && res.token) {
          this.saveToken(res.token);
          console.log('--- TOKEN ANÓNIMO RECIBIDO ---');
        }
      })
    );
  }
}