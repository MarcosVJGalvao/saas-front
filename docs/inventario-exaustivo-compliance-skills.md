# Inventário Exaustivo de Compliance das Skills

## 1. Título + Metadados da Auditoria

- Data/hora da auditoria: **2026-05-13** (America/Sao_Paulo)
- Escopo auditado: **`src/**`e`.ai-skills/**`**
- Base normativa: `AGENTS.md`, `.ai-skills/docs/*`, `.ai-skills/skills/00..26`, `.ai-skills/checklists/*`
- Objetivo: identificar aderência/não aderência por skill com evidências por arquivo/linha
- Tipo de entrega: documento técnico, **sem alteração de código de produto**

### Comandos executados (verificação objetiva)

```bash
rg --files src .ai-skills
rg -n "\bany\b|as const|@ts-ignore|@ts-expect-error|eslint-disable|eslint-disable-line|eslint-disable-next-line|\bvar\b" src .ai-skills
rg -n "\sas\s" src .ai-skills
rg -n "\uFFFD|�|Ã" src .ai-skills AGENTS.md
cmd /c npm run lint
cmd /c npm run typecheck
cmd /c npm test -- --run
```

## 2. Resumo Executivo

### Aderência estimada por bloco

- Arquitetura e camadas: **35%**
- TypeScript e regras proibidas: **55%**
- UI PT-BR / i18n / encoding: **45%**
- Testes: **80%**
- Quality Gate: **75%**

### Top 10 gaps (priorizados)

1. **Crítico**: estrutura real não segue macroestrutura mandatória (`src/app`, `src/shared`, `src/features`).
2. **Crítico**: texto corrompido (`�`) em páginas de produção.
3. **Crítico**: uso de `as const` em produção, proibido pelas skills.
4. **Alto**: uso de alias `as` e assertion em teste (`as unknown as ...`) em desacordo com skill TS.
5. **Alto**: MUI cru em pages com política de wrappers compartilhados.
6. **Alto**: centralização de i18n/erros fora da estrutura alvo `shared/i18n/pt-BR`.
7. **Médio**: fluxo `Page -> Hook -> Service -> HttpClient` não uniforme em toda base.
8. **Médio**: hardcoded visual pontual fora de tokens semânticos.
9. **Médio**: estados de tela avançados (`unauthorized`, `forbidden` etc.) sem evidência uniforme em todas pages.
10. **Baixo**: organização e nomenclatura mistas elevam custo de manutenção.

## 3. Matriz por Skill (00–26)

### Skill 00 — Global Rules

- Status: **Parcial**
- Não aderências:
  - Uso de `as const` em produção.
  - Strings corrompidas em UI.
- Evidências:
  - `src/components/layout/admin-navigation/SidebarContent.tsx:82`
  - `src/components/common/onboarding/TenantStep.tsx:14`
  - `src/pages/platform/subscriptions/SubscriptionEditPage.tsx:23`
- Impacto: quebra de regras absolutas globais.
- Correção recomendada: remover padrões proibidos e corrigir encoding antes de qualquer conclusão de task.

### Skill 01 — Project Architecture

- Status: **Não aderente**
- Não aderências:
  - Macroestrutura prevista (`app/shared/features`) não é o eixo principal da base.
- Evidências:
  - árvore atual de `src`: `assets`, `components`, `errors`, `forms`, `hooks`, `models`, `pages`, `services`, `theme`, `utils`.
- Impacto: risco de acoplamento e dificuldade para evolução por domínio.
- Correção recomendada: migração incremental de estrutura por feature.

### Skill 02 — TypeScript Quality

- Status: **Não aderente**
- Não aderências:
  - `as const` em produção.
  - alias `as` em import.
  - assertion encadeada em teste (`as unknown as`).
- Evidências:
  - `src/pages/client/auth/ResetPasswordPage.tsx:20`
  - `src/pages/platform/auth/PlatformAuthPageLayout.tsx:30`
  - `src/forms/useForm.ts:2`
  - `src/test/hooks/useCommandPaletteView.test.tsx:57`
- Impacto: viola regra explícita da skill.
- Correção recomendada: tipagem explícita com `Record`, guards e helpers sem assertions.

### Skill 03 — Page Skill

- Status: **Parcial**
- Aderência: pages consumindo hooks em diversos fluxos.
- Não aderência: presença de MUI cru em pages.
- Evidências:
  - `src/pages/platform/plans/PlanCreatePage.tsx:31`
  - `src/pages/platform/plans/PlanCreatePage.tsx:36`
  - `src/pages/platform/subscriptions/SubscriptionCreatePage.tsx:57`
- Impacto: quebra de padronização de camada de apresentação.

### Skill 04 — Component Skill

- Status: **Parcial**
- Aderência: base de componentes ampla.
- Não aderência: pontos com padrões TS proibidos/hardcoded visual.
- Evidências:
  - `src/components/common/details/ContextualDetailsDrawer.tsx:16`
  - `src/components/common/details/ContextualDetailsDrawer.tsx:72`

### Skill 05 — Component Usage

- Status: **Parcial**
- Aderência: uso recorrente de componentes compartilhados.
- Não aderência: pages ainda usam componentes MUI diretamente.
- Evidências:
  - `src/pages/platform/plans/PlanEditPage.tsx:31`
  - `src/pages/platform/subscriptions/SubscriptionEditPage.tsx:68`

### Skill 06 — Design System

- Status: **Parcial**
- Aderência: tema central existe (`src/theme/*`).
- Não aderência: hardcoded de cor/gradiente/alpha em pontos fora de token semântico único.
- Evidências:
  - `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx:126`
  - `src/components/common/data/ListFilters.tsx:330`
  - `src/components/common/details/ContextualDetailsDrawer.tsx:73`

### Skill 07 — Form Skill

- Status: **Parcial**
- Aderência: RHF/Zod presentes.
- Não aderência: qualidade textual/encoding em labels de form não está íntegra.
- Evidências:
  - `src/pages/platform/plans/PlanEditPage.tsx:31`
  - `src/pages/platform/subscriptions/SubscriptionCreatePage.tsx:57`

### Skill 08 — Service API

- Status: **Parcial**
- Aderência: camada de services estabelecida (`src/services/**`).
- Não aderência: organização fora do padrão arquitetural oficial por feature/shared.

### Skill 09 — Hook Skill

- Status: **Aderente (com ressalva estrutural)**
- Aderência: hooks amplamente usados em pages e fluxos.
- Ressalva: macroestrutura geral ainda não alinhada ao padrão alvo.

### Skill 10 — Routing Guard

- Status: **Parcial**
- Aderência: proteção existe (`ProtectedRoute`, `DomainProtectedRoute`).
- Não aderência: organização fora do `src/app/guards` esperado.

### Skill 11 — State Management

- Status: **Parcial**
- Aderência: estados globais/locais por hooks e preferências.
- Não aderência: ausência da estrutura alvo explícita de `app/store` como padrão central.

### Skill 12 — Error Handling

- Status: **Parcial**
- Aderência: estrutura de erro e feedback existe.
- Não aderência: uso de `error.message` direto em fluxos de hook/list.
- Evidências:
  - `src/hooks/plans/usePlansList.ts:75`
  - `src/hooks/clients/useClientsList.ts:30`
  - `src/hooks/subscriptions/useSubscriptionsList.ts:80`

### Skill 13 — Testing

- Status: **Aderente**
- Evidência: `npm test` verde (32 arquivos, 55 testes).
- Ressalva: assertion TS proibida em teste.
- Evidência:
  - `src/test/hooks/useCommandPaletteView.test.tsx:57`

### Skill 14 — Refactor Clean Code

- Status: **Parcial**
- Gap: dívida estrutural e mistura de padrões impede compliance pleno.

### Skill 15 — SDD

- Status: **Parcial**
- Aderência: template de spec existe.
- Gap: não há comprovação de spec formal para todas features existentes.
- Evidência:
  - `.ai-skills/specs/templates/feature-spec-template.md`

### Skill 16 — Accessibility

- Status: **Parcial**
- Aderência: presença de atributos acessíveis em parte da base.
- Gap: sem prova uniforme de cobertura total de foco/teclado/modais em toda codebase.

### Skill 17 — UI Normalization

- Status: **Parcial**
- Aderência: utilitários de parse/format/mask existem.
- Gap: estrutura não segue namespaces esperados `shared/*` no padrão alvo.

### Skill 18 — i18n Error Message

- Status: **Não aderente**
- Não aderências:
  - centralização de mensagens não no layout esperado.
  - presença de texto corrompido.
  - uso de `as const` em contextos de texto.
- Evidências:
  - `src/pages/platform/plans/PlanDetailsPage.tsx:37`
  - `src/pages/platform/subscriptions/SubscriptionEditPage.tsx:23`

### Skill 19 — Context Management

- Status: **Aderente (processual)**
- Observação: skill processual; sem violação estrutural objetiva no código para esta auditoria.

### Skill 20 — Lint Config

- Status: **Parcial**
- Aderência: lint verde.
- Não aderência: políticas internas (ex.: `as const`) não estão bloqueadas na prática.

### Skill 21 — Quality Gate

- Status: **Parcial**
- Aderência: `lint`, `typecheck`, `test` passaram.
- Não aderência: regra de compliance textual (encoding) falha.

### Skill 22 — Import Alias

- Status: **Parcial**
- Não aderência:
  - coexistência de alias e imports relativos profundos em partes da base.
  - uso de `as` em import entra em conflito com regra TS declarada.

### Skill 23 — Screen States

- Status: **Parcial**
- Aderência: loading/error/empty evidentes em várias pages.
- Gap: cobertura explícita de todos estados mandatórios não está uniforme em toda page aplicável.

### Skill 24 — Structure Hygiene

- Status: **Parcial**
- Gap: macroestrutura fora do padrão alvo da skill.

### Skill 25 — PT-BR Text Quality

- Status: **Não aderente**
- Evidências críticas:
  - `src/pages/platform/subscriptions/SubscriptionEditPage.tsx:23`
  - `src/pages/platform/plans/PlanEditPage.tsx:31`
  - `src/pages/platform/plans/PlanDetailsPage.tsx:37`
- Impacto: quebra direta de qualidade textual na UI.

### Skill 26 — Automated Compliance

- Status: **Parcial**
- Aderência: parte automática verde (`lint/typecheck/test`).
- Não aderência: regras de compliance textual e proibições TS não garantidas por gate final atual.

## 4. Inventário Global de Violações (Consolidado)

### 4.1 Arquitetura / Estrutura

- Estrutura mandatória não adotada como backbone.
- Organização atual é funcional, porém divergente do contrato arquitetural formal.

### 4.2 TypeScript proibido

- `as const` em produção.
- alias `as` em import e assertions em testes.

### 4.3 i18n / PT-BR / Encoding

- Ocorrências de `�` em labels e mensagens de páginas críticas.
- Centralização de i18n/erros fora da estrutura alvo definida nas skills.

### 4.4 Design System / Estilo

- Valores visuais hardcoded fora de token semântico único em alguns módulos.

### 4.5 Boundaries de Page/Component

- Páginas ainda com MUI cru em campos/botões/tipografia quando política prefere wrapper.

### 4.6 Estados de Tela

- Cobertura parcial para loading/error/empty.
- Não há evidência uniforme para `unauthorized/forbidden/submitting/disabled/modal/snackbar` em toda page aplicável.

### 4.7 Testes / Quality Gate / Compliance

- Testes robustos e verdes.
- Gate de compliance completo não atendido por falhas textuais e regras TS internas.

## 5. Conformidades Confirmadas

- `npm run lint`: **verde**.
- `npm run typecheck`: **verde**.
- `npm test -- --run`: **verde**.
- Base de hooks/services/componentes existe e sustenta boa parte dos fluxos.
- Existe cobertura de testes relevante (hooks, components, services, errors, utils).

## 6. Plano de Remediação Priorizado

### Crítico

1. Corrigir todas as ocorrências de encoding corrompido (`�`) em UI e mensagens.
2. Remover `as const` e padrões proibidos de TS do código de produção e testes.
3. Definir roadmap de migração arquitetural para estrutura `app/shared/features`.

### Alto

4. Eliminar MUI cru em pages onde já houver wrapper compartilhado.
5. Centralizar textos, erros e enums em i18n PT-BR conforme padrão.

### Médio

6. Consolidar tokens e remover hardcoded visual pontual.
7. Uniformizar cobertura de screen states mandatórios por page.
8. Padronizar estratégia de imports/aliases.

### Baixo

9. Harmonizar nomenclatura e organização residual.
10. Atualizar docs de decisão para refletir estado real + plano de convergência.

## 7. Apêndice de Evidências

### 7.1 Ocorrências TS proibidas / conflitantes

- `src/components/layout/admin-navigation/SidebarContent.tsx:82`
- `src/components/common/onboarding/TenantStep.tsx:14`
- `src/components/common/onboarding/TenantStep.tsx:16`
- `src/components/common/onboarding/TenantStep.tsx:18`
- `src/pages/client/auth/ForgotPasswordPage.tsx:16`
- `src/pages/client/auth/ResetPasswordPage.tsx:20`
- `src/pages/platform/auth/PlatformAuthPageLayout.tsx:30`
- `src/pages/platform/auth/PlatformAuthPageLayout.tsx:48`
- `src/components/common/details/ContextualDetailsDrawer.tsx:16`
- `src/forms/useForm.ts:2`
- `src/components/common/details/EntityDetailsDrawer.tsx:24`
- `src/test/hooks/useCommandPaletteView.test.tsx:57`

### 7.2 Ocorrências de encoding corrompido

- `src/pages/platform/subscriptions/SubscriptionEditPage.tsx:23`
- `src/pages/platform/subscriptions/SubscriptionEditPage.tsx:68`
- `src/pages/platform/subscriptions/SubscriptionCreatePage.tsx:57`
- `src/pages/platform/plans/PlanEditPage.tsx:31`
- `src/pages/platform/plans/PlanEditPage.tsx:36`
- `src/pages/platform/plans/PlanDetailsPage.tsx:37`
- `src/pages/platform/plans/PlanDetailsPage.tsx:38`
- `src/pages/platform/plans/PlanCreatePage.tsx:31`
- `src/pages/platform/plans/PlanCreatePage.tsx:36`

### 7.3 Hardcoded visual relevante

- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx:126`
- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx:135`
- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx:144`
- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx:153`
- `src/components/common/data/ListFilters.tsx:234`
- `src/components/common/data/ListFilters.tsx:330`
- `src/components/common/details/ContextualDetailsDrawer.tsx:72`
- `src/components/common/details/ContextualDetailsDrawer.tsx:73`

### 7.4 Resultado do quality gate observado

- `lint`: passou
- `typecheck`: passou
- `test`: passou
- varredura de encoding/compliance textual: **falhou** (evidências acima)

---

## Conclusão Técnica

A base está funcional e com boa cobertura de testes, mas o nível de compliance com o AGENTS/skills ainda é **parcial** devido a divergências críticas de arquitetura-alvo, regras TS proibidas e qualidade textual PT-BR (encoding). O caminho de convergência é claro e priorizável pelos blocos críticos listados neste inventário.

## 8. Auditoria Estrutural Profunda (arquivo-a-arquivo por grupo)

