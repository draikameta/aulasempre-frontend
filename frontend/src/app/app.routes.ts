import { Routes } from '@angular/router';
import { escolaGuard, professorGuard } from './core/guards/auth.guard';

// Rotas até o Incremento 3 (jornada principal completa: escola cria pedido,
// vê professores compatíveis, convida; professor vê e responde convites).
// Perfil do professor, substituições e avaliação entram nos incrementos seguintes.
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // ===== Escola =====
  {
    path: 'escola/dashboard',
    canActivate: [escolaGuard],
    loadComponent: () => import('./features/escola/dashboard/dashboard.component').then(m => m.EscolaDashboardComponent)
  },
  {
    path: 'escola/solicitacoes/nova',
    canActivate: [escolaGuard],
    loadComponent: () => import('./features/escola/nova-solicitacao/nova-solicitacao.component').then(m => m.NovaSolicitacaoComponent)
  },
  {
    path: 'escola/solicitacoes/:id/professores',
    canActivate: [escolaGuard],
    loadComponent: () => import('./features/escola/professores/professores.component').then(m => m.ProfessoresCompativeisComponent)
  },

  // ===== Professor =====
  {
    path: 'professor/convites',
    canActivate: [professorGuard],
    loadComponent: () => import('./features/professor/convites/convites.component').then(m => m.ConvitesComponent)
  },

  { path: '**', redirectTo: '/login' }
];
