# React + Vite + TypeScript + IA — Skills de Desenvolvimento

Este pacote contém um conjunto de skills em Markdown para orientar uma IA, um time de desenvolvimento ou um processo de revisão de código em um projeto frontend com:

- React
- Vite
- TypeScript
- Material UI
- Recharts
- Zod
- React Hook Form
- Clean Code
- Clean Architecture
- Specification Driven Development
- Design System
- i18n em português
- Normalização de UI/payload

## Como usar

Use estes arquivos como referência em prompts, documentação interna, revisões de PR, checklists ou instruções de um agente de IA.

Sugestão de uso por tarefa:

1. Sempre carregar `skills/00-global-rules.md`.
2. Carregar `docs/ai-context.md` como contexto curto do projeto.
3. Carregar apenas as skills relacionadas à tarefa atual.
4. Carregar apenas a spec da feature atual.
5. Evitar carregar todas as skills em toda tarefa para economizar tokens.

## Estrutura

```txt
skills/
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

docs/
  ai-context.md
  architecture-summary.md
  project-decisions.md

specs/templates/
  feature-spec-template.md

checklists/
  pull-request-checklist.md
```
