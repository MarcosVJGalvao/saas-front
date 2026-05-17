# AGENTS.md — Orquestração de IA do Frontend

Este arquivo define como agentes de IA devem trabalhar neste projeto frontend.

Ele deve ser tratado como a **fonte principal de orquestração** para implementação, refatoração, correção de bugs, criação de componentes, criação de telas, integração com backend, testes e documentação.

---

# 1. Objetivo

Orientar qualquer agente de IA a desenvolver, revisar ou refatorar este projeto seguindo:

- React;
- Vite;
- TypeScript;
- Material UI;
- React Hook Form;
- Zod;
- React Router;
- TanStack Query;
- Zustand ou Context quando necessário;
- Recharts;
- Clean Code;
- Clean Architecture;
- Specification Driven Development;
- Design System;
- UI em português;
- normalização de dados;
- padronização de erros;
- acessibilidade;
- testes;
- economia de contexto.

---

# 2. Skills obrigatórias em toda tarefa

Antes de iniciar qualquer tarefa, o agente deve sempre consultar estas skills:

```txt
.ai-skills/skills/00-global-rules.md
.ai-skills/skills/01-project-architecture-skill.md
.ai-skills/skills/02-typescript-quality-skill.md
.ai-skills/skills/19-context-management-skill.md
.ai-skills/skills/25-ptbr-text-quality-skill.md
```

Essas skills são obrigatórias para qualquer tipo de atividade.

## Responsabilidade de cada uma

### `00-global-rules.md`

Define as regras globais do projeto.

Deve ser usada para validar se a solução respeita os padrões gerais definidos.

### `01-project-architecture-skill.md`

Define a arquitetura do projeto, camadas, responsabilidades e organização das pastas.

Deve ser usada para evitar código fora do lugar.

### `02-typescript-quality-skill.md`

Define padrões rígidos de TypeScript.

Deve ser usada para evitar más práticas como `any`, `as`, `as const`, casting e disables.

### `19-context-management-skill.md`

Define como o agente deve lidar com contexto, leitura seletiva de arquivos e atualização de decisões.

Deve ser usada para evitar consumo desnecessário de tokens e perda de contexto.

### `25-ptbr-text-quality-skill.md`

Define regras de qualidade textual em PT-BR e validação de encoding.

Deve ser usada para impedir texto corrompido, caractere de substituição e inconsistência de idioma na UI.

---

# 3. Regra de contexto

O agente deve trabalhar com economia de contexto.

## Sempre ler

```txt
.ai-skills/docs/ai-context.md
.ai-skills/skills/00-global-rules.md
.ai-skills/skills/01-project-architecture-skill.md
.ai-skills/skills/02-typescript-quality-skill.md
.ai-skills/skills/19-context-management-skill.md
.ai-skills/skills/25-ptbr-text-quality-skill.md
```

## Ler somente quando necessário

O agente deve ler skills específicas apenas conforme a tarefa.

Não deve carregar todas as skills em toda tarefa.

## Atualizar contexto somente quando necessário

O agente só deve atualizar arquivos de contexto quando houver:

- nova decisão arquitetural;
- nova convenção global;
- nova regra de projeto;
- mudança relevante no fluxo de implementação;
- mudança relevante no Design System;
- alteração em padrão de API, erro, enum, máscara ou normalização.

Não atualizar contexto para mudanças pequenas e locais.

---

# 4. Arquivos de contexto do projeto

O projeto pode conter os seguintes arquivos:

```txt
.ai-skills/docs/
  ai-context.md
  project-decisions.md
  architecture-summary.md

.ai-skills/specs/
  templates/
    feature-spec-template.md

.ai-skills/skills/
  00-global-rules.md
  01-project-architecture-skill.md
  02-typescript-quality-skill.md
  03-page-skill.md
  04-component-skill.md
  05-component-usage-skill.md
  06-design-system-skill.md
  07-form-skill.md
  08-service-api-skill.md
  09-hook-skill.md
  10-routing-guard-skill.md
  11-state-management-skill.md
  12-error-handling-skill.md
  13-testing-skill.md
  14-refactor-clean-code-skill.md
  15-sdd-skill.md
  16-accessibility-skill.md
  17-ui-normalization-skill.md
  18-i18n-error-message-skill.md
  19-context-management-skill.md
  20-lint-config-skill.md
  21-quality-gate-skill.md
  22-import-alias-skill.md
  23-screen-states-skill.md
  24-structure-hygiene-skill.md
  25-ptbr-text-quality-skill.md
  26-automated-compliance-skill.md

.ai-skills/checklists/
  pull-request-checklist.md
```

