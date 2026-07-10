import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="login-page">
      <div class="login-bg">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>

      <div class="login-container">
        <div class="login-header">
          <i class="pi pi-ticket login-icon"></i>
          <h1>TicketFlow</h1>
          <p>Sign in to your dashboard</p>
        </div>

        <div class="login-card-wrapper">
          <div class="login-form">
            <div class="field">
              <label for="username">Username</label>
              <input
                id="username"
                pInputText
                [(ngModel)]="username"
                placeholder="Enter username"
                (keydown.enter)="login()"
              />
            </div>

            <div class="field">
              <label for="password">Password</label>
              <p-password
                id="password"
                [(ngModel)]="password"
                placeholder="Enter password"
                [toggleMask]="true"
                [feedback]="false"
                styleClass="password-field"
                inputStyleClass="password-input"
                (keydown.enter)="login()"
              ></p-password>
            </div>

            <button
              pButton
              label="Sign In"
              icon="pi pi-sign-in"
              (click)="login()"
              [loading]="loading"
              [disabled]="!username || !password"
              class="login-btn"
            ></button>

            <div class="demo-credentials">
              <p><strong>Demo Credentials:</strong></p>
              <div class="cred-chips">
                <span class="cred-chip" (click)="fillCredentials('admin', 'admin123')">
                  admin / admin123
                </span>
                <span class="cred-chip" (click)="fillCredentials('john.doe', 'password')">
                  john.doe / password
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: var(--surface-ground);
    }

    .login-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.35;
      animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px; height: 400px;
      background: #6C63FF;
      top: -10%; left: -5%;
    }

    .orb-2 {
      width: 300px; height: 300px;
      background: #a78bfa;
      bottom: -5%; right: -5%;
      animation-delay: -3s;
    }

    .orb-3 {
      width: 200px; height: 200px;
      background: #06b6d4;
      top: 50%; left: 50%;
      animation-delay: -5s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: 1rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-icon {
      font-size: 3rem;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      display: block;
    }

    .login-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #6C63FF, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .login-header p {
      margin: 0.25rem 0 0;
      color: var(--text-color-secondary);
      font-size: 0.95rem;
    }

    .login-card-wrapper {
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
      padding: 2rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-color);
    }

    .field input[pInputText] {
      width: 100%;
      padding: 0.65rem 0.85rem;
    }

    :host ::ng-deep .password-field {
      width: 100%;
    }

    :host ::ng-deep .password-input {
      width: 100%;
      padding: 0.65rem 0.85rem;
    }

    .login-btn {
      width: 100%;
      margin-top: 0.5rem;
      height: 44px;
      font-weight: 600;
      border-radius: 10px !important;
      background: linear-gradient(135deg, #6C63FF, #a78bfa) !important;
      border: none !important;
      color: white !important;
      font-size: 0.95rem;
    }

    .login-btn:hover {
      filter: brightness(1.1);
    }

    .demo-credentials {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }

    .demo-credentials p {
      margin: 0 0 0.5rem;
      font-size: 0.8rem;
      color: var(--text-color-secondary);
    }

    .cred-chips {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cred-chip {
      padding: 0.35rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      background: var(--surface-100);
      color: var(--primary-color);
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid var(--surface-border);
      font-family: 'Inter', monospace;
    }

    .cred-chip:hover {
      background: #6C63FF;
      color: white;
      border-color: #6C63FF;
      transform: translateY(-1px);
    }
  `],
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  fillCredentials(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  login() {
    if (!this.username || !this.password) return;
    this.loading = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.authService.handleLoginSuccess(response);
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid username or password',
        });
        this.loading = false;
      },
    });
  }
}
