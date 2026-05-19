# .ai-skills — Skills de Desenvolvimento

Conjunto de skills em Markdown que orienta agentes de IA, desenvolvedores e revisores de PR a implementar e avaliar código neste projeto com consistência.

O ponto de entrada principal é o `AGENTS.md` na raiz do projeto — ele define quais skills carregar por tipo de tarefa e o fluxo obrigatório antes de implementar qualquer coisa.

---

## Como usar

**Para agentes de IA:** ler `AGENTS.md` antes de qualquer tarefa. Ele instrui quais skills carregar por contexto.

**Para desenvolvedores:** consultar as skills da área de trabalho antes de implementar. Não é necessário ler tudo — carregar apenas o que é relevante para a tarefa.

**Para revisores:** usar as skills como critério de revisão de PR. O checklist em `checklists/pull-request-checklist.md` resume os pontos obrigatórios.

### Ordem de leitura por tarefa

1. `docs/ai-context.md` — contexto compacto do projeto
2. `skills/00-global-rules.md` — sempre obrigatório
3. Skills específicas da tarefa (ver tabela abaixo)
4. Spec da feature em `specs/features/[feature].md` se existir

Não carregar todas as skills em toda tarefa — isso desperdiça contexto sem agregar.

---

## Skills por tipo de tarefa

| Tarefa | Skills a carregar |
|--------|------------------|
| Qualquer tarefa | `00-global-rules` · `01-project-architecture` · `02-typescript-quality` |
| List page | `03-page` · `09-hook` · `27-list-page-canonical` |
| Details page | `03-page` · `09-hook` · `29-details-page-canonical` |
| Form page (create/edit) | `07-form` · `09-hook` · `28-form-page-canonical` |
| Wizard multi-etapa | `30-step-wizard` · `07-form` · `09-hook` |
| Service / endpoint | `08-service-api` |
| Hook | `09-hook` · `11-state-management` |
| Componente compartilhado | `04-component` · `05-component-usage` · `06-design-system` |
| Formulário | `07-form` · `17-ui-normalization` · `18-i18n-error-message` |
| Refatoração | `14-refactor-clean-code` · `03-page` · `09-hook` |
| Rotas e guards | `10-routing-guard` |
| Testes | `13-testing` · `08-service-api` · `09-hook` |
| Qualquer tarefa (compliance) | `20-lint-config` · `21-quality-gate` · `26-automated-compliance` |

---

## Índice de skills

### Regras globais e arquitetura

| Arquivo | O que define |
|---------|-------------|
| `00-global-rules.md` | Regras globais: naming, proibições, padrões invioláveis |
| `01-project-architecture-skill.md` | Camadas, responsabilidades, organização de pastas |
| `02-typescript-quality-skill.md` | TypeScript strict: proibições de `any`, `as`, casting |

### Pages, hooks e serviços

| Arquivo | O que define |
|---------|-------------|
| `03-page-skill.md` | Os 3 padrões de page: list, details, form |
| `07-form-skill.md` | Create/edit separados, location.state, normalizers |
| `08-service-api-skill.md` | Estrutura obrigatória de 3 arquivos: endpoints + types + service |
| `09-hook-skill.md` | Anti-padrões críticos, separação dados/página |
| `10-routing-guard-skill.md` | Rotas, guards, proteção de contexto |
| `11-state-management-skill.md` | Zustand, Context, quando usar estado global |

### Exemplos canônicos completos

| Arquivo | O que define |
|---------|-------------|
| `27-list-page-canonical-skill.md` | Exemplo completo de list page (todos os 4 arquivos) |
| `28-form-page-canonical-skill.md` | Exemplo completo de form page (create + edit separados) |
| `29-details-page-canonical-skill.md` | Exemplo completo de details page |
| `30-step-wizard-skill.md` | Padrão StepperWizard / formulários multi-etapa |

### Componentes e Design System

| Arquivo | O que define |
|---------|-------------|
| `04-component-skill.md` | Como criar componentes compartilhados |
| `05-component-usage-skill.md` | Quando usar cada shared component |
| `06-design-system-skill.md` | Tokens, tema, proibição de hardcode |
| `16-accessibility-skill.md` | Labels, foco, aria, navegação por teclado |
| `23-screen-states-skill.md` | loading, error, empty, submitting, disabled |

### Dados, formulários e normalização

| Arquivo | O que define |
|---------|-------------|
| `17-ui-normalization-skill.md` | Máscaras, parsers, formatters, normalizers |
| `18-i18n-error-message-skill.md` | Mensagens de erro, enums e labels em PT-BR |
| `25-ptbr-text-quality-skill.md` | Qualidade textual, encoding, consistência de idioma |

### Qualidade e compliance

| Arquivo | O que define |
|---------|-------------|
| `12-error-handling-skill.md` | Tratamento de erros, feedback ao usuário |
| `13-testing-skill.md` | Vitest, Testing Library, MSW, cobertura prioritária |
| `14-refactor-clean-code-skill.md` | Anti-padrões P1–P6 com exemplos e estratégias |
| `20-lint-config-skill.md` | Regras ESLint por camada, o que é bloqueado automaticamente |
| `21-quality-gate-skill.md` | Fluxo obrigatório antes de concluir tarefa |
| `22-import-alias-skill.md` | Aliases de import, proibição de relativos profundos |
| `24-structure-hygiene-skill.md` | Higiene de pastas e arquivos |
| `26-automated-compliance-skill.md` | Como usar o compliance scan |

### Processo e documentação

| Arquivo | O que define |
|---------|-------------|
| `15-sdd-skill.md` | Specification Driven Development, quando gerar spec |
| `19-context-management-skill.md` | Economia de contexto, leitura seletiva |

---

## Estrutura de arquivos

```
.ai-skills/
  skills/          → regras, padrões e exemplos (30 skills)
  docs/
    ai-context.md          → contexto compacto do projeto para carregar em qualquer tarefa
    architecture-summary.md → resumo da arquitetura
    project-decisions.md    → decisões técnicas registradas
  specs/
    templates/
      feature-spec-template.md → template de SDD para novas features
    features/                  → specs das features implementadas
  checklists/
    pull-request-checklist.md  → checklist de revisão de PR
```
