import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CatalogoItem, SolicitacaoRequest, SolicitacaoResponse,
  ProfessorCompativel, ConviteRequest, ConviteResponse, StatusConvite
} from '../models/types';

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

  // ===== Escola: solicitações =====

  /**
   * NÃO CONFIRMADO: o POSTMAN.md do backend não documenta uma rota de listagem
   * de solicitações, só criar (POST) e ver matches de uma específica. Assumi
   * GET /api/solicitacoes devolvendo as solicitações da escola logada (via
   * token). Se a rota real for diferente, ajuste só esta linha.
   */
  getMinhasSolicitacoes() {
    return this.http.get<SolicitacaoResponse[]>(`${this.BASE}/solicitacoes`);
  }

  criarSolicitacao(req: SolicitacaoRequest) {
    return this.http.post<SolicitacaoResponse>(`${this.BASE}/solicitacoes`, req);
  }

  getMatches(idSolicitacao: number) {
    return this.http.get<ProfessorCompativel[]>(`${this.BASE}/solicitacoes/${idSolicitacao}/matches`);
  }

  // ===== Convites =====

  enviarConvite(req: ConviteRequest) {
    return this.http.post<ConviteResponse>(`${this.BASE}/convites`, req);
  }

  /**
   * NÃO CONFIRMADO: mesma situação da listagem de solicitações — assumi
   * GET /api/convites devolvendo os convites do professor logado (via token).
   */
  getMeusConvites() {
    return this.http.get<ConviteResponse[]>(`${this.BASE}/convites`);
  }

  responderConvite(idConvite: number, status: Extract<StatusConvite, 'ACEITO' | 'RECUSADO'>) {
    return this.http.patch<ConviteResponse>(`${this.BASE}/convites/${idConvite}/resposta`, { status });
  }

  // Perfil do professor (redesenho de formação/disciplinas), substituições e
  // avaliação entram nos próximos incrementos.
}