### 8.1 Diagnóstico macro da organização atual

- A base está organizada por tipo técnico (`components`, `hooks`, `services`, `pages`) e não por domínio/feature como padrão-alvo.
- Isso explica a percepção de “vários e vários arquivos não organizados”: o padrão atual funciona, mas conflita com o contrato arquitetural do projeto.

### 8.2 Hooks e ViewModels (análise semântica)

#### Inventário de hooks com `ViewModel` detectados

- `src/hooks/platform-auth/usePlatformMfaPageViewModel.ts`
- `src/hooks/platform-auth/usePlatformLoginPageViewModel.ts`
- `src/hooks/plans/usePlansListPageViewModel.tsx`
- `src/hooks/subscriptions/useSubscriptionDetailsPageViewModel.ts`
- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx`
- `src/hooks/clients/useClientDetailsPageViewModel.tsx`
- `src/hooks/clients/useClientOnboardingPageViewModel.tsx`
- `src/hooks/client-auth/useClientHomePageViewModel.tsx`
- `src/hooks/client-auth/useClientLoginPageViewModel.ts`
- `src/hooks/clients/useClientsListPageViewModel.tsx`

#### Resposta objetiva: `viewModel` é necessário?

**Curto:** não é obrigatório por si só. É útil quando realmente reduz complexidade da page, mas aqui parece haver **uso excessivo e sobreposição** com `use*Page`, `use*ListPage`, `use*ListPageView`.

#### Critério técnico para decidir manter/remover

- **Manter ViewModel** quando:
  - agrega múltiplos hooks/services em um contrato único para a page;
  - encapsula mapeamentos de UI (labels, actions, states combinados) que seriam ruído na page;
  - reduz duplicação entre páginas irmãs.
- **Remover ViewModel** quando:
  - só repassa retorno de outro hook sem transformação relevante;
  - duplica responsabilidade de `use*Page`/`use*ListPage`;
  - cria camada adicional sem ganho de legibilidade.

#### Diagnóstico atual do projeto

- Há sinais de redundância por nomenclatura e camadas concorrentes:
  - `useClientsListPage.ts`
  - `useClientsListPageView.ts`
  - `useClientsListPageViewModel.tsx`
- Esse trio sugere sobreposição e necessidade de consolidação.

#### Recomendação

- Padronizar para **um único padrão por page**:
  - Opção A: `use<Page>NameController` (ou `use<Page>NameViewModel`) único.
  - Opção B: `use<Page>Name` único.
- Evitar coexistência de `Page`, `PageView`, `PageViewModel` para o mesmo fluxo.

### 8.3 Componentes “não ok” (organização)

- Problema principal não é quantidade de componentes, e sim a distribuição fora da arquitetura-alvo e fronteiras inconsistentes entre shared/domain.
- Exemplo de mistura: componentes de domínio (`clients`) convivendo com componentes “common” sem eixo `features/*` claro.

### 8.4 Conclusão complementar

Sua observação procede: a auditoria anterior não tinha profundidade semântica suficiente sobre organização interna de hooks/components. Com esta revisão, o principal gap fica claro: **excesso de variações de hook de page/viewmodel e organização técnica em vez de organização por domínio**.

## 9. Relatório Exaustivo de Refatoração (Arquitetura, Redundância, Generalização)

### 9.1 Hierarquia definida vs estado atual

#### Hierarquia definida (target)

- `app`: composição global (providers/router/guards/theme/store).
- `shared`: componentes/hook/services utilitários reutilizáveis.
- `features`: domínio encapsulado (componentes/pages/hooks/services/schemas/types/normalizers).
- `pages`: orquestração.

#### Estado atual (real)

- Estrutura por tipo técnico (`components`, `hooks`, `services`, `pages`, `models`, `forms`, `utils`) sem eixo claro por feature.
- Resultado: responsabilidades espalhadas e fronteira shared/domain pouco explícita.

#### Diagnóstico

- Funciona, mas não cumpre o contrato arquitetural exigido em AGENTS/skills.
- Dificulta rastrear ownership por domínio e aumenta redundância.

### 9.2 Redundâncias e sobreposição (hooks)

#### Padrão observado

Existem fluxos com múltiplos hooks para a mesma tela:

- `useClientsListPage.ts`
- `useClientsListPageView.ts`
- `useClientsListPageViewModel.tsx`

E padrão semelhante em outros domínios (plans/subscriptions/auth).

#### Problema

- Camadas semânticas sobrepostas.
- Custo cognitivo alto e risco de drift entre contratos.

#### Refatoração recomendada

1. Escolher **um padrão único por page**:
   - `use<Feature><Page>ViewModel` **ou** `use<Feature><Page>`.
2. Proibir coexistência de `Page` + `PageView` + `PageViewModel` para o mesmo fluxo.
3. Definir convenção:
   - hook de data/query: `use<Domain><Entity>List`, `use<Domain><Entity>Details`.
   - hook de page orchestration: somente um (`use...PageModel` por exemplo).

### 9.3 Redundâncias e generalização (componentes de informação)

#### Componentes correlatos identificados

- `InfoList`
- `InfoItem`
- `KeyValueGrid`
- `DetailsInfoCards`
- `EntityDetailsDrawer` (usa `InfoItem`)

#### Problema

Há múltiplos padrões para mesma necessidade (label/valor), com semântica e comportamento responsivo diferentes.

#### Recomendação de unificação

Criar componente base único de exibição de pares chave/valor e especializações:

1. `AppInfoField` (átomo): label + valor + regras de quebra/ellipsis.
2. `AppInfoList` (lista vertical responsiva).
3. `AppInfoGrid` (grid responsivo para cartões/detalhes).
4. `DetailsInfoCards` passa a compor `AppInfoList/AppInfoGrid` e deixa de ter layout próprio de item.

### 9.4 Componente de info que quebra layout (causa raiz + correção)

#### Evidência principal

- Arquivo: `src/components/common/display/InfoList.tsx`

#### Causa técnica

- Cada item é renderizado com `Stack direction="row"`.
- Em linha fixa, labels/valores longos competem por largura.
- Não há regra robusta de wrap/truncation no valor (`wordBreak/overflowWrap/flex-basis/min-width`), diferente de `InfoItem`/`KeyValueGrid` que já mitigam melhor.
- Em `PlanDetailsPage`, o `InfoList` recebe strings potencialmente longas (descrição/preço formatado), amplificando o problema.

#### Correção recomendada (sem alterar agora, apenas diretriz)

1. Alterar estrutura de `InfoList` para layout com duas colunas responsivas (Grid ou Stack com wrap controlado).
2. Aplicar `minWidth: 0` no container de valor + `overflowWrap: 'anywhere'`.
3. Definir comportamento por breakpoint:
   - mobile: label em cima, valor abaixo.
   - desktop: label/valor em linha com colunas estáveis.
4. Unificar com `InfoItem` para evitar divergência de comportamento.

### 9.5 Sugestão de consolidação de componentes (lista prática)

#### Candidatos a unificação

- `InfoList` + `InfoItem` + `KeyValueGrid` -> família `AppInfo*`.
- `ErrorState` + `AppSnackbarErrorContent` + `errors/*` -> contrato único de mensagem amigável com níveis de exibição.
- `DataList` + `DataTable` + `QueryDataTable` -> base tabular única com adapters.

#### Candidatos a manutenção separada

- `OnboardingSummary` (domínio específico de onboarding).
- `EntityDetailsDrawer` (comportamento de overlay/drawer específico).

### 9.6 Plano de refatoração recomendado (ordem)

1. Definir convenção oficial de hooks de page (um padrão).
2. Refatorar fluxo clients como piloto (onde há mais sobreposição).
3. Criar família `AppInfo*` e migrar `PlanDetailsPage`, `SubscriptionDetailsPage`, `EntityDetailsDrawer`.
4. Reorganizar estrutura para target (`app/shared/features`) por fatias de domínio.
5. Reforçar quality gate com verificações de arquitetura e regras TS proibidas.

### 9.7 Resposta objetiva à pergunta “viewModel é necessário?”

- **Não é obrigatório**.
- **É recomendado apenas quando agrega composição real** (estado + ações + transformação de dados da tela).
- **No estado atual, há excesso de camadas `view/viewmodel/page` concorrentes**; simplificar trará ganho imediato de clareza e manutenção.

## 10. Revisão Total de `src/**` com foco em responsabilidade de Hook

### 10.1 Pergunta central validada

Você está certo: há hooks com lógica de renderização de tela, e isso **quebra a hierarquia esperada** (hook de comportamento vs componente/page de render).

### 10.2 Achados exaustivos (hooks com render/UI)

#### Grupo A — Hook retornando JSX diretamente (violação alta)

- `src/hooks/client-auth/useClientHomePageViewModel.tsx`
  - monta `content` com `<Stack>`, `<Typography>`, `<Alert>`, `<CircularProgress>`.
  - problema: hook vira mini-componente.

#### Grupo B — Hook de ViewModel com config de render fortemente acoplada (violação média/alta)

- `src/hooks/clients/useClientsListPageViewModel.tsx`
- `src/hooks/plans/usePlansListPageViewModel.tsx`
- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx`
- `src/hooks/clients/useClientDetailsPageViewModel.tsx`
- `src/hooks/clients/useClientDetailsDrawerSchema.tsx`
- `src/hooks/clients/useClientOnboardingPageViewModel.tsx`
  - problema: contém JSX, ícones, tipografia, estrutura visual de linhas/cartões dentro do hook.
  - efeito: dificulta teste, reuso e manutenção de layout.

#### Grupo C — Hooks de provider/render (aceitável por exceção arquitetural)

- `src/hooks/useAuth/useAuth.tsx`
- `src/hooks/useColorMode/useColorMode.tsx`
- `src/hooks/useError/useError.tsx`
  - observação: esses são provedores/contextos e podem renderizar `Provider`.

### 10.3 Diagnóstico de hierarquia

#### Esperado

- Hook: estado, ações, composição de dados.
- Component/Page: render JSX e layout.

#### Atual

- Em vários domínios, hook também monta UI.
- Padrão misto: `use*Page`, `use*PageView`, `use*PageViewModel` coexistindo.

#### Conclusão

- O projeto **não está seguindo plenamente** a hierarquia definida para separação de responsabilidades.

### 10.4 Refatoração sugerida (objetiva)

#### Regra proposta

- Hook **não** retorna `ReactNode`/JSX de layout de tela.
- Hook retorna somente:
  - `state`
  - `actions`
  - `derivedData` (valores prontos, sem JSX)
- Componentes recebem dados e renderizam.

#### Estratégia por etapas

1. Criar convenção única: `use<Dominio><Tela>Model` (ou `use<Dominio><Tela>`), sem `PageView` paralelo.
2. Migrar primeiro os 3 list view models (`clients/plans/subscriptions`):
   - extrair `renderDetails`, `renderAvatar`, `renderStatus`, `renderActions` para componentes puros em `components/common/data` ou `features/*/components`.
3. Migrar `useClientHomePageViewModel.tsx`:
   - retornar somente `{ loading, errorMessage, profile, messages }`.
   - page/componente decide loading/error/success render.
4. Revisar `useClientDetailsDrawerSchema.tsx`:
   - separar schema de dados de schema visual.
5. Depois da migração, remover hooks redundantes (`use*PageView`, `use*Page` duplicado).

### 10.5 Sobre o componente de info que quebra layout (confirmação)

- Causa raiz confirmada no `InfoList`:
  - linha fixa horizontal sem contrato responsivo robusto.
- Agravante:
  - view models montam blocos de detalhe com stacks horizontais semelhantes, repetindo risco em vários pontos.
- Correção estrutural:
  - componente base de info responsivo único + remoção de layout duplicado em hooks.

### 10.6 Inventário de prioridade (componente/hook)

#### Crítico

- `src/hooks/client-auth/useClientHomePageViewModel.tsx`
- `src/components/common/display/InfoList.tsx`

#### Alto

- `src/hooks/clients/useClientsListPageViewModel.tsx`
- `src/hooks/plans/usePlansListPageViewModel.tsx`
- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx`
- `src/hooks/clients/useClientDetailsDrawerSchema.tsx`

#### Médio

- Padronização da família `use*Page` vs `use*ViewModel` no restante dos módulos.

## 11. Investigação Exaustiva de Inconsistência de Layout (Clientes vs Planos)

### 11.1 Resultado objetivo

A inconsistência visual entre `/platform/clients` e `/platform/plans` é **real** e **não deveria acontecer** em um layout padronizado.

### 11.2 Causa raiz (com evidência de código)

#### Diferença estrutural de composição de página

- `ClientsListPage` está envolvida por `ContextualDetailsDrawer`:
  - `src/pages/platform/clients/ClientsListPage.tsx`
  - `src/components/common/details/ContextualDetailsDrawer.tsx`
- `PlansListPage` não usa esse wrapper:
  - `src/pages/platform/plans/PlansListPage.tsx`

#### Impacto do wrapper no ritmo/altura visual

`ContextualDetailsDrawer` aplica:

- `Stack spacing={2.5}` envolvendo todo conteúdo da página.
- overlay absoluto com offsets negativos (`top/right/bottom/left`), controlado por `data-open`.

Esse wrapper muda o espaçamento vertical padrão da página de clientes, criando diferença comparado à página de planos.

#### Diferença adicional de blocos no topo

- Clientes possui bloco extra de cards de resumo (`EntitySummaryCards`) entre header e filtros.
- Planos não possui esse bloco.

Resultado: alturas visuais e cadência vertical diferentes.

### 11.3 Papel do componente de info nessa inconsistência

- O componente de info (`InfoList`) tem problema próprio de responsividade/wrap.
- Porém, **neste caso específico de diferença entre telas**, o fator principal é a composição estrutural (wrapper + blocos extras), não apenas `InfoList`.

### 11.4 Falha de padronização de layout global

#### Padrão base existe no AppLayout

- `src/components/layout/admin-navigation/AppLayout.tsx` define:
  - topbar fixa,
  - sidebar,
  - `main` com `pt`/`px`/`pb` padrão.

#### Quebra do padrão acontece dentro das páginas

- páginas aplicam wrappers diferentes sem um contrato único de seção (`PageShell`/`PageSection`).
- resultado: componentes de feature passam a interferir na percepção de spacing global (topbar/sidebar/content flow).

### 11.5 Diretriz de correção (sem alteração de UI)

#### Objetivo

Manter a UI visual atual, mas impedir que componentes de feature alterem o comportamento de layout global.

#### Regras propostas

1. Criar um container de página único (ex.: `AppPageLayout`) para todas as pages do domínio admin.
2. Mover espaçamentos verticais para esse container único.
3. `ContextualDetailsDrawer` não deve controlar o spacing do conteúdo da página:
   - remover responsabilidade de gap global (`Stack spacing`) dele;
   - manter apenas camada contextual (overlay/drawer).
4. `InfoList` e família de info não devem impor espaçamentos que influenciem fluxo macro da page.
5. Toda page deve seguir sequência padrão de blocos:
   - Header
   - (opcional) Summary
   - Filters
   - Table/List
   - Actions/Dialogs
     com espaçamento vindo do layout base, não do componente funcional.

### 11.6 Checklist de verificação para evitar regressão