---

# 5. Como escolher skills por tipo de tarefa

## Skills complementares obrigatórias (compliance)

Além das skills funcionais por tipo de tarefa, incluir explicitamente quando aplicável:

```txt
.ai-skills/skills/20-lint-config-skill.md
.ai-skills/skills/21-quality-gate-skill.md
.ai-skills/skills/22-import-alias-skill.md
.ai-skills/skills/23-screen-states-skill.md
.ai-skills/skills/24-structure-hygiene-skill.md
.ai-skills/skills/25-ptbr-text-quality-skill.md
.ai-skills/skills/26-automated-compliance-skill.md
```

Regras de uso:

- `20-lint-config-skill.md`: toda tarefa com alteração de código.
- `21-quality-gate-skill.md`: toda tarefa antes de concluir.
- `22-import-alias-skill.md`: toda tarefa com criação/edição de imports em `src` ou `tests`.
- `23-screen-states-skill.md`: criação/alteração de pages e fluxos visuais.
- `24-structure-hygiene-skill.md`: tarefas que criem/removam/movam arquivos e pastas.
- `25-ptbr-text-quality-skill.md`: toda tarefa que altere textos de UI, testes, i18n, docs ou specs.
- `26-automated-compliance-skill.md`: toda tarefa antes do quality gate final (obrigatório).

## Implementar feature nova

Ler:

```txt
.ai-skills/skills/00-global-rules.md
.ai-skills/skills/01-project-architecture-skill.md
.ai-skills/skills/02-typescript-quality-skill.md
.ai-skills/skills/03-page-skill.md
.ai-skills/skills/04-component-skill.md
.ai-skills/skills/05-component-usage-skill.md
.ai-skills/skills/06-design-system-skill.md
.ai-skills/skills/07-form-skill.md
.ai-skills/skills/08-service-api-skill.md
.ai-skills/skills/09-hook-skill.md
.ai-skills/skills/10-routing-guard-skill.md
.ai-skills/skills/11-state-management-skill.md
.ai-skills/skills/12-error-handling-skill.md
.ai-skills/skills/15-sdd-skill.md
.ai-skills/skills/17-ui-normalization-skill.md
.ai-skills/skills/18-i18n-error-message-skill.md
.ai-skills/skills/19-context-management-skill.md
.ai-skills/skills/20-lint-config-skill.md
.ai-skills/skills/21-quality-gate-skill.md
.ai-skills/skills/22-import-alias-skill.md
.ai-skills/skills/23-screen-states-skill.md
.ai-skills/skills/24-structure-hygiene-skill.md
.ai-skills/skills/25-ptbr-text-quality-skill.md
.ai-skills/skills/26-automated-compliance-skill.md
```

Também ler a spec da feature:

```txt
.ai-skills/specs/features/[feature-name].md
```

## Criar ou alterar page

Ler:

```txt
skills/03-page-skill.md
skills/05-component-usage-skill.md
skills/09-hook-skill.md
skills/10-routing-guard-skill.md
```

## Criar componente compartilhado

Ler:

```txt
skills/04-component-skill.md
skills/05-component-usage-skill.md
skills/06-design-system-skill.md
skills/16-accessibility-skill.md
```

## Criar formulário

Ler:

```txt
skills/07-form-skill.md
skills/17-ui-normalization-skill.md
skills/18-i18n-error-message-skill.md
skills/16-accessibility-skill.md
```

## Integrar endpoint ou service

Ler:

```txt
skills/08-service-api-skill.md
skills/12-error-handling-skill.md
skills/17-ui-normalization-skill.md
skills/18-i18n-error-message-skill.md
```

## Criar hook

Ler:

```txt
skills/09-hook-skill.md
skills/11-state-management-skill.md
skills/08-service-api-skill.md
```

## Criar rotas ou guards

Ler:

```txt
skills/10-routing-guard-skill.md
skills/11-state-management-skill.md
skills/12-error-handling-skill.md
```

## Alterar Design System

Ler:

```txt
skills/06-design-system-skill.md
skills/04-component-skill.md
skills/16-accessibility-skill.md
```

## Criar ou alterar tradução, enum, erro, máscara ou normalização

