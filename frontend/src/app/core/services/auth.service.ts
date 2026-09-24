import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, JwtPayload, TipoUsuario } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Base da API do backend Node.js/Express. Ajuste a porta se o .env do
  // backend definir uma diferente de 3000 (padrão do Express).
  private readonly API = 'http://localhost:3000/api/auth';

  // Sinais reativos para o estado de autenticação
  isLoggedIn = signal<boolean>(this.temToken());
  papel = signal<TipoUsuario | ''>(this.getPapelSalvo());
  nomeUsuario = signal<string>(this.getNomeSalvo());

  constructor(private http: HttpClient, private router: Router) {}

  /** Faz login e guarda o token (e o papel/nome do usuário) no localStorage. */
  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API}/login`, request).pipe(
      tap(resp => this.armazenarSessao(resp))
    );
  }

  /** Remove a sessão e volta pro login. */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('papel');
    localStorage.removeItem('nome');
    this.isLoggedIn.set(false);
    this.papel.set('');
    this.nomeUsuario.set('');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Id do usuário logado, tirado do JWT (id_usuario, id ou sub — o que vier primeiro). */
  getIdUsuario(): number | null {
    const payload = this.decodificarToken();
    const id = payload?.id_usuario ?? payload?.id ?? payload?.sub;
    return id != null ? Number(id) : null;
  }

  // ===================================================================
  // Privado
  // ===================================================================

  /**
   * Guarda o token e descobre o papel/nome do usuário logado.
   *
   * BLOQUEIO CONHECIDO: a documentação do backend (POSTMAN.md) só confirma que
   * o login devolve "token" — não confirma se também vem um objeto "usuario"
   * junto na resposta. Por segurança, este método tenta ler resp.usuario
   * primeiro e, se não vier, decodifica o próprio JWT em busca das claims
   * (tipo_usuario, papel, role, nome...). Assim que o formato real for
   * confirmado com o backend, dá pra simplificar isso removendo os caminhos
   * que não forem usados.
   */
  private armazenarSessao(resp: LoginResponse): void {
    localStorage.setItem('token', resp.token);

    const payload = this.decodificarToken(resp.token);
    const papel: TipoUsuario | '' =
      resp.usuario?.tipo_usuario ?? payload?.tipo_usuario ?? payload?.papel ?? payload?.role ?? '';
    const nome = resp.usuario?.nome ?? payload?.nome ?? '';

    localStorage.setItem('papel', papel);
    localStorage.setItem('nome', nome);

    this.isLoggedIn.set(true);
    this.papel.set(papel);
    this.nomeUsuario.set(nome);
  }

  /** Decodifica a parte do meio (payload) de um JWT, sem validar assinatura. */
  private decodificarToken(token?: string | null): JwtPayload | null {
    const t = token ?? this.getToken();
    if (!t) return null;
    try {
      const base64Url = t.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  private temToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getPapelSalvo(): TipoUsuario | '' {
    return (localStorage.getItem('papel') as TipoUsuario) || '';
  }

  private getNomeSalvo(): string {
    return localStorage.getItem('nome') || '';
  }
}