- Mesmo `padding-top` útil abaixo da topbar em todas as pages.
- Mesmo `gap` vertical entre seções equivalentes.
- Componente de details/contextual não altera altura quando fechado.
- Componente de info não força overflow nem altera cadência vertical macro.
- Comparação visual entre `/platform/clients` e `/platform/plans` com o mesmo contrato de seção.

### 11.7 Conclusão específica deste caso

Sua hipótese está correta em essência: há interferência de camada de componente no layout da página. A correção robusta é padronizar o layout de página e reduzir o poder de wrappers/contextuais sobre spacing global.

## 12. Matriz de Cobertura Total da Codebase (src/\*\*)

Cobertura declarada: **273 arquivos de src mapeados**.

### 12.1 Critérios de classificação

- Manter: arquivo aderente ao papel atual.
- Refatorar: manter função, ajustar responsabilidade/arquitetura.
- Unificar: convergir com outro componente/hook redundante.
- Candidato a remoção: provável duplicação após unificação.

### 12.2 Arquivos prioritários com ação direta

### 12.3 Cobertura completa por diretório (todos os arquivos)

- **src**
  - [Manter] src\App.css
  - [Manter] src\App.tsx
  - [Manter] src\index.css
  - [Manter] src\main.tsx
  - [Manter] src\vite-env.d.ts
- **src\assets**
  - [Manter] src\assets\hero.png
  - [Manter] src\assets\react.svg
  - [Manter] src\assets\vite.svg
- **src\components\address**
  - [Manter] src\components\address\AddressFields.tsx
- **src\components\auth**
  - [Manter] src\components\auth\LoginContainer.tsx
  - [Manter] src\components\auth\LoginForm.tsx
- **src\components\auth\client**
  - [Manter] src\components\auth\client\ClientLoginFormCard.tsx
- **src\components\auth\platform**
  - [Manter] src\components\auth\platform\PlatformLoginForm.tsx
  - [Manter] src\components\auth\platform\PlatformLoginFormCard.tsx
  - [Manter] src\components\auth\platform\PlatformMfaForm.tsx
  - [Manter] src\components\auth\platform\PlatformMfaSetupForm.tsx
- **src\components\clients**
  - [Manter] src\components\clients\ClientForm.tsx
- **src\components\common**
  - [Manter] src\components\common\messages.ts
- **src\components\common\access**
  - [Manter] src\components\common\access\DomainProtectedRoute.tsx
  - [Manter] src\components\common\access\PermissionGate.tsx
  - [Manter] src\components\common\access\ProtectedRoute.tsx
- **src\components\common\actions**
  - [Manter] src\components\common\actions\ActionButtons.tsx
- **src\components\common\data**
  - [Manter] src\components\common\data\dataList.constants.ts
  - [Unificar] src\components\common\data\DataList.tsx
  - [Manter] src\components\common\data\dataList.types.ts
  - [Unificar] src\components\common\data\DataTable.tsx
  - [Manter] src\components\common\data\EntitySearchFilter.tsx
  - [Manter] src\components\common\data\FilterDrawer.tsx
  - [Manter] src\components\common\data\ListFilters.tsx
  - [Manter] src\components\common\data\listFilters.types.ts
  - [Manter] src\components\common\data\listFilters.utils.ts
  - [Manter] src\components\common\data\ListMetricsGrid.tsx
  - [Unificar] src\components\common\data\QueryDataTable.tsx
  - [Manter] src\components\common\data\RowActionsMenu.tsx
  - [Manter] src\components\common\data\SearchBar.tsx
  - [Manter] src\components\common\data\SelectFilterField.tsx
- **src\components\common\date**
  - [Manter] src\components\common\date\AppDatePicker.tsx
- **src\components\common\details**
  - [Refatorar] src\components\common\details\ContextualDetailsDrawer.tsx
  - [Manter] src\components\common\details\DetailsSection.tsx
  - [Manter] src\components\common\details\EntityDetailsDrawer.tsx
  - [Unificar] src\components\common\details\InfoItem.tsx
- **src\components\common\display**
  - [Unificar] src\components\common\display\DetailsInfoCards.tsx
  - [Manter] src\components\common\display\EntitySummaryCards.tsx
  - [Unificar] src\components\common\display\InfoList.tsx
  - [Unificar] src\components\common\display\KeyValueGrid.tsx
  - [Manter] src\components\common\display\LocalizedStatusBadge.tsx
  - [Manter] src\components\common\display\MetricCard.tsx
  - [Manter] src\components\common\display\StatusChip.tsx
- **src\components\common\feedback**
  - [Manter] src\components\common\feedback\AppSnackbar.tsx
  - [Manter] src\components\common\feedback\AppSnackbarErrorContent.tsx
  - [Manter] src\components\common\feedback\ConfirmDialog.tsx
  - [Manter] src\components\common\feedback\ListDialog.tsx
  - [Manter] src\components\common\feedback\SessionExpiredDialog.tsx
- **src\components\common\form**
  - [Manter] src\components\common\form\AppAutocomplete.tsx
  - [Manter] src\components\common\form\AppForm.tsx
  - [Manter] src\components\common\form\DateRangePicker.tsx
  - [Manter] src\components\common\form\FormActions.tsx
  - [Manter] src\components\common\form\FormTextField.tsx
  - [Manter] src\components\common\form\TotpCodeBoxes.tsx
- **src\components\common\loading**
  - [Manter] src\components\common\loading\CircularLoader.tsx
  - [Manter] src\components\common\loading\SkeletonLoader.tsx
- **src\components\common\modal**
  - [Manter] src\components\common\modal\BaseModal.tsx
- **src\components\common\navigation**
  - [Manter] src\components\common\navigation\AppTabs.tsx
  - [Manter] src\components\common\navigation\StepperWizard.tsx
- **src\components\common\onboarding**
  - [Manter] src\components\common\onboarding\AdminStep.tsx
  - [Manter] src\components\common\onboarding\ClientDataStep.tsx
  - [Manter] src\components\common\onboarding\OnboardingSummary.tsx
  - [Manter] src\components\common\onboarding\PlanStep.tsx
  - [Manter] src\components\common\onboarding\TenantStep.tsx
  - [Manter] src\components\common\onboarding\types.ts
- **src\components\common\overlay**
  - [Manter] src\components\common\overlay\AppPopoverMenu.tsx
  - [Manter] src\components\common\overlay\AppTooltip.tsx
- **src\components\common\page**
  - [Manter] src\components\common\page\PageHeader.tsx
  - [Manter] src\components\common\page\PageIntroHeader.tsx
  - [Manter] src\components\common\page\SectionCard.tsx
- **src\components\common\state**
  - [Manter] src\components\common\state\EmptyState.tsx
  - [Manter] src\components\common\state\ErrorState.tsx
- **src\components\common\upload**
  - [Manter] src\components\common\upload\AvatarUploader.tsx
  - [Manter] src\components\common\upload\FileUpload.tsx
- **src\components\layout\admin-navigation**
  - [Manter] src\components\layout\admin-navigation\AppLayout.tsx
  - [Manter] src\components\layout\admin-navigation\CommandPalette.tsx
  - [Manter] src\components\layout\admin-navigation\config.tsx
  - [Manter] src\components\layout\admin-navigation\messages.ts
  - [Manter] src\components\layout\admin-navigation\navigationBuilder.ts
  - [Manter] src\components\layout\admin-navigation\NotificationsMenu.tsx
  - [Manter] src\components\layout\admin-navigation\permissions.ts
  - [Manter] src\components\layout\admin-navigation\ProfileMenu.tsx
  - [Manter] src\components\layout\admin-navigation\SessionTimer.tsx
  - [Manter] src\components\layout\admin-navigation\SidebarContent.tsx
  - [Manter] src\components\layout\admin-navigation\TopBar.tsx
- **src\components\layout\admin-navigation\navigationGroups**
  - [Manter] src\components\layout\admin-navigation\navigationGroups\clientNavigationGroups.ts
  - [Manter] src\components\layout\admin-navigation\navigationGroups\platformNavigationGroups.ts
- **src\errors**
  - [Manter] src\errors\ErrorBoundary.tsx
  - [Manter] src\errors\errorCodeMessages.ts
  - [Manter] src\errors\ErrorHandler.ts
  - [Manter] src\errors\errorMessageTranslations.ts
  - [Manter] src\errors\ModalError.tsx
  - [Manter] src\errors\SnackbarError.tsx
- **src\forms**
  - [Manter] src\forms\clientsSchemas.ts
  - [Manter] src\forms\plansSchemas.ts
  - [Manter] src\forms\subscriptionsSchemas.ts
  - [Manter] src\forms\useForm.ts
  - [Manter] src\forms\validators.ts
- **src\forms\schemas**
  - [Manter] src\forms\schemas\addressSchema.ts
  - [Manter] src\forms\schemas\enums.ts
  - [Manter] src\forms\schemas\personSchema.ts
- **src\hooks**
  - [Manter] src\hooks\useAppLayoutSessionGate.ts
  - [Manter] src\hooks\useAppLayoutState.ts
  - [Manter] src\hooks\useClickOutside.ts
  - [Manter] src\hooks\useCommandPalette.ts
  - [Manter] src\hooks\useCommandPaletteView.ts
  - [Manter] src\hooks\useDensityPreference.ts
  - [Manter] src\hooks\useMediaQuery.ts
  - [Manter] src\hooks\useSessionTimer.ts
  - [Manter] src\hooks\useSidebarContentState.ts
  - [Manter] src\hooks\useSidebarNavigation.ts
  - [Manter] src\hooks\useSidebarState.ts
  - [Manter] src\hooks\useThemePreference.ts
- **src\hooks\client-auth**
  - [Manter] src\hooks\client-auth\useClientHomeData.ts
  - [Refatorar] src\hooks\client-auth\useClientHomePageViewModel.tsx
  - [Manter] src\hooks\client-auth\useClientLoginFlow.ts
  - [Manter] src\hooks\client-auth\useClientLoginPageViewModel.ts
  - [Manter] src\hooks\client-auth\useClientLogout.ts
  - [Manter] src\hooks\client-auth\useClientProfile.ts
  - [Manter] src\hooks\client-auth\useForgotPasswordState.ts
  - [Manter] src\hooks\client-auth\useResetPasswordFlow.ts
- **src\hooks\clients**
  - [Manter] src\hooks\clients\useClientCreatePage.ts
  - [Manter] src\hooks\clients\useClientDetails.ts
  - [Manter] src\hooks\clients\useClientDetailsDrawerSchema.tsx
  - [Refatorar] src\hooks\clients\useClientDetailsPageViewModel.tsx
  - [Manter] src\hooks\clients\useClientEditPage.ts
  - [Manter] src\hooks\clients\useClientOnboardingForm.ts
  - [Refatorar] src\hooks\clients\useClientOnboardingPageViewModel.tsx
  - [Manter] src\hooks\clients\useClientsList.ts
  - [Manter] src\hooks\clients\useClientsListFilters.ts
  - [Manter] src\hooks\clients\useClientsListPage.ts
  - [Refatorar] src\hooks\clients\useClientsListPageView.ts
  - [Refatorar] src\hooks\clients\useClientsListPageViewModel.tsx
  - [Manter] src\hooks\clients\useClientsMutations.ts
- **src\hooks\plans**
  - [Manter] src\hooks\plans\usePlanCreatePage.ts
  - [Manter] src\hooks\plans\usePlanDetails.ts
  - [Manter] src\hooks\plans\usePlanEditPage.ts
  - [Manter] src\hooks\plans\usePlansList.ts
  - [Manter] src\hooks\plans\usePlansListPage.ts
  - [Refatorar] src\hooks\plans\usePlansListPageViewModel.tsx
  - [Manter] src\hooks\plans\usePlansMutations.ts
- **src\hooks\platform-auth**
  - [Manter] src\hooks\platform-auth\usePlatformLoginFlow.ts
  - [Manter] src\hooks\platform-auth\usePlatformLoginPageViewModel.ts
  - [Manter] src\hooks\platform-auth\usePlatformMfaFlow.ts
  - [Manter] src\hooks\platform-auth\usePlatformMfaPageViewModel.ts
  - [Manter] src\hooks\platform-auth\usePlatformMfaSetupFlow.ts
  - [Manter] src\hooks\platform-auth\usePlatformProfile.ts
- **src\hooks\subscriptions**
  - [Manter] src\hooks\subscriptions\useSubscriptionCreatePage.ts
  - [Manter] src\hooks\subscriptions\useSubscriptionDetails.ts
  - [Manter] src\hooks\subscriptions\useSubscriptionDetailsPageViewModel.ts
  - [Manter] src\hooks\subscriptions\useSubscriptionEditPage.ts
  - [Manter] src\hooks\subscriptions\useSubscriptionsList.ts
  - [Manter] src\hooks\subscriptions\useSubscriptionsListPage.ts
  - [Refatorar] src\hooks\subscriptions\useSubscriptionsListViewModel.tsx
  - [Manter] src\hooks\subscriptions\useSubscriptionsMutations.ts
- **src\hooks\useAddressAutoFill**
  - [Manter] src\hooks\useAddressAutoFill\useAddressAutoFill.ts
- **src\hooks\useAsync**
  - [Manter] src\hooks\useAsync\useAsync.ts
- **src\hooks\useAuth**
  - [Manter] src\hooks\useAuth\useAuth.tsx
- **src\hooks\useColorMode**
  - [Manter] src\hooks\useColorMode\useColorMode.tsx
- **src\hooks\useDebounce**
  - [Manter] src\hooks\useDebounce\useDebounce.ts
  - [Manter] src\hooks\useDebounce\useDebouncedCallback.ts
- **src\hooks\useError**
  - [Manter] src\hooks\useError\useError.tsx
- **src\models**
  - [Manter] src\models\address.ts
  - [Manter] src\models\adminNavigationStorage.ts
  - [Manter] src\models\clients.ts
  - [Manter] src\models\density.ts
  - [Manter] src\models\detailsDrawer.ts
  - [Manter] src\models\navigation.ts
  - [Manter] src\models\pagination.ts
  - [Manter] src\models\plans.ts
  - [Manter] src\models\subscriptions.ts
  - [Manter] src\models\subscriptionStatusLabels.ts
  - [Manter] src\models\themeMode.ts
  - [Manter] src\models\types.ts
- **src\models\auth**
  - [Manter] src\models\auth\auth.ts
  - [Manter] src\models\auth\guards.ts
- **src\pages**
  - [Manter] src\pages\DashboardPage.tsx
  - [Manter] src\pages\LoginPage.tsx
- **src\pages\client\auth**
  - [Manter] src\pages\client\auth\ForgotPasswordPage.tsx
  - [Manter] src\pages\client\auth\LoginPage.tsx
  - [Manter] src\pages\client\auth\ResetPasswordPage.tsx
- **src\pages\client\dashboard**
  - [Manter] src\pages\client\dashboard\DashboardPage.tsx
- **src\pages\client\home**
  - [Manter] src\pages\client\home\HomePage.tsx
- **src\pages\platform\auth**
  - [Manter] src\pages\platform\auth\LoginPage.tsx
  - [Manter] src\pages\platform\auth\MfaPage.tsx
  - [Manter] src\pages\platform\auth\MfaSetupPage.tsx
  - [Manter] src\pages\platform\auth\PlatformAuthPageLayout.tsx
