# Plano de Configuração do GitHub Actions — Tatiana Cavalcanti Imóveis

> **Slug:** `github-actions-setup.md`  
> **Status:** PLANEJADO  
> **Tipo de Projeto:** WEB (Astro 5 + Playwright E2E + Vercel)  
> **Repositório Remoto:** `https://github.com/Gee152/imobiliaria.git`  
> **Branch Principal:** `main`

---

## 1. Visão Geral (Overview)

### Contexto Atual & Diagnóstico
O repositório local já conta com uma esteira automatizada pré-configurada em [`.github/workflows/ci.yml`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/.github/workflows/ci.yml), contemplando:
- Checkout do código (`actions/checkout@v4`).
- Instalação e cache do Node.js v22 (`actions/setup-node@v4`).
- Instalação limpa das dependências (`npm ci`).
- Validação do build do Astro 5 (`npm run build`).
- Instalação das dependências do Playwright Chromium.
- Execução da suíte completa de 28 testes E2E (`npm run test:e2e`).

**Causa Raiz de Não Estar Ativo:**
A pasta [`.github/`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/.github) encontra-se atualmente **Untracked** (não rastreada) no Git local. Por essa razão, ao realizar o `git push` para `origin main`, o GitHub ainda não recebeu a pasta de workflows, e portanto nenhuma action foi disparada na aba **Actions**.

### Objetivo
Ativar, versionar e validar o GitHub Actions no repositório remoto, garantindo que todo `push` ou `pull_request` na branch `main` execute a bateria de testes e sirva de esteira de qualidade contínua para o deploy de produção (Vercel).

---

## 2. Critérios de Sucesso (Success Criteria)

- [ ] A pasta [`.github/workflows/ci.yml`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/.github/workflows/ci.yml) é adicionada ao Git, commitada e enviada para o GitHub.
- [ ] A aba **Actions** em `https://github.com/Gee152/imobiliaria/actions` reconhece o workflow `CI - Build & E2E Verification`.
- [ ] O pipeline executa com sucesso no runner Ubuntu da nuvem do GitHub, passando em todas as 6 etapas (Checkout, Setup Node 22, npm ci, Build, Install Playwright Chromium, Test E2E).
- [ ] As permissões do repositório no GitHub (`Settings > Actions > General`) estão configuradas corretamente com suporte de leitura e execução.
- [ ] O [README.md](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/README.md) recebe o Badge dinâmico de status do GitHub Actions.

---

## 3. Stack Tecnológica & Decisões Arquiteturais

| Componente | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Runner** | `ubuntu-latest` | Rápido, econômico na quota do GitHub e totalmente compatível com headless Chromium. |
| **Node.js** | Versão `22` com `cache: 'npm'` | Garante paridade com os padrões modernos de runtime e acelera as execuções subsequentes via cache. |
| **Instalação** | `npm ci` | Instalação estrita e determinística orientada ao `package-lock.json`. |
| **Validação E2E** | Playwright Chromium | Validação visual e funcional dos 28 cenários com menor consumo de banda no runner que instalar todos os browsers. |
| **Integração de Deploy** | Vercel Git Integration | Desacoplado: O GitHub Actions atua como Quality Gate (CI) e a Vercel publica após os commits na branch `main`. |

---

## 4. Estrutura de Arquivos

```text
imobiliaria/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Workflow principal de CI (Build & E2E)
│       └── (opcional) deploy.yml  # Workflow de Deploy manual/Vercel CLI
├── tests/
│   └── e2e/
│       └── landing-page.spec.ts   # Suíte de 28 testes automatizados
├── DEPLOY.md                      # Guia operacional de infraestrutura
├── README.md                      # Documentação com Badge de CI
└── package.json                   # Scripts de build e test:e2e
```

---

## 5. Divisão de Tarefas (Task Breakdown)

