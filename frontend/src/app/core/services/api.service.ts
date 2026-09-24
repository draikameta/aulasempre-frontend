import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CatalogoItem } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ApiService {

  // Base da API do backend Node.js/Express. Ajuste a porta se o .env do
  // backend definir uma diferente de 3000 (padrão do Express).
  private readonly BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ===== Catálogos =====
  getDisciplinas() {
    return this.http.get<CatalogoItem[]>(`${this.BASE}/catalogos/disciplinas`);
  }

  getNiveisEnsino() {
    return this.http.get<CatalogoItem[]>(`${this.BASE}/catalogos/niveis-ensino`);
  }

  // Os métodos de solicitações, matching, convites, perfil, substituições e
  // avaliação entram nos próximos incrementos (3, 4 e 5), junto com as telas
  // que os usam — não faz sentido escrevê-los sem a tela que os chama.
}