Ler:

```txt
skills/17-ui-normalization-skill.md
skills/18-i18n-error-message-skill.md
skills/07-form-skill.md
skills/08-service-api-skill.md
```

## Refatorar código

Ler:

```txt
skills/14-refactor-clean-code-skill.md
skills/01-project-architecture-skill.md
skills/02-typescript-quality-skill.md
skills/03-page-skill.md
skills/04-component-skill.md
skills/05-component-usage-skill.md
```

## Criar testes

Ler:

```txt
skills/13-testing-skill.md
skills/07-form-skill.md
skills/08-service-api-skill.md
skills/09-hook-skill.md
skills/10-routing-guard-skill.md
```

## Corrigir bug

Ler:

```txt
skills/02-typescript-quality-skill.md
skills/12-error-handling-skill.md
skills/14-refactor-clean-code-skill.md
```

Além disso, ler a skill da área afetada pelo bug.

---

# 6. Fluxo obrigatório antes de implementar

Antes de alterar código, o agente deve:

1. Ler `docs/ai-context.md`.
2. Ler as skills obrigatórias.
3. Identificar o tipo da tarefa.
4. Ler somente as skills específicas necessárias.
5. Ler a spec relacionada, se existir.
6. Verificar a estrutura atual do projeto.
7. Localizar componentes, hooks, services, schemas e utils já existentes.
8. Evitar criar duplicações.
9. Planejar os arquivos que serão criados ou alterados.
10. Implementar seguindo as regras.
11. Rodar validações disponíveis, quando possível.
12. Atualizar contexto apenas se houver decisão relevante.

---

# 7. Fluxo obrigatório para implementação de feature

Ao implementar uma feature, seguir esta ordem:

```txt
1. Ler SDD/spec da feature.
2. Identificar entidades e contratos.
3. Criar ou revisar schemas Zod.
4. Criar types derivados quando aplicável.
5. Criar services.
6. Criar normalizers.
7. Criar hooks.
8. Criar components específicos da feature.
9. Validar responsividade dos componentes (mobile, tablet, desktop).
10. Compor pages.
11. Validar responsividade das pages (mobile, tablet, desktop).
12. Registrar rotas e guards.
13. Conectar feedbacks, loading, empty, error e success.
14. Criar testes (incluindo testes de responsividade se crítico).
15. Validar regras de TypeScript, lint e arquitetura.
```

---

# 8. Estrutura obrigatória do frontend

O projeto deve seguir esta estrutura base:

```txt
src/
  app/
    providers/
    router/
    store/
    theme/
    guards/
    error-boundary/

  shared/
    components/
      data-display/
      feedback/
      form/
      layout/
      inputs/

    hooks/
    services/
    utils/
    types/
    schemas/
    constants/

    i18n/
      pt-BR/
        errors.ts
        enums.ts
        labels.ts
        validation.ts

    formatters/
    parsers/
    masks/
    normalizers/

    assets/

  features/
    auth/
      components/
      pages/
      hooks/
      services/
      schemas/
      types/
      normalizers/

    [feature-name]/
      components/
      pages/
      hooks/
      services/
      schemas/
      types/
      normalizers/

  pages/
  main.tsx
```

---

# 9. Responsabilidade das camadas

## `main.tsx`

Apenas inicializa a aplicação.

Permitido:

- `ReactDOM.createRoot`;
- `React.StrictMode`;
- `AppProviders`;
- `AppRouter`.

Proibido:

- chamada de API;
- lógica de autenticação;
- regra de negócio;
- estado de feature;
- configuração específica de tela.

## `app/providers`

Configura providers globais.

Exemplos:

- QueryProvider;
- ThemeProvider;
- RouterProvider;
- StoreProvider;
- SnackbarProvider;
- AuthProvider, se necessário.

## `app/router`

Define rotas e navegação.

Rotas não devem ficar espalhadas pelas features.

## `app/guards`

Centraliza proteção de rotas.

Exemplos:

- AuthGuard;
- GuestGuard;
- RoleGuard;
- PermissionGuard.

## `pages`

Pages apenas orquestram componentes, hooks e layout.

Pages não devem conter regra de negócio complexa.

## `features`

Contém regras, componentes, hooks, services, schemas e normalizers específicos de um domínio.

## `shared`

Contém recursos reutilizáveis no projeto inteiro.

