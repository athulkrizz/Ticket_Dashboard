import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const loginGuard: CanActivateFn = () => {
  if (!environment.authEnabled) {
    const router = inject(Router);
    router.navigate(['/tickets']);
    return false;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/tickets']);
    return false;
  }

  return true;
};
