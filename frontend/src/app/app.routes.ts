import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Rotas do Incremento 2. As rotas de escola/dashboard e professor/dashboard
// (com os guards escolaGuard/professorGuard) entram nos Incrementos 3 e 4,
// junto com as telas correspondentes.
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  { path: '**', redirectTo: '/login' }
];
