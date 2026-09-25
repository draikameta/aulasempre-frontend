import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { ConviteResponse, StatusConvite } from '../../../core/models/types';

@Component({
  selector: 'app-convites',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="container">
      <h1>Meus convites</h1>

      @if (carregando) {
        <mat-spinner diameter="32" />
      } @else if (erro) {
        <mat-card class="erro-card">
          <mat-card-content>{{ erro }}</mat-card-content>
        </mat-card>
      } @else if (convites.length === 0) {
        <mat-card>
          <mat-card-content>Nenhum convite recebido ainda.</mat-card-content>
        </mat-card>
      } @else {
        <div class="lista">
          @for (c of convites; track c.id_convite) {
            <mat-card>
              <mat-card-header>
                <mat-card-title>Solicitação #{{ c.id_solicitacao }}</mat-card-title>
                <mat-card-subtitle>Enviado em {{ c.data_envio }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                @if (c.observacao) {
                  <p>{{ c.observacao }}</p>
                }
                <mat-chip [class]="'status-' + c.status.toLowerCase()">{{ statusLabel(c.status) }}</mat-chip>
              </mat-card-content>
              @if (c.status === 'PENDENTE') {
                <mat-card-actions>
                  <button mat-raised-button color="primary"
                    [disabled]="respondendo.has(c.id_convite)"
                    (click)="responder(c, 'ACEITO')">
                    <mat-icon>check</mat-icon> Aceitar
                  </button>
                  <button mat-button color="warn"
                    [disabled]="respondendo.has(c.id_convite)"
                    (click)="responder(c, 'RECUSADO')">
                    <mat-icon>close</mat-icon> Recusar
                  </button>
                </mat-card-actions>
              }
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .container { max-width: 700px; margin: 0 auto; }
    .lista { display: flex; flex-direction: column; gap: 16px; }
    .erro-card { border-left: 4px solid #c62828; }
    mat-chip { font-size: 0.75rem; }
    .status-pendente { background: #fff8e1; }
    .status-aceito { background: #e8f5e9; }
    .status-recusado { background: #ffebee; }
    .status-expirado { background: #eeeeee; }
    .status-cancelado { background: #eeeeee; }
  `]
})
export class ConvitesComponent implements OnInit {
  convites: ConviteResponse[] = [];
  carregando = true;
  erro = '';
  respondendo = new Set<number>();

  private readonly LABELS: Record<StatusConvite, string> = {
    PENDENTE: 'Pendente',
    ACEITO: 'Aceito',
    RECUSADO: 'Recusado',
    EXPIRADO: 'Expirado',
    CANCELADO: 'Cancelado',
  };

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.api.getMeusConvites().subscribe({
      next: lista => { this.convites = lista; this.carregando = false; },
      error: () => {
        this.erro = 'Não foi possível carregar os convites. Confira se o backend está rodando e se a rota GET /api/convites existe.';
        this.carregando = false;
      }
    });
  }

  responder(c: ConviteResponse, status: 'ACEITO' | 'RECUSADO'): void {
    this.respondendo.add(c.id_convite);
    this.api.responderConvite(c.id_convite, status).subscribe({
      next: atualizado => {
        this.respondendo.delete(c.id_convite);
        c.status = atualizado.status ?? status;
        this.snackBar.open(status === 'ACEITO' ? 'Convite aceito!' : 'Convite recusado.', 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.respondendo.delete(c.id_convite);
        this.snackBar.open('Não foi possível responder o convite.', 'Fechar', { duration: 3000 });
      }
    });
  }

  statusLabel(status: StatusConvite): string {
    return this.LABELS[status] ?? status;
  }
}
