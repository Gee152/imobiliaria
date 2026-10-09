# Plano de Implementação — Landing Page Tatiana Cavalcanti Imóveis

> **Status:** Em Planejamento / Execução
> **Abordagem:** Mobile-First, Performance Extrema, Design Editorial Imobiliário de Luxo
> **Stack:** Astro 5 + React 19 + Tailwind CSS + Lucide Icons + Canvas/Video Scrubbing Engine

---

## 1. Visão Geral da Arquitetura

A aplicação é projetada sob o conceito **"Do interesse ao registro"** e a assinatura **"Só é dono quem registra"**, posicionando Tatiana Cavalcanti (CRECI 8988, 15 anos de mercado) como a consultora imobiliária definitiva na Zona Norte do Recife (Casa Forte, Poço da Panela, Graças, Espinheiro, Jaqueira, Tamarineira, etc.).

A arquitetura técnica utiliza **Astro** para entregar HTML ultra-rápido, estático e com pontuação perfeita de SEO (100/100 Core Web Vitals) e **React Islands** isoladas (`client:visible`, `client:load`) para os componentes que exigem alta interatividade:
1. **Scrubber da Maquete** (Scroll de 600–1000vh com sincronização suave do vídeo da maquete via `requestAnimationFrame` + fallback elegante).
2. **Catálogo Interativo de Imóveis** (Filtro reativo por bairro, tipo, quartos, metragem e objetivo: morar vs investir).
3. **Formulário de Leads com Despacho via WhatsApp** (Validação completa e geração de URL direta para `wa.me/5581997459932` com texto customizado).
4. **Gaveta / Menu Mobile-First** (Navegação touch ergonômica com zona do polegar e barra flutuante de conversão).

---

## 2. Paleta de Cores e Tokens Visuais (Sem Clichês / Anti-Safe Harbor)

| Token | Valor Hex | Aplicação |
|---|---|---|
| `--color-cacao-dark` | `#23150F` | Fundo principal da filosofia, rodapé, textos de alto contraste |
| `--color-cacao` | `#331E16` | Seções institucionais, cabeçalhos escuros, bordas refinadas |
| `--color-terracotta` | `#C85A32` | Acentos primários, botões de ação (CTA), badges de destaque |
| `--color-terracotta-hover` | `#A84723` | Estado de hover/touch dos CTAs |
| `--color-cream-bg` | `#FBF9F5` | Background global acolhedor (Off-white / Bege Claro) |
| `--color-sand-surface` | `#F2ECE4` | Superfície de cards, inputs, áreas de conteúdo |
| `--color-charcoal` | `#262320` | Cor do texto do corpo (Antracite / Cinza Chumbo) |
| `--color-muted-stone` | `#7C756D` | Textos secundários, legendas, metadados |

**Tipografia:**
- Títulos: `Playfair Display` ou `Cormorant Garamond` (Serif clássica, elegante, autoridade imobiliária).
- Corpo: `Plus Jakarta Sans` ou `Inter` (Sans-serif geométrica, altíssima legibilidade em telas móveis).

---

## 3. Estrutura de Componentes e Seções

```text
src/
├── components/
│   ├── Header.astro            # Navegação mobile-first com hamburger & CTA
│   ├── Hero.astro              # Headline impactante, foto/vídeo Tatiana, badges CRECI e anos
│   ├── ScrollStory.tsx         # [React Island client:load] Maquete 600-1000vh com video scrubbing
│   ├── AboutTatiana.astro      # Seção "15 anos abrindo portas", trajetória, bio humanizada
│   ├── BrandPhilosophy.astro   # Destaque cacao "Só é dono quem registra"
│   ├── PropertyCatalog.tsx     # [React Island client:visible] Filtros + Cards de Imóveis + Modal de detalhes
│   ├── TatiExplica.astro       # Cards educativos: Financiamento, Documentação, Registro, Compra e Venda
│   ├── PurchaseSecurity.astro  # Checklist de segurança jurídica e acompanhamento passo a passo
│   ├── Neighborhoods.astro     # Composição visual da Zona Norte do Recife (bairros atendidos)
│   ├── Differentials.astro     # Os 4 pilares: Experiência, Atendimento, Conhecimento, Orientação
│   ├── LeadForm.tsx            # [React Island client:visible] Formulário de captura com despacho WhatsApp
│   ├── FloatingWhatsApp.astro  # Botão flutuante WhatsApp (zona do polegar mobile)
│   └── Footer.astro            # Dados institucionais, CRECI 8988, links sociais e termos
├── data/
│   ├── properties.ts           # Dataset tipado de imóveis da Zona Norte (Casa Forte, Graças, Jaqueira...)
│   └── neighborhoods.ts        # Bairros e características da Zona Norte do Recife
├── layouts/
│   └── Layout.astro            # Meta tags SEO completas, Schema.org (JSON-LD), fontes, OpenGraph
└── pages/
    └── index.astro             # Orquestração das seções
```

---

## 4. Fases de Execução

1. **Scaffold do Projeto**: Inicializar Astro com React e Tailwind CSS no diretório `./`.
2. **Tokens e Estilos Base**: Configurar fontes Google (Playfair Display + Plus Jakarta Sans), paleta Cacao/Terracotta/Cream e utilitários touch.
3. **Dados Estruturados**: Criar catálogo de imóveis ricos e representativos da Zona Norte com metadados (metragem, vagas, quartos, suítes, fotos, descrições detalhadas).
4. **Mecanismo de Scrub da Maquete**: Desenvolver `ScrollStory.tsx` com controle de `currentTime` do vídeo/canvas suave a 60fps com fallback visual inteligente.
5. **Componentes da Landing Page**:
   - Header & Mobile Drawer
   - Hero Section com CTAs humanos
   - Seção Conheça a Tatiana
   - Filosofia da Marca ("Só é dono quem registra")
   - Catálogo com filtros reativos
   - Tati Explica & Checklist de Segurança Jurídica
   - Bairros da Zona Norte do Recife
   - Diferenciais & Prova
   - Formulário Tradicional com Despacho Automático WhatsApp
   - Rodapé completo e Botão Flutuante Mobile
6. **SEO & E-E-A-T**: Injeção de JSON-LD Schema (`RealEstateAgent`), OpenGraph, Twitter Cards, meta tags canônicas e semântica HTML5.
7. **Validação & Testes**: Execução de build, verificação de responsividade mobile (touch targets >= 48px) e checagem de qualidade.
