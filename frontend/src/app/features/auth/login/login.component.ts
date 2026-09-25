import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>AulaSempre</mat-card-title>
          <mat-card-subtitle>Acesse sua conta</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <mat-form-field appearance="outline" class="form-field-full">
              <mat-label>E-mail</mat-label>
              <input matInput formControlName="email" type="email" placeholder="seu@email.com">
              <mat-icon matSuffix>email</mat-icon>
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <mat-error>E-mail inválido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field-full">
              <mat-label>Senha</mat-label>
              <input matInput formControlName="senha" [type]="mostrarSenha ? 'text' : 'password'">
              <button mat-icon-button matSuffix type="button" (click)="mostrarSenha = !mostrarSenha">
                <mat-icon>{{ mostrarSenha ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('senha')?.invalid && form.get('senha')?.touched) {
                <mat-error>Senha obrigatória</mat-error>
              }
            </mat-form-field>

            @if (erro) {
              <p class="erro-mensagem">{{ erro }}</p>
            }

            <button mat-raised-button color="primary" type="submit"
              [disabled]="form.invalid || carregando" class="btn-submit">
              @if (carregando) {
                <mat-spinner diameter="20" />
              } @else {
                Entrar
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="links">
            Cadastro ainda não disponível (aguardando endpoint no backend).
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 16px;
    }
    .btn-submit { width: 100%; margin-top: 8px; height: 44px; }
    .erro-mensagem { color: #c62828; font-size: 0.875rem; margin-bottom: 8px; }
    .links { text-align: center; font-size: 0.875rem; color: #666; }
    .links a { color: #1565c0; text-decoration: none; margin: 0 4px; }
    .links a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  carregando = false;
  erro = '';
  mostrarSenha = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.carregando = true;
    this.erro = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.carregando = false;
        const papel = this.authService.papel();
        if (papel === 'ESCOLA') {
          this.router.navigate(['/escola/dashboard']);
        } else if (papel === 'PROFESSOR') {
          this.router.navigate(['/professor/convites']);
        } else {
          // Não deveria acontecer, mas evita tela em branco se o papel não
          // vier reconhecido (ver bloqueio sobre o formato da resposta do login).
          this.erro = 'Login feito, mas não foi possível identificar seu papel (escola/professor).';
        }
      },
      error: err => {
        this.carregando = false;
        // Node/Express costuma devolver { message } ou { error }; tentamos os dois.
        this.erro = err.error?.message || err.error?.error || 'Credenciais incorretas. Tente novamente.';
      }
    });
  }
}