- **src\pages\platform\clients**
  - [Manter] src\pages\platform\clients\ClientCreatePage.tsx
  - [Manter] src\pages\platform\clients\ClientDetailsPage.tsx
  - [Manter] src\pages\platform\clients\ClientEditPage.tsx
  - [Manter] src\pages\platform\clients\ClientOnboardingPage.tsx
  - [Manter] src\pages\platform\clients\ClientsListPage.tsx
- **src\pages\platform\dashboard**
  - [Manter] src\pages\platform\dashboard\DashboardPage.tsx
- **src\pages\platform\home**
  - [Manter] src\pages\platform\home\HomePage.tsx
- **src\pages\platform\plans**
  - [Manter] src\pages\platform\plans\PlanCreatePage.tsx
  - [Manter] src\pages\platform\plans\PlanDetailsPage.tsx
  - [Manter] src\pages\platform\plans\PlanEditPage.tsx
  - [Manter] src\pages\platform\plans\PlansListPage.tsx
- **src\pages\platform\subscriptions**
  - [Manter] src\pages\platform\subscriptions\SubscriptionCreatePage.tsx
  - [Manter] src\pages\platform\subscriptions\SubscriptionDetailsPage.tsx
  - [Manter] src\pages\platform\subscriptions\SubscriptionEditPage.tsx
  - [Manter] src\pages\platform\subscriptions\SubscriptionsListPage.tsx
- **src\services**
  - [Manter] src\services\addressService.ts
  - [Manter] src\services\httpClient.ts
- **src\services\auth**
  - [Manter] src\services\auth\loginPreferences.ts
- **src\services\client\auth**
  - [Manter] src\services\client\auth\endpoints.ts
  - [Manter] src\services\client\auth\service.ts
  - [Manter] src\services\client\auth\sessionStorage.ts
  - [Manter] src\services\client\auth\types.ts
- **src\services\platform\auth**
  - [Manter] src\services\platform\auth\endpoints.ts
  - [Manter] src\services\platform\auth\service.ts
  - [Manter] src\services\platform\auth\types.ts
- **src\services\platform\clients**
  - [Manter] src\services\platform\clients\endpoints.ts
  - [Manter] src\services\platform\clients\service.ts
  - [Manter] src\services\platform\clients\types.ts
- **src\services\platform\plans**
  - [Manter] src\services\platform\plans\endpoints.ts
  - [Manter] src\services\platform\plans\service.ts
  - [Manter] src\services\platform\plans\types.ts
- **src\services\platform\subscriptions**
  - [Manter] src\services\platform\subscriptions\endpoints.ts
  - [Manter] src\services\platform\subscriptions\service.ts
  - [Manter] src\services\platform\subscriptions\types.ts
- **src\test**
  - [Manter] src\test\setup.ts
- **src\test\components**
  - [Manter] src\test\components\accessComponents.test.tsx
  - [Manter] src\test\components\actionButtons.test.tsx
  - [Manter] src\test\components\appDatePicker.test.tsx
  - [Manter] src\test\components\appTabs.test.tsx
  - [Manter] src\test\components\componentsSmoke.test.tsx
  - [Manter] src\test\components\confirmDialog.test.tsx
  - [Manter] src\test\components\dataTable.test.tsx
  - [Manter] src\test\components\dateRangePicker.test.tsx
  - [Manter] src\test\components\domainProtectedRoute.test.tsx
  - [Manter] src\test\components\listFilters.test.tsx
  - [Manter] src\test\components\queryDataTable.test.tsx
  - [Manter] src\test\components\stateComponents.test.tsx
- **src\test\errors**
  - [Manter] src\test\errors\errorComponents.test.tsx
  - [Manter] src\test\errors\errorHandler.test.ts
- **src\test\hooks**
  - [Manter] src\test\hooks\clientsHooksSmoke.test.ts
  - [Manter] src\test\hooks\hooksSmoke.test.ts
  - [Manter] src\test\hooks\useAddressAutoFill.test.ts
  - [Manter] src\test\hooks\useClientHomeData.test.ts
  - [Manter] src\test\hooks\useClientProfile.test.ts
  - [Manter] src\test\hooks\useClientsListPage.test.ts
  - [Manter] src\test\hooks\useCommandPaletteView.test.tsx
  - [Manter] src\test\hooks\useForgotPasswordState.test.ts
  - [Manter] src\test\hooks\usePlatformProfile.test.ts
  - [Manter] src\test\hooks\useSidebarContentState.test.tsx
  - [Manter] src\test\hooks\useSidebarNavigation.test.ts
  - [Manter] src\test\hooks\useSubscriptionsList.test.ts
- **src\test\models**
  - [Manter] src\test\models\themeMode.test.ts
- **src\test\services**
  - [Manter] src\test\services\addressService.test.ts
  - [Manter] src\test\services\clientAuthService.test.ts
  - [Manter] src\test\services\platformAuthService.test.ts
- **src\test\utils**
  - [Manter] src\test\utils\date.test.ts
  - [Manter] src\test\utils\mask-parse-validation.test.ts
- **src\theme**
  - [Manter] src\theme\breakpoints.ts
  - [Manter] src\theme\fontSizes.ts
  - [Manter] src\theme\palette.ts
  - [Manter] src\theme\spacing.ts
  - [Manter] src\theme\theme.ts
  - [Manter] src\theme\typography.ts
  - [Manter] src\theme\uiColors.ts
- **src\utils**
  - [Manter] src\utils\clientOnboarding.ts
  - [Manter] src\utils\date.ts
  - [Manter] src\utils\formatters.ts
  - [Manter] src\utils\mask.ts
  - [Manter] src\utils\parse.ts
  - [Manter] src\utils\validation.ts
  - [Manter] src\utils\validators.ts

### 12.4 Síntese de unificação/remoção

- Unificar: InfoList, InfoItem, KeyValueGrid, DetailsInfoCards em família AppInfo\*.
- Unificar: use*Page, use*PageView, use\*PageViewModel por fluxo em 1 único hook de orquestração.
- Unificar: DataList, DataTable, QueryDataTable em base comum configurável.
- Candidatos a remoção (após migração): variantes antigas de PageView/PageViewModel duplicadas.
- Refatorar layout: ContextualDetailsDrawer sem controlar spacing macro.

## 13. Profundidade Extra por Skills de Padrão de Projeto

### 13.1 Arquitetura e hierarquia (Skills 00, 01, 24)

- Diagnóstico: organização atual por tipo técnico, não por domínio (`features`) e sem `app/shared/features` como espinha principal.
- Efeito: difícil garantir ownership, aumenta acoplamento e duplicidade.
- Ação: migração incremental por domínio (clients, plans, subscriptions) para estrutura-alvo.

### 13.2 Componentes com lógica além do esperado (Skills 03, 04, 05)

#### Casos com lógica de orquestração/estado muito densa em componente visual

- `src/components/common/onboarding/ClientDataStep.tsx`
- `src/components/common/data/ListFilters.tsx`
- `src/components/common/details/EntityDetailsDrawer.tsx`
- `src/components/layout/admin-navigation/AppLayout.tsx`

#### Leitura técnica

- Esses componentes concentram branching e coordenação que deveria estar mais distribuída em hooks de domínio ou camada de page.
- Em especial, `EntityDetailsDrawer` e `ListFilters` já viraram mini-frameworks internos.

#### Diretriz

- Componentes `common` devem ficar mais declarativos e receber contratos prontos.
- Lógica de montagem de schema de UI/tab/actions deve sair para camada de model/controller (sem JSX no hook).

### 13.3 Hooks com lógica de render (Skills 09, 14)

- Confirmado: hooks com JSX/estrutura de UI.
- Principal violação:
  - `src/hooks/client-auth/useClientHomePageViewModel.tsx` (retorna conteúdo visual pronto)
- Casos de acoplamento visual forte em hook:
  - `src/hooks/clients/useClientsListPageViewModel.tsx`
  - `src/hooks/plans/usePlansListPageViewModel.tsx`
  - `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx`
- Ação: hooks retornam dados/ações; componentes renderizam.

### 13.4 Componentes redundantes e unificação (Skills 04, 06)

#### Família de informação (redundante)

- `InfoList`
- `InfoItem`
- `KeyValueGrid`
- `DetailsInfoCards`

Ação: unificar em família `AppInfo*` com variantes list/grid sem alterar UI final.

#### Família de listagem/tabela (sobreposição)

- `DataList`
- `DataTable`
- `QueryDataTable`

Ação: base única com adapters de apresentação.

### 13.5 Layout padrão entre pages (Skills 03, 06, 23)

- Falha confirmada: pages com wrappers distintos alteram ritmo vertical.
- Caso crítico: clientes usa `ContextualDetailsDrawer` envolvendo toda página, planos não.
- Ação: `AppPageLayout` único com spacing de seções centralizado.

### 13.6 i18n/PT-BR e qualidade textual (Skills 18, 25)

- Persistem ocorrências de encoding corrompido em páginas críticas.
- Ação: etapa obrigatória de saneamento textual + centralização de textos em módulo i18n.

### 13.7 Quality/compliance (Skills 20, 21, 26)

- `lint/typecheck/test` passam, mas políticas de arquitetura e TS interno ainda não estão protegidas por gate real.
- Ação: compliance gate deve bloquear:
  - JSX em hooks de viewmodel/page model;
  - `as const`/assertions proibidas;
  - strings corrompidas;
  - desvios de estrutura por camada.

### 13.8 Conclusão de padrão de projeto

- O problema central não é somente bug pontual; é ausência de contratos rígidos de camada.
- Com a padronização proposta (layout único, hook sem render, unificação de famílias redundantes e estrutura por domínio), o projeto converge para previsibilidade e manutenção sustentável.

## 14. Matriz Exaustiva Arquivo-a-Arquivo (src/\*\*)

