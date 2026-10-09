# Plano: Efeito Surpresa Cinematográfico no Primeiro Scroll & Métricas Dinâmicas

> **Slug:** `cinematic-scroll-effects`  
> **Status:** Concluído & Implementado com Sucesso  
> **Agente Responsável:** `frontend-specialist`  
> **Skills Ativas:** `clean-code`, `frontend-design`, `nextjs-react-expert`  
> **Objetivo:** Orquestrar um desbloqueio cinematográfico no primeiro scroll, com convergência de cards (elementos superiores caindo do topo e inferiores subindo da base) e animação de contagem numérica fluida para as métricas da Hero.

---

## 🎯 Contexto e Decisões Alinhadas

Com base nas preferências confirmadas:
1. **Desbloqueio Cinematográfico:** O primeiro movimento de rolagem (mouse, touch ou tecla) dispara uma cascata sincronizada de surpresa, ativando as revelações em harmonia.
2. **Contadores Numéricos Dinâmicos:** As métricas de autoridade da Hero realizam contagem suave em tempo real (de `0` a `15` anos e de `0%` a `100%` acompanhamento) com desaceleração exponencial refinada (1200ms).
3. **Efeito Híbrido / Convergente (Drop & Rise):**
   - Cards e selos superiores caem suavemente do topo (`translateY(-48px)` ➔ `0`) com física elástica natural (*spring dampening*).
   - Elementos e cards inferiores sobem da base (`translateY(48px)` ➔ `0`).
   - Ambos convergem no centro com precisão milimétrica e elegância visual de alto padrão.

---

## 🏗️ Arquitetura das Tarefas

```mermaid
graph TD
    A[Primeiro Scroll do Usuário] --> B[Disparo Global 'cinematic-unlocked']
    B --> C[Física Convergente: Cards Superiores Caem / Inferiores Sobem]
    B --> D[Engine de Contagem RAF: 0 ➔ 15 anos | 0% ➔ 100%]
    C --> E[Estabilização Elástica com Spring Physics]
    D --> E
    E --> F[Experiência Fluida de Navegação Contínua]
```

---

## 📋 Detalhamento das Etapas

### Fase 1: Sistema de Estilos & Física Elástica (CSS)
* **Arquivo Alvo:** [`src/styles/global.css`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/src/styles/global.css)
* **Status:** ✅ Concluído.
* **Ações:**
  * Adicionadas classes de convergência:
    * `.converge-drop`: Inicialmente deslocado para cima (`translate3d(0, -48px, 0)` + `opacity: 0`), transicionando com curva de mola suave (`cubic-bezier(0.175, 0.885, 0.32, 1.12)`).
    * `.converge-rise`: Inicialmente deslocado para baixo (`translate3d(0, 48px, 0)` + `opacity: 0`), transicionando em contra-movimento.
  * Suporte a estado ativo coordenado: `.cinematic-unlocked .converge-drop`, `.cinematic-unlocked .converge-rise`.
  * Compatibilidade total com `prefers-reduced-motion`.

### Fase 2: Engine de Primeiro Scroll & Contador Numérico (TS)
* **Arquivo Alvo:** [`src/scripts/scrollManager.ts`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/src/scripts/scrollManager.ts)
* **Status:** ✅ Concluído.
* **Ações:**
  * **Detector de Primeiro Scroll:**
    * Captura o primeiro gatilho de interação de rolagem (`scroll`, `wheel`, `touchmove`, `keydown`).
    * Aplica a classe `cinematic-unlocked` na raiz da página de forma imediata e permanente.
  * **Motor de Contagem Numérica (RAF):**
    * Seleciona elementos com atributo `data-counter-target="15"` e `data-counter-target="100"`.
    * Interpola os números a 60fps usando `requestAnimationFrame` com easing cúbico desacelerado (1.4s de duração).
    * Ao finalizar a contagem, aplica efeito pop sutil e classe `.counter-finished`.

### Fase 3: Integração dos Componentes na Hero
* **Arquivo Alvo:** [`src/components/Hero.astro`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/src/components/Hero.astro)
* **Status:** ✅ Concluído.
* **Ações:**
  * **Selo Conceito Superior** (*"Só é dono quem registra"*): Aplicado `.converge-drop delay-200 card-dynamic`.
  * **Card Visual Principal (Desktop e Mobile)**: Aplicado `.converge-drop delay-100 card-dynamic`.
  * **Selo Localização Inferior** (*"Recife — Zona Norte"*): Aplicado `.converge-rise delay-250 card-dynamic`.
  * **Grid de Métricas de Autoridade**:
    * Métrica 01: Configurado `<span class="metric-counter" data-counter-target="15">0</span> anos`.
    * Métrica 02: Configurado `<span class="metric-counter" data-counter-target="100">0</span>%`.
    * Métrica 03: Zona Norte com card dinâmico.
  * Aplicado `.converge-rise delay-200` no bloco de métricas.

### Fase 4: Validação, Diagnóstico de Bugs & Resolução
* **Status:** ✅ Concluído e Validado em Navegador Real.
* **Causas Raiz Identificadas e Resolvidas:**
  1. **Inversão da Ordem das Seções em [`src/pages/index.astro`](file:///c:/Users/gabri/OneDrive/Documentos/projetos/imobiliaria/src/pages/index.astro):** A `<ScrollStory>` (Maquete 3D) estava posicionada antes da `<Hero>`, empurrando a Hero para 2800px abaixo. Quando o usuário rolava 10px na maquete, o gatilho da Hero disparava no escuro e terminava antes do usuário chegar à seção. **Solução:** Hero movida para o topo de `<main>`, exatamente como previsto no projeto original.
  2. **Contaminação de Seletor (`revealSelector`):** `.converge-drop` e `.converge-rise` estavam incluídos no observer genérico, recebendo `.is-revealed` no instante de carregamento e anulando a animação de primeiro scroll. **Solução:** Removidos do seletor genérico para controle exclusivo do motor cinematográfico.
  3. **Conflito de `transform` com Parallax:** Os badges flutuantes possuíam `converge-drop` e `data-parallax` no mesmo nó HTML; o loop de parallax sobrescrevia inline o `transform` da transição CSS. **Solução:** Separação em wrapper externo (convergência) e interno (parallax contínuo e hover card).
  4. **Erro de Inicialização (TDZ ReferenceError):** `triggerCinematicUnlock` invocava `runNumberCounters` antes da declaração de `countersAnimated`. **Solução:** Reordenadas as declarações para eliminar qualquer erro de escopo no bundle.
  5. **Bloqueio Agressivo por `prefers-reduced-motion`:** No Windows com efeitos visuais desligados pelo sistema, a media query forçava `opacity: 1 !important; transform: none !important; transition: none !important;` e o JS abortava os contadores. **Solução:** Adaptação suave para `prefers-reduced-motion` com fade sutil e interpolação numérica não intrusiva.

---

## 🛡️ Critérios de Aceite & Verificação

- [x] A Hero agora abre no topo da página diretamente abaixo do Header.
- [x] O primeiro scroll do usuário (ou wheel/touch) desbloqueia a cena sem atraso perceptível.
- [x] O número de experiência sobe suavemente de `0` para `15 anos`.
- [x] A taxa de registro sobe suavemente de `0%` para `100%`.
- [x] Os cards superiores caem do topo e os inferiores sobem, encontrando-se no centro com física elástica natural.
- [x] Após a Hero, a maquete 3D (`ScrollStory`) segue suavemente pelo fluxo da página.
- [x] Testado e verificado via `npm run build` e execução no Chrome DevTools com 0 erros de console.
