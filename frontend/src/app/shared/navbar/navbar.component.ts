import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <!-- Logo -->
      <span class="logo">AulaSempre</span>
      <span class="spacer"></span>

      <!-- Menu para usuário logado -->
      @if (auth.isLoggedIn()) {
        <span class="usuario-nome">{{ auth.nomeUsuario() }}</span>

        <!-- Links por papel (escola/professor) chegam nos Incrementos 3 e 4 -->
        <a mat-button routerLink="/home">Início</a>

        <button mat-icon-button (click)="auth.logout()" title="Sair">
          <mat-icon>logout</mat-icon>
        </button>
      }

      <!-- Botões para não logado -->
      @if (!auth.isLoggedIn()) {
        <a mat-button routerLink="/login">Entrar</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    .navbar { box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .logo { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.5px; }
    .spacer { flex: 1; }
    .usuario-nome { margin-right: 8px; font-size: 0.9rem; opacity: 0.9; }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
}