### Tarefa 1: Rastrear e Commitar o Workflow no Git Local
- **ID:** `TASK-01`
- **Agente:** `devops-engineer`
- **Habilidades:** `clean-code`, `powershell-windows`
- **Prioridade:** P0 (Bloqueador)
- **Dependências:** Nenhuma
- **INPUT:** Arquivo local [`.github/workflows/ci.yml`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/.github/workflows/ci.yml) untracked.
- **OUTPUT:** Arquivo rastreado, com commit semântico padronizado (`ci: add github actions build and e2e validation workflow`).
- **VERIFY:** `git status` mostra o arquivo em staged ou já comitado sem pendências.

---

### Tarefa 2: Publicar a Branch no GitHub Remote
- **ID:** `TASK-02`
- **Agente:** `devops-engineer`
- **Habilidades:** `deployment-procedures`
- **Prioridade:** P0
- **Dependências:** `TASK-01`
- **INPUT:** Commit local na branch `main`.
- **OUTPUT:** `git push origin main` executado com sucesso para `https://github.com/Gee152/imobiliaria.git`.
- **VERIFY:** `git log -1` alinhado entre `HEAD` e `origin/main`.

---

### Tarefa 3: Validar e Ajustar Configurações no Painel do GitHub
- **ID:** `TASK-03`
- **Agente:** `devops-engineer`
- **Habilidades:** `deployment-procedures`
- **Prioridade:** P1
- **Dependências:** `TASK-02`
- **INPUT:** Acesso ao painel do repositório no GitHub.
- **OUTPUT:** Conferência dos seguintes pontos:
  1. **Aba Actions:** Verificar se a execução do commit iniciou e acompanhar os logs (`https://github.com/Gee152/imobiliaria/actions`).
  2. **Settings > Actions > General > Workflow Permissions:** Garantir que esteja selecionado *"Read and write permissions"* ou *"Read repository contents and packages permissions"*.
  3. **Settings > Actions > General > Actions permissions:** Garantir que *"Allow all actions and reusable workflows"* esteja habilitado.
- **VERIFY:** O workflow `CI - Build & E2E Validation` finaliza com status verde (Checkmark ✅).

---

### Tarefa 4: Adicionar Badge de Status ao README.md
- **ID:** `TASK-04`
- **Agente:** `frontend-specialist`
- **Habilidades:** `documentation-templates`
- **Prioridade:** P2
- **Dependências:** `TASK-03`
- **INPUT:** [README.md](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/README.md) existente.
- **OUTPUT:** Inserção do badge de status do workflow no topo do README:
  `[![CI](https://github.com/Gee152/imobiliaria/actions/workflows/ci.yml/badge.svg)](https://github.com/Gee152/imobiliaria/actions/workflows/ci.yml)`
- **VERIFY:** Visualização do README com o badge renderizado e apontando para a execução do CI.

---

### Tarefa 5 (Opcional): Configurar Secrets para CD direto na Vercel
- **ID:** `TASK-05`
- **Agente:** `security-auditor`
- **Habilidades:** `deployment-procedures`, `vulnerability-scanner`
- **Prioridade:** P3 (Alternativa avançada)
- **Dependências:** `TASK-03`
- **INPUT:** Caso o usuário deseje que o GitHub Actions faça o deploy explícito em vez da integração nativa da Vercel.
- **OUTPUT:** Criação de Secrets no repositório (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) e criação do job de deploy pós-testes.
- **VERIFY:** Deploy disparado apenas se a etapa de testes Playwright passar.

---

## 6. Fase X: Checklist de Verificação Final

- [ ] [`.github/workflows/ci.yml`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/.github/workflows/ci.yml) presente e versionado no Git.
- [ ] Execução do GitHub Actions disparada e concluída com sucesso no GitHub.
- [ ] Nenhuma credencial ou token sensível exposto em texto plano.
- [ ] Testes Playwright executados em modo headless sem falhas de timeout no runner.
- [ ] Badge de status adicionado e funcionando no [README.md](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/README.md).
