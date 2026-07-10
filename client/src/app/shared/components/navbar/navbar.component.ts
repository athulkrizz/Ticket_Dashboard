import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../core/services/auth.service';
import { AiAssistantService } from '../../../core/services/ai-assistant.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, MenuModule],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <a routerLink="/tickets" class="navbar-brand">
          <i class="pi pi-ticket brand-icon"></i>
          <span class="brand-text">TicketFlow</span>
        </a>
      </div>

      <div class="navbar-right">
        <button
          pButton
          [rounded]="true"
          [text]="true"
          (click)="toggleTheme()"
          class="theme-toggle-btn"
        >
          <i [class]="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>

        <button
          pButton
          [rounded]="true"
          [text]="true"
          (click)="aiService.toggle()"
          class="ai-toggle-btn"
        >
          <i class="pi pi-sparkles"></i>
          <span class="ai-label">AI Assistant</span>
        </button>

        @if (authService.currentUser(); as user) {
          <div class="user-section" (click)="userMenu.toggle($event)">
            <p-avatar
              [label]="user.displayName.charAt(0)"
              shape="circle"
              styleClass="user-avatar"
            ></p-avatar>
            <span class="user-name">{{ user.displayName }}</span>
            <i class="pi pi-chevron-down chevron"></i>
          </div>
          <p-menu #userMenu [model]="menuItems" [popup]="true"></p-menu>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 60px;
      background: var(--surface-card);
      border-bottom: 1px solid var(--surface-border);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .navbar-left {
      display: flex;
      align-items: center;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: var(--text-color);
    }

    .brand-icon {
      font-size: 1.4rem;
      color: var(--primary-color);
    }

    .brand-text {
      font-size: 1.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary-color), #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .theme-toggle-btn {
      color: var(--text-color-secondary) !important;
      width: 36px;
      height: 36px;
    }

    .theme-toggle-btn:hover {
      color: var(--primary-color) !important;
    }

    .ai-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--primary-color) !important;
    }

    .ai-toggle-btn .pi-sparkles {
      animation: sparkle 2s ease-in-out infinite;
    }

    .ai-label {
      font-weight: 600;
      font-size: 0.85rem;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.3rem 0.6rem;
      border-radius: 2rem;
      transition: background 0.2s;
      margin-left: 0.25rem;
    }

    .user-section:hover {
      background: var(--surface-hover);
    }

    .user-name {
      font-weight: 500;
      font-size: 0.85rem;
      color: var(--text-color);
    }

    .chevron {
      font-size: 0.7rem;
      color: var(--text-color-secondary);
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }

    @media (max-width: 768px) {
      .ai-label, .user-name {
        display: none;
      }
      .navbar {
        padding: 0 1rem;
      }
    }
  `],
})
export class NavbarComponent {
  isDark = true;

  menuItems: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.authService.logout(),
    },
  ];

  constructor(
    public authService: AuthService,
    public aiService: AiAssistantService,
  ) {
    this.isDark = document.documentElement.classList.contains('dark-theme');
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }
}
