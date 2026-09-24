// Tipos centrais da aplicação — Incremento 2
//
// A partir daqui os nomes de campo seguem snake_case, igual às colunas do banco
// oficial (aulasempre.sql) e ao formato que a API Node.js/Express devolve.
// Isso é diferente do padrão camelCase usado quando o backend era Spring Boot.

// ===================================================================
// Autenticação
// ===================================================================

export interface LoginRequest {
  email: string;
  senha: string;
}

export type TipoUsuario = 'ESCOLA' | 'PROFESSOR';

/**
 * BLOQUEIO CONHECIDO: o POSTMAN.md do backend só confirma que o login devolve
 * "token". Não está confirmado se ele também devolve um objeto "usuario" junto.
 * Por isso "usuario" aqui é opcional — o AuthService sabe lidar com os dois casos
 * (ver comentário lá). Assim que o formato real for confirmado, isso pode ser
 * simplificado.
 */
export interface LoginResponse {
  token: string;
  usuario?: {
    id_usuario: number;
    nome?: string;
    email?: string;
    tipo_usuario: TipoUsuario;
    id_escola?: number | null;
  };
}

/** Claims esperadas dentro do JWT, usadas como respaldo se o login não trouxer "usuario". */
export interface JwtPayload {
  id_usuario?: number;
  id?: number;
  sub?: number | string;
  tipo_usuario?: TipoUsuario;
  papel?: TipoUsuario;
  role?: TipoUsuario;
  email?: string;
  nome?: string;
  id_escola?: number;
  id_professor?: number;
  iat?: number;
  exp?: number;
}

// ===================================================================
// Catálogos (disciplina e nível de ensino agora são tabelas no banco,
// não mais um texto livre ou um enum fixo)
// ===================================================================

export interface CatalogoItem {
  id: number;
  nome: string;
}

// ===================================================================
// Enums do domínio (schema oficial aulasempre.sql)
// ===================================================================

export type DiaSemana = 'DOMINGO' | 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO';
export type StatusProfessor = 'DISPONIVEL' | 'INDISPONIVEL' | 'EM_SUBSTITUICAO';
export type TipoFormacao = 'GRADUACAO' | 'LICENCIATURA' | 'BACHARELADO' | 'POS_GRADUACAO' | 'MESTRADO' | 'DOUTORADO';
export type StatusFormacao = 'CONCLUIDO' | 'EM_ANDAMENTO' | 'INCOMPLETO';
export type StatusSolicitacao = 'ABERTA' | 'EM_PROCESSO' | 'PREENCHIDA' | 'CONCLUIDA' | 'CANCELADA';
export type StatusConvite = 'PENDENTE' | 'ACEITO' | 'RECUSADO' | 'EXPIRADO' | 'CANCELADO';
export type StatusSubstituicao = 'AGENDADA' | 'EM_ANDAMENTO' | 'REALIZADA' | 'CANCELADA' | 'FALTA_PROFESSOR';

export const DIAS_SEMANA: { value: DiaSemana; label: string }[] = [
  { value: 'DOMINGO', label: 'Domingo' },
  { value: 'SEGUNDA', label: 'Segunda-feira' },
  { value: 'TERCA', label: 'Terça-feira' },
  { value: 'QUARTA', label: 'Quarta-feira' },
  { value: 'QUINTA', label: 'Quinta-feira' },
  { value: 'SEXTA', label: 'Sexta-feira' },
  { value: 'SABADO', label: 'Sábado' },
];

export const TIPOS_FORMACAO: { value: TipoFormacao; label: string }[] = [
  { value: 'GRADUACAO', label: 'Graduação' },
  { value: 'LICENCIATURA', label: 'Licenciatura' },
  { value: 'BACHARELADO', label: 'Bacharelado' },
  { value: 'POS_GRADUACAO', label: 'Pós-graduação' },
  { value: 'MESTRADO', label: 'Mestrado' },
  { value: 'DOUTORADO', label: 'Doutorado' },
];

// ===================================================================
// Entidades — os campos já seguem o schema oficial, mas os services que os
// consomem (solicitações, convites, perfil, avaliação) só entram nos
// Incrementos 3, 4 e 5. Ficam definidos aqui desde já pra não precisar
// redefinir tipo por tipo mais tarde.
// ===================================================================

export interface SolicitacaoRequest {
  id_disciplina: number;
  id_nivel_ensino: number;
  data_aula: string;       // formato YYYY-MM-DD
  horario_inicio: string;  // formato HH:mm
  horario_fim: string;
  turma: string;
  observacoes: string;
}

export interface SolicitacaoResponse {
  id_solicitacao: number;
  id_escola: number;
  id_disciplina: number;
  id_nivel_ensino: number;
  data_aula: string;
  horario_inicio: string;
  horario_fim: string;
  turma: string;
  observacoes: string;
  status: StatusSolicitacao;
  data_criacao: string;
}

export interface ProfessorCompativel {
  id_professor: number;
  nome_profissional: string;
  descricao: string;
  cidade: string;
  estado: string;
  anos_experiencia: number;
  status: StatusProfessor;
}

export interface ConviteRequest {
  id_solicitacao: number;
  id_professor: number;
}

export interface ConviteResponse {
  id_convite: number;
  id_solicitacao: number;
  id_professor: number;
  status: StatusConvite;
  data_envio: string;
  data_resposta: string | null;
  observacao?: string;
}

export interface Formacao {
  id_formacao?: number;
  curso: string;
  instituicao: string;
  tipo_formacao: TipoFormacao;
  ano_conclusao: number;
  status: StatusFormacao;
}

export interface Disponibilidade {
  id_disponibilidade?: number;
  dia_semana: DiaSemana;
  horario_inicio: string;
  horario_fim: string;
  ativo: boolean;
}

export interface PerfilProfessor {
  id_professor: number;
  nome_profissional: string;
  descricao: string;
  cidade: string;
  estado: string;
  anos_experiencia: number;
  status: StatusProfessor;
  disciplinas: CatalogoItem[];
  niveis_ensino: CatalogoItem[];
  formacoes: Formacao[];
  disponibilidades: Disponibilidade[];
}

export interface Substituicao {
  id_substituicao: number;
  id_solicitacao: number;
  id_professor: number;
  id_convite: number | null;
  data_substituicao: string;
  horario_inicio: string;
  horario_fim: string;
  status: StatusSubstituicao;
  observacoes: string;
}

export interface AvaliacaoRequest {
  nota: number;
  comentario: string;
}
