import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../../shared/models/auth-response.model';
import { LoginRequest } from '../../shared/models/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'https://localhost:7147/api/Auth';
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  // 👇 ESTE ES EL MÉTODO QUE NOS FALTABA PARA EL REGISTRO 👇
  registro(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.token && this.esNavegador()) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuarioLogin', response.usuarioLogin);
          localStorage.setItem('expira', response.expira);
          localStorage.setItem('rol', response.rol);
        }
      })
    );
  }

  logout(): void {
    if (!this.esNavegador()) return;

    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogin');
    localStorage.removeItem('expira');
    localStorage.removeItem('rol');
  }

  getToken(): string | null {
    if (!this.esNavegador()) return null;
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    if (!this.esNavegador()) return null;
    return localStorage.getItem('rol');
  }

  estaAutenticado(): boolean {
    const token = this.getToken();
    return !!token;
  }

  private esNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}