# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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

---

## Bugs Conhecidos
* Nenhum bug crítico identificado nesta etapa de limpeza.

## Bloqueios e Dependências Externas
1. **Endpoint de Auto-Cadastro de Usuário:** O backend Node.js (`caioo-o/aulasempre-back-end`) atualmente expõe rotas de login (`POST /api/auth/login`) e operações autenticadas, mas ainda não possui endpoints documentados para cadastro público de novas escolas ou novos professores (`POST /api/auth/registro-escola` / `registro-professor`). Caso esse endpoint não seja disponibilizado pela equipe de backend até a integração dessa tela, o fluxo de registro utilizará simulação (mock) local com aviso no CHANGELOG.
2. **Listagem e Gestão de Substituições (Escola):** Os endpoints de consulta para histórico de substituições da escola e agregação de médias/avaliações no perfil não estão documentados no backend atual.