Componentes em `shared` não devem depender de features.

---

# 10. Regras absolutas de TypeScript

É proibido:

```txt
any
as
as const
casting
type assertion
@ts-ignore
@ts-expect-error sem justificativa
eslint-disable
eslint-disable-line
eslint-disable-next-line
var
```

Também é proibido alterar configuração de ESLint ou TypeScript para permitir má prática.

Se o código viola uma regra, corrija o código.

Não silencie a regra.

## Preferências obrigatórias

- Usar `unknown` quando o tipo for realmente desconhecido.
- Usar narrowing.
- Usar type guards.
- Usar Zod para dados externos.
- Usar `z.infer` quando aplicável.
- Usar tipos explícitos quando necessário.
- Usar `Record<Union, Value>` para mapas.
- Usar `const` por padrão.
- Tipar props.
- Tipar retorno de services.
- Evitar duplicidade entre schema e type.

---

# 11. Regras para pages

Pages podem:

- compor layout;
- chamar hooks;
- renderizar estados de tela;
- passar props;
- conter componentes internos pequenos e específicos.

Pages não podem:

- chamar API;
- acessar storage diretamente;
- traduzir enum manualmente;
- aplicar máscara manualmente;
- converter data manualmente;
- converter moeda manualmente;
- montar payload manualmente;
- validar formulário manualmente;
- ter regra de negócio complexa;
- proteger rota diretamente;
- usar cores hardcoded;
- usar MUI cru se existir wrapper compartilhado.

---

# 12. Regras para componentes

Componentes devem:

- ter props tipadas;
- ter props padrão;
- permitir override;
- ser acessíveis;
- usar Material UI por baixo quando adequado;
- usar theme/tokens;
- ser previsíveis;
- ser reutilizáveis quando estiverem em `shared`.

Componentes não devem:

- chamar API;
- acessar storage;
- conter regra de negócio;
- conhecer detalhes do backend;
- traduzir erro técnico diretamente;
- conter cores hardcoded;
- conter regras específicas de uma feature se forem compartilhados.

---

# 13. Uso obrigatório de componentes compartilhados

Sempre preferir componentes compartilhados quando existirem:

```txt
AppList
AppHeader
AppFooter
AppDetails
AppFilter
AppForm
AppStepForm
AppInfo
AppLayout
AppDatePicker
AppButton
AppSnackbar
AppModal
AppCircularProgress
AppSkeleton
AppSelect
AppSidebar
AppTopbar
AppUpload
AppLoginForm
```

## Proibido

Usar diretamente em pages, quando houver wrapper compartilhado:

- `Button` do MUI;
- `Dialog` ou `Modal` do MUI;
- `Snackbar` do MUI;
- `Select` do MUI;
- DatePicker bruto;
- layout manual repetido.

---

# 14. Design System

Toda estilização deve vir do Design System.

Estrutura esperada:

```txt
app/theme/
  tokens/
    colors.ts
    typography.ts
    spacing.ts
    shadows.ts
    radius.ts

  mui/
    createAppTheme.ts
    palette.ts
    typography.ts
    components.ts

  ThemeProvider.tsx
```

## Proibido

- cor hardcoded;
- fonte hardcoded;
- espaçamento aleatório;
- estilo duplicado;
- dark/light mode fora do theme.

---

# 15. UI em português

Toda informação exibida ao usuário deve estar em português.

Isso inclui:

- labels;
- placeholders;
- mensagens de erro;
- mensagens de sucesso;
- validações;
- enums;
- status;
- botões;
- títulos;
- textos de empty state;
- mensagens de loading;
- mensagens de modal;
- tooltips.

Backend pode enviar valores em inglês.

UI sempre exibe em português.

---

# 16. Erros e mensagens

Mensagens devem ficar centralizadas em:

```txt
shared/i18n/pt-BR/errors.ts
shared/i18n/pt-BR/validation.ts
```

Ordem para exibir erro:

```txt
1. errorCode traduzido
2. message traduzido
3. fallback genérico
```

Nunca exibir mensagem técnica diretamente ao usuário.

## Proibido

```txt
toast(error.message)
alert(error.message)
```

## Correto

```txt
getUserFriendlyErrorMessage(error)
AppSnackbar
```

---

# 17. Enums

Enums vindos do backend devem ser traduzidos em:

```txt
shared/i18n/pt-BR/enums.ts
```

Nunca exibir enum cru para o usuário.

