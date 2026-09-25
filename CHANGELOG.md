# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.3.0] - Incremento 3: Jornada principal completa — Área da Escola + Resposta de Convites (~65% acumulado)

Este incremento foi maior que o planejado originalmente: juntou o Incremento 3
inteiro (Área da Escola) com a parte do Incremento 4 que fecha o fluxo principal
(professor responder convite), a pedido do time, pra deixar a jornada ponta a
ponta funcionando antes do redesenho do perfil do professor.

### Adicionado
- **Escola:** dashboard listando solicitações (`escola/dashboard`), formulário de nova solicitação com dropdowns de catálogo (`escola/solicitacoes/nova`), tela de professores compatíveis com botão de convite (`escola/solicitacoes/:id/professores`).
- **Professor:** tela de convites recebidos com aceitar/recusar (`professor/convites`).
- `ApiService`: métodos para criar solicitação, buscar matches, enviar convite, listar convites e responder convite.
- Login agora redireciona por papel (`ESCOLA` → dashboard, `PROFESSOR` → convites) em vez de cair numa tela genérica.
- Removida a tela provisória `home` do Incremento 2 (não é mais necessária).

### Bloqueios / Bugs conhecidos
- **`GET /api/solicitacoes` (listar solicitações da escola) e `GET /api/convites` (listar convites do professor) NÃO estão confirmados no `POSTMAN.md` do backend.** Foram implementados assumindo o padrão REST óbvio (lista filtrada pelo usuário logado via token). **Isso precisa ser testado contra o backend real antes de considerar essa parte pronta** — se a rota ou o formato for diferente, o ajuste é só nesses dois métodos do `ApiService`, não estrutural.
- Segue de pé o bloqueio do Incremento 2 sobre o formato da resposta do login.
- Perfil do professor (disciplinas, níveis de ensino, formações) ainda não foi redesenhado — os professores que aparecem no matching dependem dos dados de teste (seed) do `aulasempre.sql`, não de dados cadastrados pela UI ainda.

---

# [0.2.0] - Incremento 2: Camada Core, Models em snake_case e Catálogos Dinâmicos (~35% acumulado)

### Adicionado
- `core/models/types.ts` reescrito em snake_case, alinhado ao schema oficial (`aulasempre.sql`) e à API Node.js.
- `AuthService` adaptado para `POST /api/auth/login`, com decodificação defensiva do JWT (ver Bloqueios).
- `ApiService` adaptado para consumir `GET /api/catalogos/disciplinas` e `GET /api/catalogos/niveis-ensino`.
- Tela `home` (provisória): confirma login funcionando e lista os catálogos carregados da API, como validação de ponta a ponta deste incremento.
- Tema do Angular Material (`azure-blue`) aplicado em `styles.scss`.

### Alterado
- `login.component.ts`: removidos os links de cadastro (bloqueados, ver abaixo); redireciona para `/home` após login.
- `navbar.component.ts`: link único para `/home` (links por papel chegam nos Incrementos 3/4).
- `app.routes.ts`: contém só as rotas deste incremento (`/login`, `/home`).

### Bloqueios / Bugs conhecidos
- **Formato da resposta do login não confirmado.** O `POSTMAN.md` do backend só documenta `-> token`. O `AuthService` foi escrito para funcionar nos dois cenários possíveis (token puro, decodificando o JWT: ou token + objeto `usuario`), mas isso precisa ser confirmado contra o backend real e simplificado depois.
- **Sem endpoint de cadastro documentado.** Não há rota de registro de escola/professor na documentação do backend Node. As telas de cadastro não foram construídas neste incremento; login só funciona com usuários já existentes no banco (`aulasempre.sql`).
- **Porta do backend assumida como 3000** (padrão do Express) em `AuthService` e `ApiService`. Ajustar se o `.env` do backend usar outra porta.

---

## [0.1.0] - 2026-09-23
### Progresso Acumulado do Frontend: ~15%

### Adicionado
- Configuração do repositório exclusivo para o frontend Angular do AulaSempre (`draikameta/aulasempre-frontend`).
- Inicialização deste `CHANGELOG.md` estruturado em Keep a Changelog para rastreamento incremental do desenvolvimento.

### Modificado
- `README.md`: reformulado para remover o legado em Java/Spring Boot e documentar exclusivamente a arquitetura e execução da SPA Angular, referenciando o repositório oficial da API Node.js/Express (`caioo-o/aulasempre-back-end`).

### Removido
- Diretório `backend/`: remoção integral do backend legado em Spring Boot/Java/H2/MySQL para desacoplamento total entre os repositórios da equipe.

## Bugs Conhecidos
* Nenhum bug crítico identificado nesta etapa de limpeza.

## Bloqueios e Dependências Externas
1. **Endpoint de Auto-Cadastro de Usuário:** O backend Node.js (`caioo-o/aulasempre-back-end`) atualmente expõe rotas de login (`POST /api/auth/login`) e operações autenticadas, mas ainda não possui endpoints documentados para cadastro público de novas escolas ou novos professores (`POST /api/auth/registro-escola` / `registro-professor`). Caso esse endpoint não seja disponibilizado pela equipe de backend até a integração dessa tela, o fluxo de registro utilizará simulação (mock) local com aviso no CHANGELOG.
2. **Listagem e Gestão de Substituições (Escola):** Os endpoints de consulta para histórico de substituições da escola e agregação de médias/avaliações no perfil não estão documentados no backend atual.

