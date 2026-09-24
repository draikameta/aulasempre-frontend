import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Guard: só permite acesso se o usuário estiver logado */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

/** Guard: só permite acesso para ESCOLA */
export const escolaGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.papel() === 'ESCOLA') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

/** Guard: só permite acesso para PROFESSOR */
export const professorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.papel() === 'PROFESSOR') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
