# Pull Request Checklist

## Arquitetura

- [ ] A page apenas orquestra componentes e hooks.
- [ ] Não há chamada de API dentro de page.
- [ ] Não há regra de negócio em componente visual.
- [ ] Services concentram integrações externas.
- [ ] Hooks concentram comportamento da tela.
- [ ] Guards concentram autenticação/autorização.
- [ ] `main.tsx` continua limpo.

## TypeScript

- [ ] Não usei `any`.
- [ ] Não usei `as`.
- [ ] Não usei `as const`.
- [ ] Não usei casting/type assertion.
- [ ] Não usei `@ts-ignore`.
- [ ] Não usei `@ts-expect-error` sem justificativa.
- [ ] Não usei `eslint-disable`.
- [ ] Todos os retornos importantes estão tipados.

## UI e Design System

- [ ] Não usei cor hardcoded.
- [ ] Não usei typography hardcoded.
- [ ] Usei componentes compartilhados quando disponíveis.
- [ ] Não usei MUI cru em page quando existe wrapper.
- [ ] Estados de loading, erro e vazio foram tratados.

## Responsividade

- [ ] Componentes usam apenas breakpoints globais (`mobile`, `tablet`, `desktop`).
- [ ] Sem `xs`, `sm`, `md`, `lg`, `xl` em código novo ou alterado.
- [ ] Usei helper `responsive()` para fallback correto quando aplicável.
- [ ] Testei em mobile, tablet e desktop (ou validei visualmente).
- [ ] Layout não quebra em nenhum breakpoint.
- [ ] Reutilizei tokens de `app/theme/tokens/breakpoints.ts`.

## Formulários e dados

- [ ] Formulários usam React Hook Form.
- [ ] Validações usam Zod.
- [ ] Datas exibem `dd/MM/yyyy` e enviam `yyyy-MM-dd`.
- [ ] Documento e telefone exibem máscara e enviam apenas dígitos.
- [ ] Moedas exibem formatadas e enviam limpas.
- [ ] Payload foi normalizado fora da page.

## i18n e erros

- [ ] Todo texto exibido ao usuário está em português.
- [ ] Não há caracteres corrompidos de encoding (ex.: `U+FFFD`) em UI, testes, i18n, enums e mensagens.
- [ ] Enums vindos do backend foram traduzidos.
- [ ] Erros técnicos não são exibidos diretamente.
- [ ] Mensagens de erro usam `errorCode`, `message` traduzida ou fallback.

## Testes

- [ ] Testei normalizers/parsers/formatters importantes.
- [ ] Testei formulários críticos.
- [ ] Testei componentes compartilhados alterados.
- [ ] Testei fluxos de erro quando aplicável.

## Compliance obrigatório (26-automated-compliance-skill)

Antes de finalizar, executar os comandos abaixo e confirmar que todos passam:

```bash
npm run lint
npm run typecheck
npm test
```

Também validar estaticamente:

```bash
# Sem violações proibidas
rg -n "\bas\b|as const|\bany\b|@ts-ignore|eslint-disable" src tests

# Sem imports relativos profundos
rg -n "\.\./\.\./|\.\./\.\./\.\./" src tests

# Sem dependência shared -> features
rg -n "@features/" src/shared

# Sem MUI cru em features
rg -n "from '@mui/material'" src/features

# Sem caracteres corrompidos
rg -n "caractere_substituicao|mojibake" src tests .ai-skills AGENTS.md
```

Checklist final:

- [ ] Lint passou.
- [ ] Typecheck passou.
- [ ] Testes passaram.
- [ ] Sem violações proibidas (any, as, eslint-disable).
- [ ] Sem imports relativos profundos onde alias existe.
- [ ] Sem dependência shared -> features.
- [ ] Sem caracteres corrompidos/encoding inválido.
- [ ] Auditoria visual de compliance concluída.