Total auditado: **273 arquivos**.
| Arquivo | Tipo | Status | Sinais |
|---|---|---|---|
| src\App.css | other | Manter | |
| src\App.tsx | other | Manter | |
| src\assets\hero.png | other | Crítico | PTBR:encoding |
| src\assets\react.svg | other | Manter | |
| src\assets\vite.svg | other | Manter | |
| src\components\address\AddressFields.tsx | other | Crítico | PTBR:encoding |
| src\components\auth\client\ClientLoginFormCard.tsx | other | Manter | |
| src\components\auth\LoginContainer.tsx | other | Manter | |
| src\components\auth\LoginForm.tsx | other | Manter | |
| src\components\auth\platform\PlatformLoginForm.tsx | other | Crítico | PTBR:encoding |
| src\components\auth\platform\PlatformLoginFormCard.tsx | other | Manter | |
| src\components\auth\platform\PlatformMfaForm.tsx | other | Manter | |
| src\components\auth\platform\PlatformMfaSetupForm.tsx | other | Manter | |
| src\components\clients\ClientForm.tsx | other | Crítico | PTBR:encoding |
| src\components\common\access\DomainProtectedRoute.tsx | other | Manter | |
| src\components\common\access\PermissionGate.tsx | other | Manter | |
| src\components\common\access\ProtectedRoute.tsx | other | Manter | |
| src\components\common\actions\ActionButtons.tsx | other | Crítico | PTBR:encoding |
| src\components\common\data\dataList.constants.ts | other | Crítico | PTBR:encoding |
| src\components\common\data\DataList.tsx | other | Crítico | PTBR:encoding |
| src\components\common\data\dataList.types.ts | other | Manter | |
| src\components\common\data\DataTable.tsx | other | Manter | |
| src\components\common\data\EntitySearchFilter.tsx | other | Manter | |
| src\components\common\data\FilterDrawer.tsx | other | Manter | |
| src\components\common\data\ListFilters.tsx | other | Manter | |
| src\components\common\data\listFilters.types.ts | other | Manter | |
| src\components\common\data\listFilters.utils.ts | other | Manter | |
| src\components\common\data\ListMetricsGrid.tsx | other | Manter | |
| src\components\common\data\QueryDataTable.tsx | other | Manter | |
| src\components\common\data\RowActionsMenu.tsx | other | Crítico | PTBR:encoding |
| src\components\common\data\SearchBar.tsx | other | Manter | |
| src\components\common\data\SelectFilterField.tsx | other | Manter | |
| src\components\common\date\AppDatePicker.tsx | other | Manter | |
| src\components\common\details\ContextualDetailsDrawer.tsx | other | Crítico | TS:as const |
| src\components\common\details\DetailsSection.tsx | other | Manter | |
| src\components\common\details\EntityDetailsDrawer.tsx | other | Manter | |
| src\components\common\details\InfoItem.tsx | other | Manter | |
| src\components\common\display\DetailsInfoCards.tsx | other | Manter | |
| src\components\common\display\EntitySummaryCards.tsx | other | Manter | |
| src\components\common\display\InfoList.tsx | other | Manter | |
| src\components\common\display\KeyValueGrid.tsx | other | Manter | |
| src\components\common\display\LocalizedStatusBadge.tsx | other | Manter | |
| src\components\common\display\MetricCard.tsx | other | Manter | |
| src\components\common\display\StatusChip.tsx | other | Manter | |
| src\components\common\feedback\AppSnackbar.tsx | other | Manter | |
| src\components\common\feedback\AppSnackbarErrorContent.tsx | other | Manter | |
| src\components\common\feedback\ConfirmDialog.tsx | other | Manter | |
| src\components\common\feedback\ListDialog.tsx | other | Manter | |
| src\components\common\feedback\SessionExpiredDialog.tsx | other | Crítico | PTBR:encoding |
| src\components\common\form\AppAutocomplete.tsx | other | Manter | |
| src\components\common\form\AppForm.tsx | other | Manter | |
| src\components\common\form\DateRangePicker.tsx | other | Manter | |
| src\components\common\form\FormActions.tsx | other | Manter | |
| src\components\common\form\FormTextField.tsx | other | Manter | |
| src\components\common\form\TotpCodeBoxes.tsx | other | Manter | |
| src\components\common\loading\CircularLoader.tsx | other | Manter | |
| src\components\common\loading\SkeletonLoader.tsx | other | Crítico | PTBR:encoding |
| src\components\common\messages.ts | other | Manter | |
| src\components\common\modal\BaseModal.tsx | other | Manter | |
| src\components\common\navigation\AppTabs.tsx | other | Manter | |
| src\components\common\navigation\StepperWizard.tsx | other | Manter | |
| src\components\common\onboarding\AdminStep.tsx | other | Crítico | PTBR:encoding |
| src\components\common\onboarding\ClientDataStep.tsx | other | Crítico | PTBR:encoding |
| src\components\common\onboarding\OnboardingSummary.tsx | other | Crítico | PTBR:encoding |
| src\components\common\onboarding\PlanStep.tsx | other | Manter | |
| src\components\common\onboarding\TenantStep.tsx | other | Crítico | TS:as const, PTBR:encoding |
| src\components\common\onboarding\types.ts | other | Manter | |
| src\components\common\overlay\AppPopoverMenu.tsx | other | Manter | |
| src\components\common\overlay\AppTooltip.tsx | other | Manter | |
| src\components\common\page\PageHeader.tsx | other | Manter | |
| src\components\common\page\PageIntroHeader.tsx | other | Manter | |
| src\components\common\page\SectionCard.tsx | other | Manter | |
| src\components\common\state\EmptyState.tsx | other | Manter | |
| src\components\common\state\ErrorState.tsx | other | Manter | |
| src\components\common\upload\AvatarUploader.tsx | other | Manter | |
| src\components\common\upload\FileUpload.tsx | other | Manter | |
| src\components\layout\admin-navigation\AppLayout.tsx | other | Manter | |
| src\components\layout\admin-navigation\CommandPalette.tsx | other | Crítico | PTBR:encoding |
| src\components\layout\admin-navigation\config.tsx | other | Manter | |
| src\components\layout\admin-navigation\messages.ts | other | Crítico | PTBR:encoding |
| src\components\layout\admin-navigation\navigationBuilder.ts | other | Manter | |
| src\components\layout\admin-navigation\navigationGroups\clientNavigationGroups.ts | other | Manter | |
| src\components\layout\admin-navigation\navigationGroups\platformNavigationGroups.ts | other | Crítico | PTBR:encoding |
| src\components\layout\admin-navigation\NotificationsMenu.tsx | other | Manter | |
| src\components\layout\admin-navigation\permissions.ts | other | Manter | |
| src\components\layout\admin-navigation\ProfileMenu.tsx | other | Manter | |
| src\components\layout\admin-navigation\SessionTimer.tsx | other | Crítico | PTBR:encoding |
| src\components\layout\admin-navigation\SidebarContent.tsx | other | Crítico | TS:as const |
| src\components\layout\admin-navigation\TopBar.tsx | other | Manter | |
| src\errors\ErrorBoundary.tsx | other | Crítico | PTBR:encoding |
| src\errors\errorCodeMessages.ts | other | Crítico | PTBR:encoding |
| src\errors\ErrorHandler.ts | other | Crítico | PTBR:encoding |
| src\errors\errorMessageTranslations.ts | other | Crítico | PTBR:encoding |
| src\errors\ModalError.tsx | other | Crítico | PTBR:encoding |
| src\errors\SnackbarError.tsx | other | Manter | |
| src\forms\clientsSchemas.ts | other | Manter | |
| src\forms\plansSchemas.ts | other | Manter | |
| src\forms\schemas\addressSchema.ts | other | Manter | |
| src\forms\schemas\enums.ts | other | Manter | |
| src\forms\schemas\personSchema.ts | other | Manter | |
| src\forms\subscriptionsSchemas.ts | other | Manter | |
| src\forms\useForm.ts | other | Manter | |
| src\forms\validators.ts | other | Manter | |
| src\hooks\client-auth\useClientHomeData.ts | other | Crítico | PTBR:encoding |
| src\hooks\client-auth\useClientHomePageViewModel.tsx | other | Manter | |
| src\hooks\client-auth\useClientLoginFlow.ts | other | Manter | |
| src\hooks\client-auth\useClientLoginPageViewModel.ts | other | Manter | |
| src\hooks\client-auth\useClientLogout.ts | other | Manter | |
| src\hooks\client-auth\useClientProfile.ts | other | Crítico | PTBR:encoding |
| src\hooks\client-auth\useForgotPasswordState.ts | other | Manter | |
| src\hooks\client-auth\useResetPasswordFlow.ts | other | Manter | |
| src\hooks\clients\useClientCreatePage.ts | other | Manter | |
| src\hooks\clients\useClientDetails.ts | other | Manter | |
| src\hooks\clients\useClientDetailsDrawerSchema.tsx | other | Crítico | PTBR:encoding |
| src\hooks\clients\useClientDetailsPageViewModel.tsx | other | Crítico | PTBR:encoding |
| src\hooks\clients\useClientEditPage.ts | other | Manter | |
| src\hooks\clients\useClientOnboardingForm.ts | other | Manter | |
| src\hooks\clients\useClientOnboardingPageViewModel.tsx | other | Crítico | PTBR:encoding |
| src\hooks\clients\useClientsList.ts | other | Manter | |
| src\hooks\clients\useClientsListFilters.ts | other | Manter | |
| src\hooks\clients\useClientsListPage.ts | other | Manter | |
| src\hooks\clients\useClientsListPageView.ts | other | Manter | |
| src\hooks\clients\useClientsListPageViewModel.tsx | other | Crítico | PTBR:encoding |
| src\hooks\clients\useClientsMutations.ts | other | Manter | |
| src\hooks\plans\usePlanCreatePage.ts | other | Manter | |
| src\hooks\plans\usePlanDetails.ts | other | Manter | |
| src\hooks\plans\usePlanEditPage.ts | other | Manter | |
| src\hooks\plans\usePlansList.ts | other | Manter | |
| src\hooks\plans\usePlansListPage.ts | other | Manter | |
| src\hooks\plans\usePlansListPageViewModel.tsx | other | Crítico | PTBR:encoding |
| src\hooks\plans\usePlansMutations.ts | other | Manter | |
| src\hooks\platform-auth\usePlatformLoginFlow.ts | other | Manter | |
| src\hooks\platform-auth\usePlatformLoginPageViewModel.ts | other | Manter | |
| src\hooks\platform-auth\usePlatformMfaFlow.ts | other | Manter | |
| src\hooks\platform-auth\usePlatformMfaPageViewModel.ts | other | Manter | |
| src\hooks\platform-auth\usePlatformMfaSetupFlow.ts | other | Manter | |
| src\hooks\platform-auth\usePlatformProfile.ts | other | Crítico | PTBR:encoding |
| src\hooks\subscriptions\useSubscriptionCreatePage.ts | other | Manter | |
| src\hooks\subscriptions\useSubscriptionDetails.ts | other | Manter | |
| src\hooks\subscriptions\useSubscriptionDetailsPageViewModel.ts | other | Crítico | PTBR:encoding |
| src\hooks\subscriptions\useSubscriptionEditPage.ts | other | Manter | |
| src\hooks\subscriptions\useSubscriptionsList.ts | other | Manter | |
| src\hooks\subscriptions\useSubscriptionsListPage.ts | other | Manter | |
| src\hooks\subscriptions\useSubscriptionsListViewModel.tsx | other | Crítico | PTBR:encoding |
| src\hooks\subscriptions\useSubscriptionsMutations.ts | other | Manter | |
| src\hooks\useAddressAutoFill\useAddressAutoFill.ts | other | Manter | |
| src\hooks\useAppLayoutSessionGate.ts | other | Crítico | PTBR:encoding |
| src\hooks\useAppLayoutState.ts | other | Manter | |
| src\hooks\useAsync\useAsync.ts | other | Manter | |
| src\hooks\useAuth\useAuth.tsx | other | Manter | |
| src\hooks\useClickOutside.ts | other | Manter | |
| src\hooks\useColorMode\useColorMode.tsx | other | Manter | |
| src\hooks\useCommandPalette.ts | other | Manter | |
| src\hooks\useCommandPaletteView.ts | other | Manter | |
| src\hooks\useDebounce\useDebounce.ts | other | Manter | |
| src\hooks\useDebounce\useDebouncedCallback.ts | other | Manter | |
| src\hooks\useDensityPreference.ts | other | Manter | |
| src\hooks\useError\useError.tsx | other | Manter | |
| src\hooks\useMediaQuery.ts | other | Manter | |
| src\hooks\useSessionTimer.ts | other | Crítico | PTBR:encoding |
| src\hooks\useSidebarContentState.ts | other | Manter | |
| src\hooks\useSidebarNavigation.ts | other | Manter | |
| src\hooks\useSidebarState.ts | other | Manter | |
| src\hooks\useThemePreference.ts | other | Manter | |
| src\index.css | other | Manter | |
| src\main.tsx | other | Crítico | PTBR:encoding |
| src\models\address.ts | other | Manter | |
| src\models\adminNavigationStorage.ts | other | Manter | |
| src\models\auth\auth.ts | other | Manter | |
| src\models\auth\guards.ts | other | Manter | |
| src\models\clients.ts | other | Manter | |
| src\models\density.ts | other | Manter | |
| src\models\detailsDrawer.ts | other | Manter | |
| src\models\navigation.ts | other | Manter | |
| src\models\pagination.ts | other | Manter | |
| src\models\plans.ts | other | Manter | |
| src\models\subscriptions.ts | other | Manter | |
| src\models\subscriptionStatusLabels.ts | other | Manter | |
| src\models\themeMode.ts | other | Manter | |
| src\models\types.ts | other | Manter | |
| src\pages\client\auth\ForgotPasswordPage.tsx | other | Crítico | TS:as const, PTBR:encoding |
| src\pages\client\auth\LoginPage.tsx | other | Manter | |
| src\pages\client\auth\ResetPasswordPage.tsx | other | Crítico | TS:as const |
| src\pages\client\dashboard\DashboardPage.tsx | other | Manter | |
| src\pages\client\home\HomePage.tsx | other | Manter | |
| src\pages\DashboardPage.tsx | other | Manter | |
| src\pages\LoginPage.tsx | other | Manter | |
| src\pages\platform\auth\LoginPage.tsx | other | Manter | |
| src\pages\platform\auth\MfaPage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\auth\MfaSetupPage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\auth\PlatformAuthPageLayout.tsx | other | Crítico | TS:as const, PTBR:encoding |
| src\pages\platform\clients\ClientCreatePage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\clients\ClientDetailsPage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\clients\ClientEditPage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\clients\ClientOnboardingPage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\clients\ClientsListPage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\dashboard\DashboardPage.tsx | other | Manter | |
| src\pages\platform\home\HomePage.tsx | other | Manter | |
| src\pages\platform\plans\PlanCreatePage.tsx | other | Manter | |
| src\pages\platform\plans\PlanDetailsPage.tsx | other | Manter | |
| src\pages\platform\plans\PlanEditPage.tsx | other | Manter | |
| src\pages\platform\plans\PlansListPage.tsx | other | Crítico | PTBR:encoding |
| src\pages\platform\subscriptions\SubscriptionCreatePage.tsx | other | Manter | |
| src\pages\platform\subscriptions\SubscriptionDetailsPage.tsx | other | Manter | |
| src\pages\platform\subscriptions\SubscriptionEditPage.tsx | other | Manter | |
| src\pages\platform\subscriptions\SubscriptionsListPage.tsx | other | Crítico | PTBR:encoding |
| src\services\addressService.ts | other | Crítico | PTBR:encoding |
| src\services\auth\loginPreferences.ts | other | Manter | |
| src\services\client\auth\endpoints.ts | other | Manter | |
| src\services\client\auth\service.ts | other | Manter | |
| src\services\client\auth\sessionStorage.ts | other | Manter | |
| src\services\client\auth\types.ts | other | Manter | |
| src\services\httpClient.ts | other | Crítico | PTBR:encoding |
| src\services\platform\auth\endpoints.ts | other | Manter | |
| src\services\platform\auth\service.ts | other | Manter | |
| src\services\platform\auth\types.ts | other | Manter | |
| src\services\platform\clients\endpoints.ts | other | Manter | |
| src\services\platform\clients\service.ts | other | Manter | |
| src\services\platform\clients\types.ts | other | Manter | |
| src\services\platform\plans\endpoints.ts | other | Manter | |
| src\services\platform\plans\service.ts | other | Manter | |
| src\services\platform\plans\types.ts | other | Manter | |
| src\services\platform\subscriptions\endpoints.ts | other | Manter | |
| src\services\platform\subscriptions\service.ts | other | Manter | |
| src\services\platform\subscriptions\types.ts | other | Manter | |
| src\test\components\accessComponents.test.tsx | other | Manter | |
| src\test\components\actionButtons.test.tsx | other | Manter | |
| src\test\components\appDatePicker.test.tsx | other | Manter | |
| src\test\components\appTabs.test.tsx | other | Manter | |
| src\test\components\componentsSmoke.test.tsx | other | Manter | |
| src\test\components\confirmDialog.test.tsx | other | Manter | |
| src\test\components\dataTable.test.tsx | other | Manter | |
| src\test\components\dateRangePicker.test.tsx | other | Manter | |
| src\test\components\domainProtectedRoute.test.tsx | other | Manter | |
| src\test\components\listFilters.test.tsx | other | Manter | |
| src\test\components\queryDataTable.test.tsx | other | Manter | |
| src\test\components\stateComponents.test.tsx | other | Manter | |
| src\test\errors\errorComponents.test.tsx | other | Crítico | PTBR:encoding |
| src\test\errors\errorHandler.test.ts | other | Crítico | PTBR:encoding |
| src\test\hooks\clientsHooksSmoke.test.ts | other | Manter | |
| src\test\hooks\hooksSmoke.test.ts | other | Manter | |
| src\test\hooks\useAddressAutoFill.test.ts | other | Crítico | PTBR:encoding |
| src\test\hooks\useClientHomeData.test.ts | other | Crítico | PTBR:encoding |
| src\test\hooks\useClientProfile.test.ts | other | Manter | |
| src\test\hooks\useClientsListPage.test.ts | other | Manter | |
| src\test\hooks\useCommandPaletteView.test.tsx | other | Manter | |
| src\test\hooks\useForgotPasswordState.test.ts | other | Crítico | PTBR:encoding |
| src\test\hooks\usePlatformProfile.test.ts | other | Manter | |
| src\test\hooks\useSidebarContentState.test.tsx | other | Manter | |
| src\test\hooks\useSidebarNavigation.test.ts | other | Crítico | PTBR:encoding |
| src\test\hooks\useSubscriptionsList.test.ts | other | Manter | |
| src\test\models\themeMode.test.ts | other | Manter | |
| src\test\services\addressService.test.ts | other | Crítico | PTBR:encoding |
| src\test\services\clientAuthService.test.ts | other | Manter | |
| src\test\services\platformAuthService.test.ts | other | Manter | |
| src\test\setup.ts | other | Manter | |
| src\test\utils\date.test.ts | other | Manter | |
| src\test\utils\mask-parse-validation.test.ts | other | Manter | |
| src\theme\breakpoints.ts | other | Manter | |
| src\theme\fontSizes.ts | other | Manter | |
| src\theme\palette.ts | other | Manter | |
| src\theme\spacing.ts | other | Manter | |
| src\theme\theme.ts | other | Manter | |
| src\theme\typography.ts | other | Manter | |
| src\theme\uiColors.ts | other | Manter | |
| src\utils\clientOnboarding.ts | other | Manter | |
| src\utils\date.ts | other | Manter | |
| src\utils\formatters.ts | other | Manter | |
| src\utils\mask.ts | other | Manter | |
| src\utils\parse.ts | other | Manter | |
| src\utils\validation.ts | other | Manter | |
| src\utils\validators.ts | other | Manter | |
| src\vite-env.d.ts | other | Manter | |

## 15. Matriz Exaustiva Arquivo-a-Arquivo (.ai-skills/\*\*)

