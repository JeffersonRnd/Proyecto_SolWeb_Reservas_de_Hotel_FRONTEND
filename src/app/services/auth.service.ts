import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginRequest, LoginResponse, RegisterRequest } from '../model/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';

  private _isLoggedIn = signal<boolean>(this.hasToken());
  private _rol = signal<string>(this.getRolFromToken(this.getToken()));

  readonly $isLoggedIn = this._isLoggedIn.asReadonly();
  readonly $rol = this._rol.asReadonly();

  login(req: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.HOST}/api/auth/login`, req).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this._isLoggedIn.set(true);
        this._rol.set(this.getRolFromToken(res.token));
      })
    );
  }

  register(req: RegisterRequest) {
    return this.http.post<LoginResponse>(`${environment.HOST}/api/auth/register`, req).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this._isLoggedIn.set(true);
        this._rol.set(this.getRolFromToken(res.token));
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isLoggedIn.set(false);
    this._rol.set('');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this._rol() === 'ROLE_ADMIN';
  }

  isHuesped(): boolean {
    return this._rol() === 'ROLE_HUESPED';
  }

  getUsername(): string {
    const payload = this.decodeToken(this.getToken());
    return payload?.sub || '';
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private getRolFromToken(token: string | null): string {
    const payload = this.decodeToken(token);
    return payload?.rol || '';
  }

  private decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch { return null; }
  }
}