# AulaSempre — Frontend

Interface Web (SPA) em Angular para a plataforma **AulaSempre**, onde escolas encontram rapidamente professores substitutos compatíveis e disponíveis.

---

## 🏛 Arquitetura

O ecossistema do AulaSempre é dividido em repositórios desacoplados:

* **Frontend (este repositório):** SPA em Angular + Angular Material
* **Backend:** API REST desenvolvida em Node.js / Express com MySQL:
  👉 [https://github.com/caioo-o/aulasempre-back-end](https://github.com/caioo-o/aulasempre-back-end)

---

## 🚀 Como Rodar o Frontend

### Pré-requisitos
* **Node.js** 22.x+ (recomendado: 22.22.3+, 24.15+ ou 26+)
* **npm** ou **Angular CLI** instalado globalmente

### Instalação e Execução

Entre na pasta `frontend/`:

```powershell
cd frontend
npm install
npm start
```

O aplicativo estará disponível em: **`http://localhost:4200`**

---

## 🛠 Stack Tecnológica

* **Framework:** Angular 22 (Standalone Components)
* **UI Components:** Angular Material
* **Estilização:** SCSS + Material Theming
* **Comunicação:** HttpClient (REST API em formato `snake_case`)
* **Autenticação:** JWT via HttpInterceptor

---

## 📋 Funcionalidades

* **Autenticação:** Login unificado para perfis de Escola e Professor.
* **Módulo Escola:** Dashboard de demandas, criação de solicitações de substituição, busca de professores compatíveis (matching) e envio de convites.
* **Módulo Professor:** Dashboard de convites recebidos (aceite/recusa) e gestão de perfil profissional (disciplinas, níveis de ensino, formações acadêmicas e disponibilidades semanais).
* **Módulo de Avaliação:** Registro de nota e feedback após a substituição realizada.

---

Para detalhes sobre o histórico de mudanças e planejamento de entregas, consulte o [CHANGELOG.md](CHANGELOG.md).
