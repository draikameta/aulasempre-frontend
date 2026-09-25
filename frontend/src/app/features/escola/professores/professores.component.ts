import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { ProfessorCompativel } from '../../../core/models/types';

@Component({
  selector: 'app-professores-compativeis',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <a mat-icon-button routerLink="/escola/dashboard"><mat-icon>arrow_back</mat-icon></a>
        <h1>Professores compatíveis</h1>
      </div>

      @if (carregando) {
        <mat-spinner diameter="32" />
      } @else if (erro) {
        <mat-card class="erro-card">
          <mat-card-content>{{ erro }}</mat-card-content>
        </mat-card>
      } @else if (professores.length === 0) {
        <mat-card>
          <mat-card-content>
            Nenhum professor compatível encontrado pra essa disciplina, nível e horário.
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="lista">
          @for (p of professores; track p.id_professor) {
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ p.nome_profissional }}</mat-card-title>
                <mat-card-subtitle>{{ p.cidade }}/{{ p.estado }} · {{ p.anos_experiencia }} anos de experiência</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                @if (p.descricao) {
                  <p>{{ p.descricao }}</p>
                }
                <mat-chip>{{ p.status }}</mat-chip>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary"
                  [disabled]="convidando.has(p.id_professor) || convidados.has(p.id_professor)"
                  (click)="convidar(p)">
                  @if (convidados.has(p.id_professor)) {
                    <ng-container><mat-icon>check</mat-icon> Convite enviado</ng-container>
                  } @else if (convidando.has(p.id_professor)) {
                    <mat-spinner diameter="18" />
                  } @else {
                    <ng-container><mat-icon>send</mat-icon> Enviar convite</ng-container>
                  }
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .container { max-width: 700px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .header h1 { margin: 0; font-size: 1.4rem; }
    .lista { display: flex; flex-direction: column; gap: 16px; }
    .erro-card { border-left: 4px solid #c62828; }
  `]
})
export class ProfessoresCompativeisComponent implements OnInit {
  idSolicitacao!: number;
  professores: ProfessorCompativel[] = [];
  carregando = true;
  erro = '';
  convidando = new Set<number>();
  convidados = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.idSolicitacao = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getMatches(this.idSolicitacao).subscribe({
      next: lista => { this.professores = lista; this.carregando = false; },
      error: () => {
        this.erro = 'Não foi possível carregar os professores compatíveis.';
        this.carregando = false;
      }
    });
  }

  convidar(p: ProfessorCompativel): void {
    this.convidando.add(p.id_professor);

    this.api.enviarConvite({ id_solicitacao: this.idSolicitacao, id_professor: p.id_professor }).subscribe({
      next: () => {
        this.convidando.delete(p.id_professor);
        this.convidados.add(p.id_professor);
        this.snackBar.open(`Convite enviado para ${p.nome_profissional}`, 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.convidando.delete(p.id_professor);
        this.snackBar.open('Não foi possível enviar o convite.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