Total auditado: **33 arquivos**.
| Arquivo | Tipo | Status | Sinais |
|---|---|---|---|
| .ai-skills\checklists\pull-request-checklist.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate, RULE:architecture |
| .ai-skills\docs\ai-context.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate, RULE:architecture |
| .ai-skills\docs\architecture-summary.md | other | Atenção | TEXT:encoding-risk, RULE:architecture |
| .ai-skills\docs\project-decisions.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate, RULE:architecture |
| .ai-skills\README.md | other | Atenção | TEXT:encoding-risk, RULE:quality-gate, RULE:architecture |
| .ai-skills\skills\00-global-rules.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate, RULE:architecture |
| .ai-skills\skills\01-project-architecture-skill.md | other | Atenção | TEXT:encoding-risk, RULE:architecture |
| .ai-skills\skills\02-typescript-quality-skill.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate |
| .ai-skills\skills\03-page-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\04-component-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\05-component-usage-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\06-design-system-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\07-form-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\08-service-api-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\09-hook-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\10-routing-guard-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\11-state-management-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\12-error-handling-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\13-testing-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\14-refactor-clean-code-skill.md | other | Atenção | TEXT:encoding-risk, RULE:quality-gate |
| .ai-skills\skills\15-sdd-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\16-accessibility-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\17-ui-normalization-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\18-i18n-error-message-skill.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const |
| .ai-skills\skills\19-context-management-skill.md | other | Atenção | TEXT:encoding-risk, RULE:architecture |
| .ai-skills\skills\20-lint-config-skill.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate |
| .ai-skills\skills\21-quality-gate-skill.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate |
| .ai-skills\skills\22-import-alias-skill.md | other | Atenção | TEXT:encoding-risk, RULE:quality-gate |
| .ai-skills\skills\23-screen-states-skill.md | other | Atenção | TEXT:encoding-risk |
| .ai-skills\skills\24-structure-hygiene-skill.md | other | Atenção | TEXT:encoding-risk, RULE:quality-gate, RULE:architecture |
| .ai-skills\skills\25-ptbr-text-quality-skill.md | other | Atenção | TEXT:encoding-risk, RULE:quality-gate |
| .ai-skills\skills\26-automated-compliance-skill.md | other | Atenção | TEXT:encoding-risk, RULE:mentions-as-const, RULE:quality-gate |
| .ai-skills\specs\templates\feature-spec-template.md | other | Atenção | TEXT:encoding-risk |

## 16. Problemas Exaustivos por Arquivo (src/\*\*)

Nesta seção, cada item lista: **problema objetivo**, **skill/regra afetada**, **impacto** e **ação recomendada**.

### src\assets\hero.png

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\address\AddressFields.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\auth\platform\PlatformLoginForm.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\clients\ClientForm.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\actions\ActionButtons.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\data\dataList.constants.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\data\DataList.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\data\RowActionsMenu.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\details\ContextualDetailsDrawer.tsx

- Problema: uso de s const (proibido no projeto). Skill: 02-typescript-quality + 00-global-rules. Impacto: quebra de regra absoluta. Ação: substituir por tipo explícito (Record/union).

### src\components\common\feedback\SessionExpiredDialog.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\loading\SkeletonLoader.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\onboarding\AdminStep.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\onboarding\ClientDataStep.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\onboarding\OnboardingSummary.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\common\onboarding\TenantStep.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.
- Problema: uso de s const (proibido no projeto). Skill: 02-typescript-quality + 00-global-rules. Impacto: quebra de regra absoluta. Ação: substituir por tipo explícito (Record/union).

### src\components\layout\admin-navigation\CommandPalette.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\layout\admin-navigation\messages.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\layout\admin-navigation\navigationGroups\platformNavigationGroups.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\layout\admin-navigation\SessionTimer.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\components\layout\admin-navigation\SidebarContent.tsx

- Problema: uso de s const (proibido no projeto). Skill: 02-typescript-quality + 00-global-rules. Impacto: quebra de regra absoluta. Ação: substituir por tipo explícito (Record/union).

### src\errors\ErrorBoundary.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\errors\errorCodeMessages.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\errors\ErrorHandler.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\errors\errorMessageTranslations.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\errors\ModalError.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\client-auth\useClientHomeData.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\client-auth\useClientProfile.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\clients\useClientDetailsDrawerSchema.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\clients\useClientDetailsPageViewModel.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\clients\useClientOnboardingPageViewModel.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\clients\useClientsListPageViewModel.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\plans\usePlansListPageViewModel.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\platform-auth\usePlatformProfile.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\subscriptions\useSubscriptionDetailsPageViewModel.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\subscriptions\useSubscriptionsListViewModel.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\useAppLayoutSessionGate.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\hooks\useSessionTimer.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\main.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\client\auth\ForgotPasswordPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.
- Problema: uso de s const (proibido no projeto). Skill: 02-typescript-quality + 00-global-rules. Impacto: quebra de regra absoluta. Ação: substituir por tipo explícito (Record/union).

### src\pages\client\auth\ResetPasswordPage.tsx

- Problema: uso de s const (proibido no projeto). Skill: 02-typescript-quality + 00-global-rules. Impacto: quebra de regra absoluta. Ação: substituir por tipo explícito (Record/union).

### src\pages\platform\auth\MfaPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\auth\MfaSetupPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\auth\PlatformAuthPageLayout.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.
- Problema: uso de s const (proibido no projeto). Skill: 02-typescript-quality + 00-global-rules. Impacto: quebra de regra absoluta. Ação: substituir por tipo explícito (Record/union).

### src\pages\platform\clients\ClientCreatePage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\clients\ClientDetailsPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\clients\ClientEditPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\clients\ClientOnboardingPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\clients\ClientsListPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\plans\PlansListPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\pages\platform\subscriptions\SubscriptionsListPage.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\services\addressService.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\services\httpClient.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\test\errors\errorComponents.test.tsx

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\test\errors\errorHandler.test.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\test\hooks\useAddressAutoFill.test.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\test\hooks\useClientHomeData.test.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\test\hooks\useForgotPasswordState.test.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\test\hooks\useSidebarNavigation.test.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### src\test\services\addressService.test.ts

- Problema: texto com encoding corrompido (�/Ã). Skill: 25-ptbr-text-quality + 21/26 compliance. Impacto: UI degradada e quebra de quality gate. Ação: corrigir strings e validar UTF-8.

### Observação

Arquivos não listados acima não apresentaram problemas detectáveis pelas regras automatizadas aplicadas nesta rodada e ficaram como manter/monitorar na matriz geral.

## 17. Lista Exaustiva de Problemas por Arquivo + Solucao

Criterio: todo arquivo com problema detectavel recebe diagnostico e solucao objetiva.

### src\assets\hero.png

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\address\AddressFields.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\auth\platform\PlatformLoginForm.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\clients\ClientForm.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\actions\ActionButtons.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\data\dataList.constants.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\data\DataList.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\data\RowActionsMenu.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\details\ContextualDetailsDrawer.tsx

1. Problema: uso de as const proibido no projeto.
   Skill/Regra: Skill 02 + Skill 00.
   Impacto: violacao explicita de padrao TS.
   Solucao: substituir por tipo explicito (Record/union/interfaces).

### src\components\common\feedback\SessionExpiredDialog.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\loading\SkeletonLoader.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\onboarding\AdminStep.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\onboarding\ClientDataStep.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\onboarding\OnboardingSummary.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\common\onboarding\TenantStep.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: uso de as const proibido no projeto.
   Skill/Regra: Skill 02 + Skill 00.
   Impacto: violacao explicita de padrao TS.
   Solucao: substituir por tipo explicito (Record/union/interfaces).

### src\components\layout\admin-navigation\CommandPalette.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\layout\admin-navigation\messages.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\layout\admin-navigation\navigationGroups\platformNavigationGroups.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\layout\admin-navigation\SessionTimer.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\components\layout\admin-navigation\SidebarContent.tsx

1. Problema: uso de as const proibido no projeto.
   Skill/Regra: Skill 02 + Skill 00.
   Impacto: violacao explicita de padrao TS.
   Solucao: substituir por tipo explicito (Record/union/interfaces).

### src\errors\ErrorBoundary.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\errors\errorCodeMessages.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\errors\ErrorHandler.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\errors\errorMessageTranslations.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\errors\ModalError.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\hooks\client-auth\useClientHomeData.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\hooks\client-auth\useClientHomePageViewModel.tsx

1. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\client-auth\useClientLoginPageViewModel.ts

1. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\client-auth\useClientProfile.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\hooks\clients\useClientDetailsDrawerSchema.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\hooks\clients\useClientDetailsPageViewModel.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\clients\useClientOnboardingPageViewModel.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\clients\useClientsListPageViewModel.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\plans\usePlansListPageViewModel.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\platform-auth\usePlatformLoginPageViewModel.ts

1. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\platform-auth\usePlatformMfaPageViewModel.ts

1. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\platform-auth\usePlatformProfile.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\hooks\subscriptions\useSubscriptionDetailsPageViewModel.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\subscriptions\useSubscriptionsListViewModel.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: hook ViewModel; avaliar redundancia com hooks de Page/View.
   Skill/Regra: Skill 01 + Skill 09.
   Impacto: possivel sobreposicao de camadas.
   Solucao: manter apenas se agregar composicao real; eliminar duplicatas Page/View/ViewModel.

### src\hooks\useAppLayoutSessionGate.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\hooks\useSessionTimer.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\main.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\client\auth\ForgotPasswordPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: uso de as const proibido no projeto.
   Skill/Regra: Skill 02 + Skill 00.
   Impacto: violacao explicita de padrao TS.
   Solucao: substituir por tipo explicito (Record/union/interfaces).

### src\pages\client\auth\ResetPasswordPage.tsx

1. Problema: uso de as const proibido no projeto.
   Skill/Regra: Skill 02 + Skill 00.
   Impacto: violacao explicita de padrao TS.
   Solucao: substituir por tipo explicito (Record/union/interfaces).

### src\pages\platform\auth\MfaPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\auth\MfaSetupPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\auth\PlatformAuthPageLayout.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.
2. Problema: uso de as const proibido no projeto.
   Skill/Regra: Skill 02 + Skill 00.
   Impacto: violacao explicita de padrao TS.
   Solucao: substituir por tipo explicito (Record/union/interfaces).

### src\pages\platform\clients\ClientCreatePage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\clients\ClientDetailsPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\clients\ClientEditPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\clients\ClientOnboardingPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\clients\ClientsListPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\plans\PlansListPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\pages\platform\subscriptions\SubscriptionsListPage.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\services\addressService.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\services\httpClient.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\test\errors\errorComponents.test.tsx

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\test\errors\errorHandler.test.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\test\hooks\useAddressAutoFill.test.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\test\hooks\useClientHomeData.test.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\test\hooks\useForgotPasswordState.test.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\test\hooks\useSidebarNavigation.test.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### src\test\services\addressService.test.ts

1. Problema: texto corrompido (encoding) em UI/codigo.
   Skill/Regra: Skill 25 + Skill 21/26.
   Impacto: quebra de qualidade visual e compliance gate.
   Solucao: corrigir literais para UTF-8 valido e validar varredura de encoding.

### Fechamento

Arquivos nao listados acima nao apresentaram problemas detectaveis pelos criterios automatizados desta rodada e permanecem como manter/monitorar.

## 18. Hooks ViewModel: Necessario vs Desnecessario (arquivo por arquivo)

### Criterio de decisao

- `Manter`: agrega composicao real de estado/acoes sem render de UI.
- `Simplificar`: util, mas com acoplamento visual ou sobreposicao parcial.
- `Eliminar`: redundante com outro hook da mesma tela/fluxo.

### Decisao por arquivo

1. `src/hooks/client-auth/useClientHomePageViewModel.tsx`

- Decisao: **Simplificar**
- Motivo: retorna JSX pronto (`content`), misturando camada de view no hook.
- Acao: manter o hook apenas com dados/estado (`loading`, `errorMessage`, `profile`, `messages`) e mover render para page/componente.

2. `src/hooks/client-auth/useClientLoginPageViewModel.ts`

- Decisao: **Manter**
- Motivo: compoe flow e estado sem JSX direto relevante.
- Acao: manter, garantindo que nao vire camada de render.

3. `src/hooks/platform-auth/usePlatformLoginPageViewModel.ts`

- Decisao: **Manter**
- Motivo: composicao de estado/acoes de login; baixo acoplamento visual.
- Acao: manter com contrato estritamente de dados/acoes.

4. `src/hooks/platform-auth/usePlatformMfaPageViewModel.ts`

- Decisao: **Manter**
- Motivo: orchestration de MFA sem renderizacao de UI no retorno.
- Acao: manter padrao de dados/acoes.

5. `src/hooks/clients/useClientsListPageViewModel.tsx`

- Decisao: **Simplificar**
- Motivo: contem `render*` e JSX de celulas/detalhes mobile; acoplamento visual forte.
- Acao: extrair renderizadores para componentes de linha/card; hook retorna apenas schema de dados e handlers.

6. `src/hooks/plans/usePlansListPageViewModel.tsx`

- Decisao: **Simplificar**
- Motivo: mesmo padrao de render no hook (colunas/details com JSX).
- Acao: extrair render de celulas/details para componentes puros.

7. `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx`

- Decisao: **Simplificar**
- Motivo: renderizacao mobile/details e celulas no hook.
- Acao: mover render para componentes de apresentacao.

8. `src/hooks/subscriptions/useSubscriptionDetailsPageViewModel.ts`

- Decisao: **Manter**
- Motivo: resolve estado de tela e organiza dados sem JSX direto.
- Acao: manter como view-state model puro.

9. `src/hooks/clients/useClientDetailsPageViewModel.tsx`

- Decisao: **Simplificar**
- Motivo: injeta elementos visuais (icones/componentes) no contrato.
- Acao: separar schema de dados do schema visual.

10. `src/hooks/clients/useClientOnboardingPageViewModel.tsx`

- Decisao: **Simplificar**
- Motivo: compoe `stepContent: ReactNode` no hook.
- Acao: hook retorna somente estado dos passos + metadados; page decide componentes.

11. `src/hooks/clients/useClientsListPageView.ts`

- Decisao: **Eliminar (apos migracao)**
- Motivo: sobreposicao com `useClientsListPage` + `useClientsListPageViewModel`.
- Acao: consolidar em 1 unico hook de orquestracao de tela.

12. `src/hooks/clients/useClientsListPage.ts`

- Decisao: **Manter (transitorio)**
- Motivo: concentra estado de fluxo (selecao/exclusao), mas hoje compete com outras camadas.
- Acao: apos consolidacao, pode ser incorporado ao hook final unico da tela.

13. `src/hooks/plans/usePlansListPage.ts`

- Decisao: **Manter (transitorio)**
- Motivo: estado de fluxo de listagem/exclusao.
- Acao: manter enquanto viewmodel for simplificado; depois consolidar assinatura final.

14. `src/hooks/subscriptions/useSubscriptionsListPage.ts`

- Decisao: **Manter (transitorio)**
- Motivo: estado de fluxo da listagem.
- Acao: manter ate extracao completa da renderizacao de `useSubscriptionsListViewModel`.

## 19. Matriz Geral de Acao: Excluir / Mover / Unir (codebase)

### 19.1 Unir

1. **Familia de informacao**

- Arquivos: `InfoList`, `InfoItem`, `KeyValueGrid`, `DetailsInfoCards`
- Acao: unir em familia `AppInfo*` (item/list/grid) com contrato responsivo unico.

2. **Familia de listagem/tabela**

- Arquivos: `DataList`, `DataTable`, `QueryDataTable`
- Acao: unir em base comum + adapters de uso.

3. **Hooks de tela redundantes por fluxo**