## Proibido

```txt
ACTIVE
INACTIVE
PENDING
APPROVED
REJECTED
```

## Correto

```txt
Ativo
Inativo
Pendente
Aprovado
Rejeitado
```

Usar funções de tradução centralizadas.

---

# 18. Máscaras, formatters, parsers e normalizers

Regra principal:

```txt
Usuário vê dado amigável.
Backend recebe dado limpo.
```

## Documento

```txt
UI: 123.456.789-00
API: 12345678900
```

## Telefone

```txt
UI: (11) 99999-9999
API: 11999999999
```

## Data

```txt
UI: 25/09/1900
API: 1900-09-25
```

## Moeda

```txt
UI: R$ 1.250,90
API: 1250.90
```

## Locais corretos

```txt
shared/formatters/
shared/parsers/
shared/masks/
shared/normalizers/
features/[feature]/normalizers/
```

Pages não devem fazer parse, format, mask ou normalização manual.

---

# 19. Formulários

Todo formulário deve usar:

- React Hook Form;
- Zod;
- componentes compartilhados;
- mensagens em português;
- normalizers para payload;
- masks para exibição;
- parsers para envio;
- AppSnackbar para feedback.

Forms específicos ficam dentro da feature.

Campos reutilizáveis ficam em `shared/components/form`.

---

# 20. Services

Toda chamada externa deve ficar em service.

Fluxo:

```txt
Page
  -> Hook
    -> Service
      -> HttpClient
        -> API
```

Services devem:

- chamar endpoints;
- validar dados externos quando necessário;
- normalizar erros;
- retornar tipos consistentes;
- não expor detalhes crus da API para a UI.

---

# 21. Hooks

Hooks devem encapsular:

- comportamento de tela;
- estado local complexo;
- integração com TanStack Query;
- integração com services;
- ações da tela;
- loading;
- error;
- success;
- filtros;
- paginação;
- ordenação;
- controle de modal;
- controle de snackbar.

Pages devem consumir hooks, não implementar lógica diretamente.

---

# 22. Estado global

Usar Zustand ou Context apenas para estado realmente global.

Pode ser global:

- usuário autenticado;
- permissões;
- tema;
- snackbar global;
- modal global;
- estado da sidebar;
- preferências globais.

Não deve ser global:

- estado temporário de formulário;
- dados já gerenciados pelo TanStack Query;
- filtros específicos de uma única tela, salvo decisão justificada;
- estado local simples.

---

# 23. Rotas e guards

Rotas ficam em:

```txt
app/router/
```

Guards ficam em:

```txt
app/guards/
```

Pages não devem proteger rotas diretamente.

Usar:

- AuthGuard;
- GuestGuard;
- RoleGuard;
- PermissionGuard, se necessário.

---

# 24. Estados de tela

Toda tela deve considerar:

- loading;
- skeleton;
- empty;
- error;
- success;
- unauthorized;
- forbidden;
- validation error;
- submitting;
- disabled;
- modal open/close;
- snackbar success/error.

---

# 25. Testes

O agente deve criar ou atualizar testes quando alterar lógica relevante.

Priorizar testes para:

- schemas;
- parsers;
- formatters;
- normalizers;
- services;
- hooks;
- forms;
- guards;
- componentes compartilhados;
- fluxos críticos.

Ferramentas esperadas:

- Vitest;
- Testing Library;
- MSW, quando necessário;
- Playwright, se houver E2E.

---

# 26. Acessibilidade

Todo código deve considerar:

- inputs com label;
- botões com texto ou aria-label;
- ícones com descrição quando necessário;
- modais com controle de foco;
- navegação por teclado;
- mensagens de erro associadas aos campos;
- contraste adequado;
- loading acessível quando necessário.

---

# 27. Refatoração

Ao refatorar, o agente deve:

1. Preservar comportamento existente.
2. Remover duplicação.
3. Reduzir responsabilidade de pages.
4. Extrair lógica para hooks.
5. Extrair API para services.
6. Extrair validações para schemas.
7. Extrair payload para normalizers.
8. Extrair textos para i18n.
9. Extrair estilo para theme.
10. Garantir que não introduziu `any`, `as`, `as const` ou disables.
11. Atualizar testes quando necessário.

---

# 28. SDD

Antes de implementar feature relevante, deve existir uma spec/SDD.

Se não existir, o agente deve gerar uma spec antes de implementar.

