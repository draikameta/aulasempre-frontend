import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { CatalogoItem } from '../../../core/models/types';

@Component({
  selector: 'app-nova-solicitacao',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Nova solicitação de substituição</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <mat-form-field appearance="outline" class="full">
              <mat-label>Disciplina</mat-label>
              <mat-select formControlName="id_disciplina">
                @for (d of disciplinas; track d.id) {
                  <mat-option [value]="d.id">{{ d.nome }}</mat-option>
                }
              </mat-select>
              @if (form.get('id_disciplina')?.invalid && form.get('id_disciplina')?.touched) {
                <mat-error>Selecione a disciplina</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Nível de ensino</mat-label>
              <mat-select formControlName="id_nivel_ensino">
                @for (n of niveisEnsino; track n.id) {
                  <mat-option [value]="n.id">{{ n.nome }}</mat-option>
                }
              </mat-select>
              @if (form.get('id_nivel_ensino')?.invalid && form.get('id_nivel_ensino')?.touched) {
                <mat-error>Selecione o nível de ensino</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Turma</mat-label>
              <input matInput formControlName="turma" placeholder="Ex: 7º B">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Data da aula</mat-label>
              <input matInput type="date" formControlName="data_aula">
            </mat-form-field>

            <div class="linha-horarios">
              <mat-form-field appearance="outline">
                <mat-label>Horário de início</mat-label>
                <input matInput type="time" formControlName="horario_inicio">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Horário de fim</mat-label>
                <input matInput type="time" formControlName="horario_fim">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Observações</mat-label>
              <textarea matInput formControlName="observacoes" rows="3"
                placeholder="Conteúdo a ser aplicado, materiais necessários, etc. (opcional)"></textarea>
            </mat-form-field>

            @if (erro) {
              <p class="erro-mensagem">{{ erro }}</p>
            }

            <button mat-raised-button color="primary" type="submit"
              [disabled]="form.invalid || enviando" class="btn-submit">
              @if (enviando) {
                <mat-spinner diameter="20" />
              } @else {
                <ng-container><mat-icon>search</mat-icon> Buscar professores compatíveis</ng-container>
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 560px; margin: 0 auto; }
    .full { width: 100%; }
    .linha-horarios { display: flex; gap: 16px; }
    .linha-horarios mat-form-field { flex: 1; }
    .btn-submit { width: 100%; height: 44px; margin-top: 8px; }
    .erro-mensagem { color: #c62828; font-size: 0.875rem; }
  `]
})
export class NovaSolicitacaoComponent implements OnInit {
  form: FormGroup;
  disciplinas: CatalogoItem[] = [];
  niveisEnsino: CatalogoItem[] = [];
  enviando = false;
  erro = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.form = this.fb.group({
      id_disciplina: [null, Validators.required],
      id_nivel_ensino: [null, Validators.required],
      turma: ['', Validators.required],
      data_aula: ['', Validators.required],
      horario_inicio: ['', Validators.required],
      horario_fim: ['', Validators.required],
      observacoes: [''],
    });
  }

  ngOnInit(): void {
    this.api.getDisciplinas().subscribe({ next: lista => this.disciplinas = lista });
    this.api.getNiveisEnsino().subscribe({ next: lista => this.niveisEnsino = lista });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.enviando = true;
    this.erro = '';

    this.api.criarSolicitacao(this.form.value).subscribe({
      next: resp => {
        this.enviando = false;
        this.router.navigate(['/escola/solicitacoes', resp.id_solicitacao, 'professores']);
      },
      error: err => {
        this.enviando = false;
        this.erro = err.error?.message || err.error?.error || 'Não foi possível criar a solicitação.';
      }
    });
  }
}
