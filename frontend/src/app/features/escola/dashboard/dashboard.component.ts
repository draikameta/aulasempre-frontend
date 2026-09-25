import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { SolicitacaoResponse, StatusSolicitacao } from '../../../core/models/types';

@Component({
  selector: 'app-escola-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Minhas solicitações</h1>
        <a mat-raised-button color="primary" routerLink="/escola/solicitacoes/nova">
          <mat-icon>add</mat-icon> Nova solicitação
        </a>
      </div>

      @if (carregando) {
        <mat-spinner diameter="32" />
      } @else if (erro) {
        <mat-card class="erro-card">
          <mat-card-content>{{ erro }}</mat-card-content>
        </mat-card>
      } @else if (solicitacoes.length === 0) {
        <mat-card>
          <mat-card-content>
            Nenhuma solicitação ainda. Clique em "Nova solicitação" pra criar a primeira.
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="lista">
          @for (s of solicitacoes; track s.id_solicitacao) {
            <mat-card class="solicitacao-card">
              <mat-card-header>
                <mat-card-title>Turma {{ s.turma }}</mat-card-title>
                <mat-card-subtitle>{{ s.data_aula }} · {{ s.horario_inicio }} às {{ s.horario_fim }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                @if (s.observacoes) {
                  <p>{{ s.observacoes }}</p>
                }
                <mat-chip [class]="'status-' + s.status.toLowerCase()">{{ statusLabel(s.status) }}</mat-chip>
              </mat-card-content>
              <mat-card-actions>
                <a mat-button color="primary" [routerLink]="['/escola/solicitacoes', s.id_solicitacao, 'professores']">
                  Ver professores compatíveis
                </a>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .lista { display: flex; flex-direction: column; gap: 16px; }
    .erro-card { border-left: 4px solid #c62828; }
    mat-chip { font-size: 0.75rem; }
    .status-aberta { background: #e3f2fd; }
    .status-em_processo { background: #fff8e1; }
    .status-preenchida { background: #e8f5e9; }
    .status-concluida { background: #ede7f6; }
    .status-cancelada { background: #ffebee; }
  `]
})
export class EscolaDashboardComponent implements OnInit {
  solicitacoes: SolicitacaoResponse[] = [];
  carregando = true;
  erro = '';

  private readonly LABELS: Record<StatusSolicitacao, string> = {
    ABERTA: 'Aberta',
    EM_PROCESSO: 'Em processo',
    PREENCHIDA: 'Preenchida',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getMinhasSolicitacoes().subscribe({
      next: lista => { this.solicitacoes = lista; this.carregando = false; },
      error: () => {
        this.erro = 'Não foi possível carregar as solicitações. Confira se o backend está rodando e se a rota GET /api/solicitacoes existe.';
        this.carregando = false;
      }
    });
  }

  statusLabel(status: StatusSolicitacao): string {
    return this.LABELS[status] ?? status;
  }
}
