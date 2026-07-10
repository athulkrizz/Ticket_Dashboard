import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, AuthUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  currentUser = signal<AuthUser | null>(null);
  isLoggedIn = computed(() => !!this.currentUser() || !environment.authEnabled);
  token = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (stored && user) {
      this.token.set(stored);
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  handleLoginSuccess(response: AuthResponse) {
    this.token.set(response.access_token);
    this.currentUser.set(response.user);
    localStorage.setItem('auth_token', response.access_token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
    this.router.navigate(['/tickets']);
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }

  getUsers() {
    return this.http.get<AuthUser[]>(`${this.apiUrl}/users`);
  }
}