A spec deve conter:

- objetivo;
- rotas;
- entidades;
- endpoints;
- componentes;
- hooks;
- services;
- schemas;
- normalizers;
- enums;
- erros;
- máscaras;
- estados de tela;
- regras de negócio;
- permissões;
- testes;
- critérios de aceite.

---

# 29. Checklist antes de finalizar tarefa

Antes de concluir, o agente deve validar:

```txt
[ ] Li as skills obrigatórias.
[ ] Li a skill específica da tarefa.
[ ] Respeitei a arquitetura.
[ ] Não coloquei lógica de negócio em page.
[ ] Não chamei API em page ou componente.
[ ] Usei services para API.
[ ] Usei hooks para comportamento.
[ ] Usei schemas Zod para validação.
[ ] Usei normalizers para payload.
[ ] Usei componentes compartilhados quando existentes.
[ ] Não usei MUI cru em page quando existe wrapper.
[ ] Não usei cor hardcoded.
[ ] Não usei texto técnico para o usuário.
[ ] Enums são exibidos em português.
[ ] Erros são exibidos em português.
[ ] Campos mascarados enviam dados limpos.
[ ] Datas exibem dd/MM/yyyy e enviam yyyy-MM-dd.
[ ] Valores monetários exibem formatados e enviam limpos.
[ ] Não usei any.
[ ] Não usei as.
[ ] Não usei as const.
[ ] Não usei casting/type assertion.
[ ] Não usei @ts-ignore.
[ ] Não usei eslint-disable.
[ ] Testes foram criados ou atualizados quando necessário.
[ ] Atualizei contexto apenas se houve decisão relevante.
```

---

# 30. Instrução final para agentes

Ao receber uma tarefa:

1. Não comece codando imediatamente.
2. Identifique o tipo da tarefa.
3. Leia as skills obrigatórias.
4. Leia apenas as skills específicas necessárias.
5. Leia o contexto compacto do projeto.
6. Leia a spec/SDD quando existir.
7. Verifique se já existe componente, hook, service, schema ou util relacionado.
8. Implemente com o menor escopo seguro.
9. Não duplique padrões.
10. Não viole as regras proibidas.
11. Não silencie lint ou TypeScript.
12. Não invente arquitetura fora do padrão.
13. Não coloque regra de negócio em page.
14. Não exponha termos técnicos ao usuário final.
15. Finalize com validação e checklist.

Este projeto prioriza previsibilidade, padronização, qualidade, manutenção e experiência do usuário em português.

---

# 31. Fluxo obrigatório de encerramento (quality gate)

Antes de declarar qualquer tarefa como concluída, o agente deve obrigatoriamente executar:

```txt
1. Auditoria de compliance (26-automated-compliance-skill)
2. npm run lint
3. npm run typecheck
4. npm test
```

## Regra de conclusão

- A tarefa só pode ser considerada concluída quando os 4 passos estiverem verdes.
- Se qualquer passo falhar, o agente deve corrigir e rodar novamente.
- Não é permitido encerrar com validação parcial.
- Auditoria de compliance é obrigatória (nunca pular).
- Também é obrigatório validar textos/UI sem caracteres corrompidos (ex.: `U+FFFD`) antes de concluir.
- Se houver caractere de substituição em código, testes, labels, mensagens, enums ou i18n, a tarefa não pode ser encerrada até corrigir.

## Regra de aliases

O agente deve usar aliases de projeto em `src` e `tests`.

Não deve usar import relativo profundo como `../../src/...` quando houver alias disponível.

Sempre manter coerência de aliases entre:

- `tsconfig.app.json` (`paths`)
- `vite.config.ts` (`resolve.alias`)
- `vitest.config.ts` (`resolve.alias`)

## Regra para mocks em testes

- `vi.mock(...)` deve usar o mesmo specifier usado no import real.
- Não misturar alias com caminho relativo profundo para o mesmo módulo.

## Regra de estados de tela por page

Cada page deve tratar explicitamente, quando aplicável:

- `loading`
- `error`
- `empty`
- `unauthorized`
- `forbidden`
- `submitting`
- `disabled`
- `modal`
- `snackbar`

## Regra de higiene estrutural

- Não manter pastas vazias sem uso.
- Se uma pasta prevista não for usada, remover ou justificar com arquivo útil.
- Não criar `index.ts` apenas para reexport.
