# 🚀 Guia de Deploy & Operações — Tatiana Cavalcanti Imóveis

Este documento descreve o procedimento completo de implantação contínua (CI/CD), arquitetura de infraestrutura, checklist pré-voo, configuração de domínio e plano de contingência (rollback) para a plataforma **Tatiana Cavalcanti Imóveis**.

---

## 🏗️ 1. Arquitetura de Produção

| Componente | Tecnologia / Provedor | Função |
| :--- | :--- | :--- |
| **Framework** | Astro 5 (Static Site Generation - SSG) | Compilação ultra-otimizada de páginas estáticas e hidratação seletiva (React Islands). |
| **Hospedagem & CDN** | Vercel Edge Network | Distribuição global de ativos estáticos, terminação SSL automática e alta disponibilidade. |
| **Controle de Versão** | GitHub (`main` branch) | Versionamento de código e disparo de webhooks de deploy. |
| **Pipeline de CI** | GitHub Actions (`.github/workflows/ci.yml`) | Validação automática de build e execução de 28 testes E2E Playwright a cada Push / PR. |
| **Domínio Oficial** | `https://tatianacavalcanti.com.br` | Apontamento DNS via registros A / CNAME com certificado TLS/HTTPS gerenciado. |
| **SEO & GEO (IA)** | `sitemap.xml`, `robots.txt`, `llms.txt`, `/docs/*.md` | Indexação para buscadores clássicos e crawlers de IA (Perplexity, ChatGPT, Claude). |

---

## 📋 2. Checklist Pré-Deploy (Pre-flight)

Antes de enviar qualquer alteração para o ambiente de produção, execute os comandos de validação local:

```bash
# 1. Verificar integridade dos tipos e build de produção
npm run build

# 2. Executar a suíte de testes E2E com Playwright (Desktop + Mobile)
npm run test:e2e
```

### Critérios de Aceite:
- [x] `npm run build` conclui com status `Complete!` sem erros de compilação ou assets ausentes.
- [x] Todos os 28 testes em `tests/e2e/` passam com 100% de sucesso.
- [x] O diretório `dist/` gerado contém `index.html`, `sitemap.xml`, `robots.txt`, `llms.txt` e a pasta `docs/`.
- [x] O `.gitignore` garante que arquivos sensíveis (`.env`, `.env*.local`) e pastas temporárias (`node_modules/`, `dist/`, `test-results/`) não sejam comitados.

---

## 🛠️ 3. Passo a Passo de Deploy (GitHub ➔ Vercel)

### Passo 1: Preparar o Repositório Local
Caso ainda não tenha feito o commit inicial das configurações:

```bash
# Verificar status dos arquivos modificados
git status

# Adicionar todos os arquivos rastreados
git add .

# Criar o commit de produção
git commit -m "feat: complete production readiness, vercel configs and e2e test suite"
```

### Passo 2: Publicar no GitHub
1. Crie um novo repositório na sua conta do GitHub (ex: `imobiliaria-tatiana-cavalcanti`).
2. Vincule o repositório remoto e faça o push para a branch `main`:

```bash
# Vincular o repositório remoto (substitua pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Enviar o código para a branch principal
git branch -M main
git push -u origin main
```

---

### Passo 3: Conectar à Vercel

1. Acesse o painel da [Vercel](https://vercel.com) e faça login com a mesma conta do **GitHub**.
2. Clique no botão **"Add New..."** no canto superior direito e selecione **"Project"**.
3. Localize o repositório que você acabou de subir e clique em **"Import"**.
4. Configure as opções do projeto:
   - **Framework Preset:** `Astro` (detectado automaticamente).
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (ou padrão)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Clique em **"Deploy"**.

> ⚡ **Deploy Automático:** A partir deste momento, todo commit enviado para a branch `main` disparará uma nova versão em produção na Vercel em poucos segundos.

---

## 🌐 4. Configuração de Domínio e DNS

Para apontar o domínio próprio `tatianacavalcanti.com.br` para a Vercel:

1. No painel do seu projeto na Vercel, vá em **Settings** ➔ **Domains**.
2. Digite `tatianacavalcanti.com.br` e clique em **Add**.
3. No painel onde seu domínio foi registrado (Registro.br, Cloudflare, GoDaddy, etc.), crie as seguintes entradas DNS:

| Tipo | Nome / Host | Valor / Destino | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (raiz) | `76.76.21.21` | Automático / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automático / 3600 |

*A Vercel provisionará e renovará os certificados SSL (Let's Encrypt) automaticamente assim que o DNS propagar.*

---

## 🔒 5. Segurança e Cache (`vercel.json`)

O arquivo [`vercel.json`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/vercel.json) já está configurado na raiz com as seguintes políticas:

1. **Cabeçalhos de Segurança (OWASP):**
   - `X-Frame-Options: DENY` (previne clickjacking).
   - `X-Content-Type-Options: nosniff` (bloqueia sniffing de MIME types).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
2. **URLs Limpas:**
   - `cleanUrls: true` e `trailingSlash: false`.
3. **Estratégia de Cache HTTP:**
   - Bundles estáticos (`/_astro/*`): Cache imutável de **1 ano** (`max-age=31536000, immutable`).
   - Arquivos de descoberta (`sitemap.xml`, `robots.txt`, `llms.txt`): Cache de **24h** com revalidação em segundo plano (`stale-while-revalidate=43200`).
   - Documentação de IA (`/docs/*`): Mime-type forçado para `text/markdown; charset=utf-8`.

---

## 🧪 6. Testes Automatizados no CI (GitHub Actions)

O arquivo [`.github/workflows/ci.yml`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/.github/workflows/ci.yml) executa automaticamente a cada Push ou Pull Request:
1. `npm ci` (instalação limpa e reproduzível das dependências);
2. `npm run build` (garante que não há erros de tipagem ou compilação do Astro);
3. Instalação do Chromium do Playwright;
4. `npm run test:e2e` (executa os 28 cenários BDD cobrindo Desktop e Mobile).

---

## 🚨 7. Procedimento de Contingência (Rollback)

Se for identificada qualquer anomalia após um deploy em produção:

### Opção A: Rollback Instantâneo via Painel da Vercel (Recomendado - 5 segundos)
1. No painel da Vercel, acesse a aba **Deployments**.
2. Localize o último deploy que estava 100% estável.
3. Clique nos três pontinhos (`...`) ao lado dele e selecione **"Instant Rollback"** (ou **"Promote to Production"**).
4. O tráfego do domínio será redirecionado para a versão anterior de forma atômica e imediata, sem necessidade de novo build.

### Opção B: Rollback via Git
```bash
# Reverter o último commit que causou a falha
git revert HEAD

# Enviar o commit de reversão para o GitHub
git push origin main
```
*A Vercel detectará o novo push e publicará o build corrigido automaticamente.*

---

## 📌 8. Comandos de Referência Rápida

```bash
# Iniciar ambiente de desenvolvimento
npm run dev

# Gerar build de produção local
npm run build

# Testar a versão compilada localmente
npm run preview

# Executar todos os testes E2E Playwright
npm run test:e2e

# Abrir o painel interativo visual do Playwright
npm run test:e2e:ui

# Fazer deploy direto via Vercel CLI (opcional)
npx vercel --prod
```
