import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AiChatPanelComponent } from './shared/components/ai-chat-panel/ai-chat-panel.component';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, AiChatPanelComponent],
  template: `
    @if (showNavbar) {
      <app-navbar />
    }
    <main class="app-main">
      <router-outlet />
    </main>
    <app-ai-chat-panel />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-main {
      flex: 1;
      background: var(--surface-ground);
      padding-top: 60px;
    }
  `],
})
export class AppComponent implements OnInit {
  showNavbar = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Restore theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }

    // Show/hide navbar based on route
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.showNavbar = !event.urlAfterRedirects.includes('/login');
      });

    // Initial check
    this.showNavbar = (this.authService.isLoggedIn() || !environment.authEnabled)
      && !this.router.url.includes('/login');
  }
}
