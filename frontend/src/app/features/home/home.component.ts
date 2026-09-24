import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { CatalogoItem } from '../../core/models/types';

/**
 * Tela provisória do Incremento 2.
 *
 * Objetivo: provar que o login funciona de ponta a ponta com o backend Node.js
 * e que os catálogos (disciplinas / níveis de ensino) vêm certinho da API.
 *
 * Os dashboards de verdade (escola e professor) entram nos Incrementos 3 e 4 —
 * essa tela é só um ponto de chegada temporário depois do login.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatProgressSpinnerModule],
  template: `
    <div class="home-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Bem-vindo(a), {{ auth.nomeUsuario() || 'usuário' }}</mat-card-title>
          <mat-card-subtitle>Papel: {{ auth.papel() || 'não identificado' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p class="aviso">
            Login funcionando com o backend Node.js. Os dashboards completos de
            escola e professor chegam nos próximos incrementos.
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card class="catalogo-card">
        <mat-card-header>
          <mat-card-title>Disciplinas (catálogo)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (carregandoDisciplinas) {
            <mat-spinner diameter="24" />
          } @else if (erroDisciplinas) {
            <p class="erro">{{ erroDisciplinas }}</p>
          } @else {
            <mat-list>
              @for (item of disciplinas; track item.id) {
                <mat-list-item>{{ item.nome }}</mat-list-item>
              }
            </mat-list>
          }
        </mat-card-content>
      </mat-card>

      <mat-card class="catalogo-card">
        <mat-card-header>
          <mat-card-title>Níveis de ensino (catálogo)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (carregandoNiveis) {
            <mat-spinner diameter="24" />
          } @else if (erroNiveis) {
            <p class="erro">{{ erroNiveis }}</p>
          } @else {
            <mat-list>
              @for (item of niveisEnsino; track item.id) {
                <mat-list-item>{{ item.nome }}</mat-list-item>
              }
            </mat-list>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container { display: flex; flex-direction: column; gap: 16px; max-width: 600px; margin: 0 auto; }
    .aviso { color: #555; font-size: 0.9rem; }
    .erro { color: #c62828; font-size: 0.875rem; }
    .catalogo-card { min-height: 80px; }
  `]
})
export class HomeComponent implements OnInit {
  disciplinas: CatalogoItem[] = [];
  niveisEnsino: CatalogoItem[] = [];
  carregandoDisciplinas = true;
  carregandoNiveis = true;
  erroDisciplinas = '';
  erroNiveis = '';

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDisciplinas().subscribe({
      next: lista => { this.disciplinas = lista; this.carregandoDisciplinas = false; },
      error: () => {
        this.erroDisciplinas = 'Não foi possível carregar as disciplinas (backend está rodando?)';
        this.carregandoDisciplinas = false;
      }
    });

    this.api.getNiveisEnsino().subscribe({
      next: lista => { this.niveisEnsino = lista; this.carregandoNiveis = false; },
      error: () => {
        this.erroNiveis = 'Não foi possível carregar os níveis de ensino (backend está rodando?)';
        this.carregandoNiveis = false;
      }
    });
  }
}