- Exemplo clients: `useClientsListPage`, `useClientsListPageView`, `useClientsListPageViewModel`
- Acao: unir em 1 hook final por tela.

### 19.2 Mover

1. **Renderizadores hoje dentro de hooks**

- De: `src/hooks/*ViewModel*.tsx`
- Para: `src/components/common/data/*` ou `src/features/<dominio>/components/*`
- Acao: mover `renderTitle/renderDetails/renderStatus/renderActions` e blocos JSX.

2. **Schema visual misturado em hook**

- De: `useClientDetailsDrawerSchema.tsx`
- Para: componente adaptador visual de drawer (ou pasta de presentation schema no dominio).

3. **Estrutura macro por dominio**

- De: estrutura por tipo tecnico
- Para: `src/app`, `src/shared`, `src/features/*`
- Acao: mover incrementalmente por dominio (clients -> plans -> subscriptions).

### 19.3 Excluir (apos migracao e estabilizacao)

1. `src/hooks/clients/useClientsListPageView.ts` (candidato direto a remocao).
2. Variantes antigas de viewmodel/pageview que sobrarem apos consolidacao por tela.
3. Componentes duplicados de informacao apos adocao da familia `AppInfo*`.
4. Adaptadores legados de tabela/lista apos convergencia para base unica.

### 19.4 Regra pratica de decisao (quando excluir/mover/unir)

- **Unir** quando 2+ arquivos resolvem a mesma responsabilidade com pequena variacao.
- **Mover** quando arquivo esta na camada errada (ex.: JSX em hook).
- **Excluir** quando o arquivo ficou sem responsabilidade unica apos unificacao.

### 19.5 Ordem recomendada (segura)

1. Unir `Info*` e estabilizar layout.
2. Extrair JSX de hooks viewmodel para componentes.
3. Consolidar 1 hook por tela/fluxo.
4. Remover arquivos redundantes.
5. Migrar estrutura macro para padrao por dominio.
   uir / Mover / Unir (codebase)

### 19.1 Unir

1. **Familia de informacao**

- Arquivos: `InfoList`, `InfoItem`, `KeyValueGrid`, `DetailsInfoCards`
- Acao: unir em familia `AppInfo*` (item/list/grid) com contrato responsivo unico.

2. **Familia de listagem/tabela**

- Arquivos: `DataList`, `DataTable`, `QueryDataTable`
- Acao: unir em base comum + adapters de uso.

3. **Hooks de tela redundantes por fluxo**

- Exemplo clients: `useClientsListPage`, `useClientsListPageView`, `useClientsListPageViewModel`
- Acao: unir em 1 hook final por tela.

### 19.2 Mover

1. **Renderizadores hoje dentro de hooks**

- De: `src/hooks/*ViewModel*.tsx`
- Para: `src/components/common/data/*` ou `src/features/<dominio>/components/*`
- Acao: mover `renderTitle/renderDetails/renderStatus/renderActions` e blocos JSX.

2. **Schema visual misturado em hook**

- De: `useClientDetailsDrawerSchema.tsx`
- Para: componente adaptador visual de drawer (ou pasta de presentation schema no dominio).

3. **Estrutura macro por dominio**

- De: estrutura por tipo tecnico
- Para: `src/app`, `src/shared`, `src/features/*`
- Acao: mover incrementalmente por dominio (clients -> plans -> subscriptions).

### 19.3 Excluir (apos migracao e estabilizacao)

1. `src/hooks/clients/useClientsListPageView.ts` (candidato direto a remocao).
2. Variantes antigas de viewmodel/pageview que sobrarem apos consolidacao por tela.
3. Componentes duplicados de informacao apos adocao da familia `AppInfo*`.
4. Adaptadores legados de tabela/lista apos convergencia para base unica.

### 19.4 Regra pratica de decisao (quando excluir/mover/unir)

- **Unir** quando 2+ arquivos resolvem a mesma responsabilidade com pequena variacao.
- **Mover** quando arquivo esta na camada errada (ex.: JSX em hook).
- **Excluir** quando o arquivo ficou sem responsabilidade unica apos unificacao.

### 19.5 Ordem recomendada (segura)

1. Unir `Info*` e estabilizar layout.
2. Extrair JSX de hooks viewmodel para componentes.
3. Consolidar 1 hook por tela/fluxo.
4. Remover arquivos redundantes.
5. Migrar estrutura macro para padrao por dominio.

# Inventario Exaustivo de Compliance das Skills (Documento Unico)

## 1. Escopo e Metodo

- Escopo total: `src/**` e `.ai-skills/**`.
- Objetivo: mapear problemas por skill e por arquivo, com solucao.
- Base: `AGENTS.md` + skills 00..26 + inspecao de codigo.

## 2. Resumo Executivo

- Compliance geral: parcial, com pontos criticos em arquitetura, hooks com UI, encoding e padronizacao de layout.
- Pontos fortes: lint/typecheck/test verdes; base funcional robusta.
- Pontos criticos: estrutura fora do alvo, redundancia de hooks/page view model, componentes de info redundantes, inconsistencias de layout.

## 3. Achados Criticos Prioritarios

1. Estrutura de projeto diverge da hierarquia alvo (`app/shared/features`).
2. Hooks com render de UI (JSX e `render*`) quebram separacao de camadas.
3. Inconsistencia de layout entre telas por wrappers com spacing macro.
4. Familia de info redundante e com risco de quebra responsiva.
5. Ocorrencias de encoding corrompido e `as const` proibido.

## 4. Hooks ViewModel: Necessario vs Desnecessario

### Manter

- `src/hooks/client-auth/useClientLoginPageViewModel.ts`
- `src/hooks/platform-auth/usePlatformLoginPageViewModel.ts`
- `src/hooks/platform-auth/usePlatformMfaPageViewModel.ts`
- `src/hooks/subscriptions/useSubscriptionDetailsPageViewModel.ts`

### Simplificar

- `src/hooks/client-auth/useClientHomePageViewModel.tsx`
- `src/hooks/clients/useClientsListPageViewModel.tsx`
- `src/hooks/plans/usePlansListPageViewModel.tsx`
- `src/hooks/subscriptions/useSubscriptionsListViewModel.tsx`
- `src/hooks/clients/useClientDetailsPageViewModel.tsx`
- `src/hooks/clients/useClientOnboardingPageViewModel.tsx`
- `src/hooks/clients/useClientDetailsDrawerSchema.tsx`

### Eliminar (apos migracao)

- `src/hooks/clients/useClientsListPageView.ts`

## 5. Componentes: Unir / Mover / Excluir

### Unir

- Info: `InfoList`, `InfoItem`, `KeyValueGrid`, `DetailsInfoCards` -> familia `AppInfo*`.
- Tabela/lista: `DataList`, `DataTable`, `QueryDataTable` -> base unica + adapters.

### Mover

- Renderizadores em hooks (`renderTitle`, `renderDetails`, `renderStatus`, `renderActions`) para componentes de apresentacao.

### Excluir (apos convergencia)

- Variantes redundantes `Page/View/ViewModel` por fluxo.

## 6. Investigacao de Layout (Clientes x Planos)

- `ClientsListPage` usa `ContextualDetailsDrawer` envolvendo conteudo com `Stack spacing`, enquanto `PlansListPage` nao.
- Isso altera ritmo vertical e causa discrepancia perceptivel de altura/cadencia.
- `InfoList` tem risco proprio de quebra (linha fixa horizontal), mas a divergencia entre as telas e principalmente composicao de page.
- Diretriz: spacing macro deve ser do layout padrao de page, nao do wrapper contextual.

## 7. Evidencias: Regras TS e Encoding

### TS (trechos detectados)

- src\App.css:5: color: var(--accent);
- src\App.css:6: background: var(--accent-bg);
- src\App.css:12: border-color: var(--accent-border);
- src\App.css:15: outline: 2px solid var(--accent);
- src\App.css:73: border-top: 1px solid var(--border);
- src\App.css:97: border-right: 1px solid var(--border);
- src\App.css:101: border-bottom: 1px solid var(--border);
- src\App.css:117: color: var(--text-h);
- src\App.css:120: background: var(--social-bg);
- src\App.css:129: box-shadow: var(--shadow);
- src\App.css:156: border-top: 1px solid var(--border);
- src\App.css:176: border-left-color: var(--border);
- src\App.css:180: border-right-color: var(--border);
- src\pages\client\auth\ResetPasswordPage.tsx:20:} as const;
- src\pages\client\auth\ForgotPasswordPage.tsx:16:} as const;
- src\components\layout\admin-navigation\SidebarContent.tsx:82:} as const;
- src\pages\platform\auth\PlatformAuthPageLayout.tsx:30:} as const;
- src\pages\platform\auth\PlatformAuthPageLayout.tsx:48:] as const;
- src\components\common\onboarding\TenantStep.tsx:14:] as const;
- src\components\common\onboarding\TenantStep.tsx:16:const localeOptions = ['pt-BR', 'en-US', 'es-ES'] as const;
- src\components\common\onboarding\TenantStep.tsx:18:const currencyOptions = ['BRL', 'USD', 'EUR'] as const;
- src\components\common\details\ContextualDetailsDrawer.tsx:16:} as const;

### Encoding (trechos detectados)

- src\pages\platform\subscriptions\SubscriptionEditPage.tsx:23: <Typography>tenantId � obrigat�rio.</Typography>
- src\pages\platform\subscriptions\SubscriptionEditPage.tsx:68: render={({ field }) => <TextField {...field} fullWidth label="Pre�o contratado" />}
- src\pages\platform\subscriptions\SubscriptionCreatePage.tsx:57: render={({ field }) => <TextField {...field} fullWidth label="Pre�o contratado" />}
- src\pages\platform\plans\PlanEditPage.tsx:31: render={({ field }) => <TextField {...field} fullWidth label="Descri��o" />}
- src\pages\platform\plans\PlanEditPage.tsx:36: render={({ field }) => <TextField {...field} fullWidth label="Pre�o" />}
- src\pages\platform\plans\PlanDetailsPage.tsx:37: { label: 'Descri��o', value: data.description ?? '-' },
- src\pages\platform\plans\PlanDetailsPage.tsx:38: { label: 'Pre�o', value: `${data.price} ${data.currency}` },
- src\pages\platform\plans\PlanCreatePage.tsx:31: render={({ field }) => <TextField {...field} fullWidth label="Descri��o" />}
- src\pages\platform\plans\PlanCreatePage.tsx:36: render={({ field }) => <TextField {...field} fullWidth label="Pre�o" />}

## 8. Problemas por Arquivo + Solucao (exaustivo para arquivos com achados)

### src\assets\hero.png

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\address\AddressFields.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\auth\platform\PlatformLoginForm.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\clients\ClientForm.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\actions\ActionButtons.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\data\dataList.constants.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\data\DataList.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\data\RowActionsMenu.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\details\ContextualDetailsDrawer.tsx

1. Uso de as const proibido -> tipar explicitamente com Record/union.

### src\components\common\feedback\SessionExpiredDialog.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\loading\SkeletonLoader.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\onboarding\AdminStep.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\onboarding\ClientDataStep.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\onboarding\OnboardingSummary.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\common\onboarding\TenantStep.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.
2. Uso de as const proibido -> tipar explicitamente com Record/union.

### src\components\layout\admin-navigation\CommandPalette.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\layout\admin-navigation\messages.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\layout\admin-navigation\navigationGroups\platformNavigationGroups.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\layout\admin-navigation\SessionTimer.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\components\layout\admin-navigation\SidebarContent.tsx

1. Uso de as const proibido -> tipar explicitamente com Record/union.

### src\errors\ErrorBoundary.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\errors\errorCodeMessages.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\errors\ErrorHandler.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\errors\errorMessageTranslations.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\errors\ModalError.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\client-auth\useClientHomeData.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\client-auth\useClientProfile.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\clients\useClientDetailsDrawerSchema.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\clients\useClientDetailsPageViewModel.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\clients\useClientOnboardingPageViewModel.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\clients\useClientsListPageViewModel.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\plans\usePlansListPageViewModel.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\platform-auth\usePlatformProfile.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\subscriptions\useSubscriptionDetailsPageViewModel.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\subscriptions\useSubscriptionsListViewModel.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\useAppLayoutSessionGate.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\hooks\useSessionTimer.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\main.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\client\auth\ForgotPasswordPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.
2. Uso de as const proibido -> tipar explicitamente com Record/union.

### src\pages\client\auth\ResetPasswordPage.tsx

1. Uso de as const proibido -> tipar explicitamente com Record/union.

### src\pages\platform\auth\MfaPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\auth\MfaSetupPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\auth\PlatformAuthPageLayout.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.
2. Uso de as const proibido -> tipar explicitamente com Record/union.

### src\pages\platform\clients\ClientCreatePage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\clients\ClientDetailsPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\clients\ClientEditPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\clients\ClientOnboardingPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\clients\ClientsListPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\plans\PlansListPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\pages\platform\subscriptions\SubscriptionsListPage.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\services\addressService.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\services\httpClient.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\test\errors\errorComponents.test.tsx

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\test\errors\errorHandler.test.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\test\hooks\useAddressAutoFill.test.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\test\hooks\useClientHomeData.test.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\test\hooks\useForgotPasswordState.test.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\test\hooks\useSidebarNavigation.test.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

### src\test\services\addressService.test.ts

1. Texto corrompido (encoding) -> corrigir literals UTF-8 e centralizar mensagem.

## 9. Cobertura Total da Codebase

- Arquivos auditados em src: 273
- Arquivos auditados em .ai-skills: 33
- Matriz src (inventario completo):
  - src\App.css
  - src\App.tsx
  - src\assets\hero.png
  - src\assets\react.svg
  - src\assets\vite.svg
  - src\components\address\AddressFields.tsx
  - src\components\auth\client\ClientLoginFormCard.tsx
  - src\components\auth\LoginContainer.tsx
  - src\components\auth\LoginForm.tsx
  - src\components\auth\platform\PlatformLoginForm.tsx
  - src\components\auth\platform\PlatformLoginFormCard.tsx
  - src\components\auth\platform\PlatformMfaForm.tsx
  - src\components\auth\platform\PlatformMfaSetupForm.tsx
  - src\components\clients\ClientForm.tsx
  - src\components\common\access\DomainProtectedRoute.tsx
  - src\components\common\access\PermissionGate.tsx
  - src\components\common\access\ProtectedRoute.tsx
  - src\components\common\actions\ActionButtons.tsx
  - src\components\common\data\dataList.constants.ts
  - src\components\common\data\DataList.tsx
  - src\components\common\data\dataList.types.ts
  - src\components\common\data\DataTable.tsx
  - src\components\common\data\EntitySearchFilter.tsx
  - src\components\common\data\FilterDrawer.tsx
  - src\components\common\data\ListFilters.tsx
  - src\components\common\data\listFilters.types.ts
  - src\components\common\data\listFilters.utils.ts
  - src\components\common\data\ListMetricsGrid.tsx
  - src\components\common\data\QueryDataTable.tsx
  - src\components\common\data\RowActionsMenu.tsx
  - src\components\common\data\SearchBar.tsx
  - src\components\common\data\SelectFilterField.tsx
  - src\components\common\date\AppDatePicker.tsx
  - src\components\common\details\ContextualDetailsDrawer.tsx
  - src\components\common\details\DetailsSection.tsx
  - src\components\common\details\EntityDetailsDrawer.tsx
  - src\components\common\details\InfoItem.tsx
  - src\components\common\display\DetailsInfoCards.tsx
  - src\components\common\display\EntitySummaryCards.tsx
  - src\components\common\display\InfoList.tsx
  - src\components\common\display\KeyValueGrid.tsx
  - src\components\common\display\LocalizedStatusBadge.tsx
  - src\components\common\display\MetricCard.tsx
  - src\components\common\display\StatusChip.tsx
  - src\components\common\feedback\AppSnackbar.tsx
  - src\components\common\feedback\AppSnackbarErrorContent.tsx
  - src\components\common\feedback\ConfirmDialog.tsx
  - src\components\common\feedback\ListDialog.tsx
  - src\components\common\feedback\SessionExpiredDialog.tsx
  - src\components\common\form\AppAutocomplete.tsx
  - src\components\common\form\AppForm.tsx
  - src\components\common\form\DateRangePicker.tsx
  - src\components\common\form\FormActions.tsx
  - src\components\common\form\FormTextField.tsx
  - src\components\common\form\TotpCodeBoxes.tsx
  - src\components\common\loading\CircularLoader.tsx
  - src\components\common\loading\SkeletonLoader.tsx
  - src\components\common\messages.ts
  - src\components\common\modal\BaseModal.tsx
  - src\components\common\navigation\AppTabs.tsx
  - src\components\common\navigation\StepperWizard.tsx
  - src\components\common\onboarding\AdminStep.tsx
  - src\components\common\onboarding\ClientDataStep.tsx
  - src\components\common\onboarding\OnboardingSummary.tsx
  - src\components\common\onboarding\PlanStep.tsx
  - src\components\common\onboarding\TenantStep.tsx
  - src\components\common\onboarding\types.ts
  - src\components\common\overlay\AppPopoverMenu.tsx
  - src\components\common\overlay\AppTooltip.tsx
  - src\components\common\page\PageHeader.tsx
  - src\components\common\page\PageIntroHeader.tsx
  - src\components\common\page\SectionCard.tsx
  - src\components\common\state\EmptyState.tsx
  - src\components\common\state\ErrorState.tsx
  - src\components\common\upload\AvatarUploader.tsx
  - src\components\common\upload\FileUpload.tsx
  - src\components\layout\admin-navigation\AppLayout.tsx
  - src\components\layout\admin-navigation\CommandPalette.tsx
  - src\components\layout\admin-navigation\config.tsx
  - src\components\layout\admin-navigation\messages.ts
  - src\components\layout\admin-navigation\navigationBuilder.ts
  - src\components\layout\admin-navigation\navigationGroups\clientNavigationGroups.ts
  - src\components\layout\admin-navigation\navigationGroups\platformNavigationGroups.ts
  - src\components\layout\admin-navigation\NotificationsMenu.tsx
  - src\components\layout\admin-navigation\permissions.ts
  - src\components\layout\admin-navigation\ProfileMenu.tsx
  - src\components\layout\admin-navigation\SessionTimer.tsx
  - src\components\layout\admin-navigation\SidebarContent.tsx
  - src\components\layout\admin-navigation\TopBar.tsx
  - src\errors\ErrorBoundary.tsx
  - src\errors\errorCodeMessages.ts
  - src\errors\ErrorHandler.ts
  - src\errors\errorMessageTranslations.ts
  - src\errors\ModalError.tsx
  - src\errors\SnackbarError.tsx
  - src\forms\clientsSchemas.ts
  - src\forms\plansSchemas.ts
  - src\forms\schemas\addressSchema.ts
  - src\forms\schemas\enums.ts
  - src\forms\schemas\personSchema.ts
  - src\forms\subscriptionsSchemas.ts
  - src\forms\useForm.ts
  - src\forms\validators.ts
  - src\hooks\client-auth\useClientHomeData.ts
  - src\hooks\client-auth\useClientHomePageViewModel.tsx
  - src\hooks\client-auth\useClientLoginFlow.ts
  - src\hooks\client-auth\useClientLoginPageViewModel.ts
  - src\hooks\client-auth\useClientLogout.ts
  - src\hooks\client-auth\useClientProfile.ts
  - src\hooks\client-auth\useForgotPasswordState.ts
  - src\hooks\client-auth\useResetPasswordFlow.ts
  - src\hooks\clients\useClientCreatePage.ts
  - src\hooks\clients\useClientDetails.ts
  - src\hooks\clients\useClientDetailsDrawerSchema.tsx
  - src\hooks\clients\useClientDetailsPageViewModel.tsx
  - src\hooks\clients\useClientEditPage.ts
  - src\hooks\clients\useClientOnboardingForm.ts
  - src\hooks\clients\useClientOnboardingPageViewModel.tsx
  - src\hooks\clients\useClientsList.ts
  - src\hooks\clients\useClientsListFilters.ts
  - src\hooks\clients\useClientsListPage.ts
  - src\hooks\clients\useClientsListPageView.ts
  - src\hooks\clients\useClientsListPageViewModel.tsx
  - src\hooks\clients\useClientsMutations.ts
  - src\hooks\plans\usePlanCreatePage.ts
  - src\hooks\plans\usePlanDetails.ts
  - src\hooks\plans\usePlanEditPage.ts
  - src\hooks\plans\usePlansList.ts
  - src\hooks\plans\usePlansListPage.ts
  - src\hooks\plans\usePlansListPageViewModel.tsx
  - src\hooks\plans\usePlansMutations.ts
  - src\hooks\platform-auth\usePlatformLoginFlow.ts
  - src\hooks\platform-auth\usePlatformLoginPageViewModel.ts
  - src\hooks\platform-auth\usePlatformMfaFlow.ts
  - src\hooks\platform-auth\usePlatformMfaPageViewModel.ts
  - src\hooks\platform-auth\usePlatformMfaSetupFlow.ts
  - src\hooks\platform-auth\usePlatformProfile.ts
  - src\hooks\subscriptions\useSubscriptionCreatePage.ts
  - src\hooks\subscriptions\useSubscriptionDetails.ts
  - src\hooks\subscriptions\useSubscriptionDetailsPageViewModel.ts
  - src\hooks\subscriptions\useSubscriptionEditPage.ts
  - src\hooks\subscriptions\useSubscriptionsList.ts
  - src\hooks\subscriptions\useSubscriptionsListPage.ts
  - src\hooks\subscriptions\useSubscriptionsListViewModel.tsx
  - src\hooks\subscriptions\useSubscriptionsMutations.ts
  - src\hooks\useAddressAutoFill\useAddressAutoFill.ts
  - src\hooks\useAppLayoutSessionGate.ts
  - src\hooks\useAppLayoutState.ts
  - src\hooks\useAsync\useAsync.ts
  - src\hooks\useAuth\useAuth.tsx
  - src\hooks\useClickOutside.ts
  - src\hooks\useColorMode\useColorMode.tsx
  - src\hooks\useCommandPalette.ts
  - src\hooks\useCommandPaletteView.ts
  - src\hooks\useDebounce\useDebounce.ts
  - src\hooks\useDebounce\useDebouncedCallback.ts
  - src\hooks\useDensityPreference.ts
  - src\hooks\useError\useError.tsx
  - src\hooks\useMediaQuery.ts
  - src\hooks\useSessionTimer.ts
  - src\hooks\useSidebarContentState.ts
  - src\hooks\useSidebarNavigation.ts
  - src\hooks\useSidebarState.ts
  - src\hooks\useThemePreference.ts
  - src\index.css
  - src\main.tsx
  - src\models\address.ts
  - src\models\adminNavigationStorage.ts
  - src\models\auth\auth.ts
  - src\models\auth\guards.ts
  - src\models\clients.ts
  - src\models\density.ts
  - src\models\detailsDrawer.ts
  - src\models\navigation.ts
  - src\models\pagination.ts
  - src\models\plans.ts
  - src\models\subscriptions.ts
  - src\models\subscriptionStatusLabels.ts
  - src\models\themeMode.ts
  - src\models\types.ts
  - src\pages\client\auth\ForgotPasswordPage.tsx
  - src\pages\client\auth\LoginPage.tsx
  - src\pages\client\auth\ResetPasswordPage.tsx
  - src\pages\client\dashboard\DashboardPage.tsx
  - src\pages\client\home\HomePage.tsx
  - src\pages\DashboardPage.tsx
  - src\pages\LoginPage.tsx
  - src\pages\platform\auth\LoginPage.tsx
  - src\pages\platform\auth\MfaPage.tsx
  - src\pages\platform\auth\MfaSetupPage.tsx
  - src\pages\platform\auth\PlatformAuthPageLayout.tsx
  - src\pages\platform\clients\ClientCreatePage.tsx
  - src\pages\platform\clients\ClientDetailsPage.tsx
  - src\pages\platform\clients\ClientEditPage.tsx
  - src\pages\platform\clients\ClientOnboardingPage.tsx
  - src\pages\platform\clients\ClientsListPage.tsx
  - src\pages\platform\dashboard\DashboardPage.tsx
  - src\pages\platform\home\HomePage.tsx
  - src\pages\platform\plans\PlanCreatePage.tsx
  - src\pages\platform\plans\PlanDetailsPage.tsx
  - src\pages\platform\plans\PlanEditPage.tsx
  - src\pages\platform\plans\PlansListPage.tsx
  - src\pages\platform\subscriptions\SubscriptionCreatePage.tsx
  - src\pages\platform\subscriptions\SubscriptionDetailsPage.tsx
  - src\pages\platform\subscriptions\SubscriptionEditPage.tsx
  - src\pages\platform\subscriptions\SubscriptionsListPage.tsx
  - src\services\addressService.ts
  - src\services\auth\loginPreferences.ts
  - src\services\client\auth\endpoints.ts
  - src\services\client\auth\service.ts
  - src\services\client\auth\sessionStorage.ts
  - src\services\client\auth\types.ts
  - src\services\httpClient.ts
  - src\services\platform\auth\endpoints.ts
  - src\services\platform\auth\service.ts
  - src\services\platform\auth\types.ts
  - src\services\platform\clients\endpoints.ts
  - src\services\platform\clients\service.ts
  - src\services\platform\clients\types.ts
  - src\services\platform\plans\endpoints.ts
  - src\services\platform\plans\service.ts
  - src\services\platform\plans\types.ts
  - src\services\platform\subscriptions\endpoints.ts
  - src\services\platform\subscriptions\service.ts
  - src\services\platform\subscriptions\types.ts
  - src\test\components\accessComponents.test.tsx
  - src\test\components\actionButtons.test.tsx
  - src\test\components\appDatePicker.test.tsx
  - src\test\components\appTabs.test.tsx
  - src\test\components\componentsSmoke.test.tsx
  - src\test\components\confirmDialog.test.tsx
  - src\test\components\dataTable.test.tsx
  - src\test\components\dateRangePicker.test.tsx
  - src\test\components\domainProtectedRoute.test.tsx
  - src\test\components\listFilters.test.tsx
  - src\test\components\queryDataTable.test.tsx
  - src\test\components\stateComponents.test.tsx
  - src\test\errors\errorComponents.test.tsx
  - src\test\errors\errorHandler.test.ts
  - src\test\hooks\clientsHooksSmoke.test.ts
  - src\test\hooks\hooksSmoke.test.ts
  - src\test\hooks\useAddressAutoFill.test.ts
  - src\test\hooks\useClientHomeData.test.ts
  - src\test\hooks\useClientProfile.test.ts
  - src\test\hooks\useClientsListPage.test.ts
  - src\test\hooks\useCommandPaletteView.test.tsx
  - src\test\hooks\useForgotPasswordState.test.ts
  - src\test\hooks\usePlatformProfile.test.ts
  - src\test\hooks\useSidebarContentState.test.tsx
  - src\test\hooks\useSidebarNavigation.test.ts
  - src\test\hooks\useSubscriptionsList.test.ts
  - src\test\models\themeMode.test.ts
  - src\test\services\addressService.test.ts
  - src\test\services\clientAuthService.test.ts
  - src\test\services\platformAuthService.test.ts
  - src\test\setup.ts
  - src\test\utils\date.test.ts
  - src\test\utils\mask-parse-validation.test.ts
  - src\theme\breakpoints.ts
  - src\theme\fontSizes.ts
  - src\theme\palette.ts
  - src\theme\spacing.ts
  - src\theme\theme.ts
  - src\theme\typography.ts
  - src\theme\uiColors.ts
  - src\utils\clientOnboarding.ts
  - src\utils\date.ts
  - src\utils\formatters.ts
  - src\utils\mask.ts
  - src\utils\parse.ts
  - src\utils\validation.ts
  - src\utils\validators.ts
  - src\vite-env.d.ts
- Matriz .ai-skills (inventario completo):
  - .ai-skills\checklists\pull-request-checklist.md
  - .ai-skills\docs\ai-context.md
  - .ai-skills\docs\architecture-summary.md
  - .ai-skills\docs\project-decisions.md
  - .ai-skills\README.md
  - .ai-skills\skills\00-global-rules.md
  - .ai-skills\skills\01-project-architecture-skill.md
  - .ai-skills\skills\02-typescript-quality-skill.md
  - .ai-skills\skills\03-page-skill.md
  - .ai-skills\skills\04-component-skill.md
  - .ai-skills\skills\05-component-usage-skill.md
  - .ai-skills\skills\06-design-system-skill.md
  - .ai-skills\skills\07-form-skill.md
  - .ai-skills\skills\08-service-api-skill.md
  - .ai-skills\skills\09-hook-skill.md
  - .ai-skills\skills\10-routing-guard-skill.md
  - .ai-skills\skills\11-state-management-skill.md
  - .ai-skills\skills\12-error-handling-skill.md
  - .ai-skills\skills\13-testing-skill.md
  - .ai-skills\skills\14-refactor-clean-code-skill.md
  - .ai-skills\skills\15-sdd-skill.md
  - .ai-skills\skills\16-accessibility-skill.md
  - .ai-skills\skills\17-ui-normalization-skill.md
  - .ai-skills\skills\18-i18n-error-message-skill.md
  - .ai-skills\skills\19-context-management-skill.md
  - .ai-skills\skills\20-lint-config-skill.md
  - .ai-skills\skills\21-quality-gate-skill.md
  - .ai-skills\skills\22-import-alias-skill.md
  - .ai-skills\skills\23-screen-states-skill.md
  - .ai-skills\skills\24-structure-hygiene-skill.md
  - .ai-skills\skills\25-ptbr-text-quality-skill.md
  - .ai-skills\skills\26-automated-compliance-skill.md
  - .ai-skills\specs\templates\feature-spec-template.md

## 10. Plano de Refatoracao Priorizado

### P0

- Corrigir encoding e remover `as const` proibidos.
- Corrigir `InfoList` e neutralizar impacto de `ContextualDetailsDrawer` no spacing macro.
- Remover JSX dos hooks mais criticos.

### P1

- Unificar familia `AppInfo*`.
- Consolidar 1 hook por tela (eliminar Page/View/ViewModel redundantes).

### P2

- Unificar base de listagem/tabela.
- Migrar estrutura para app/shared/features por ondas.
