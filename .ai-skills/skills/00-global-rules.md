# 00 — Global Rules

## Objetivo

Definir as regras obrigatórias para qualquer código, documentação, spec ou alteração gerada no projeto.

## Regras obrigatórias

- Seguir Clean Architecture.
- Seguir Clean Code.
- Seguir Specification Driven Development.
- Usar componentes compartilhados existentes antes de criar novos.
- Usar Design System para cores, espaçamentos, sombras, bordas e tipografia.
- Usar TypeScript estrito.
- Usar Zod para validação de dados externos e formulários.
- Usar React Hook Form para formulários.
- Usar services para APIs e integrações externas.
- Usar hooks para lógica de comportamento e estado de interface.
- Usar guards para autenticação, autorização e proteção de rotas.
- Exibir todo texto para usuário em português.
- Normalizar dados antes de enviar ao backend.

## Proibido

- `any`.
- `as`.
- `as const`.
- Casting/type assertion.
- `@ts-ignore`.
- `@ts-expect-error` sem justificativa formal e aprovação.
- `eslint-disable`.
- `eslint-disable-line`.
- `eslint-disable-next-line`.
- Desativar regras do ESLint por arquivo.
- Alterar configuração do ESLint para permitir má prática.
- Regra de negócio em page.
- Regra de negócio em componente visual.
- API dentro de page.
- API dentro de componente visual.
- MUI cru em page quando existe wrapper compartilhado.
- Cor hardcoded.
- Typography hardcoded.
- Layout duplicado.
- `main.tsx` com lógica de aplicação.
- Exibir erro técnico do backend diretamente.
- Exibir enum em inglês para o usuário.

## Ordem de prioridade em conflitos

1. Segurança de tipo e arquitetura.
2. Clareza e manutenção.
3. Reutilização de componentes.
4. Experiência do usuário.
5. Performance.

## Regra de correção

Se o código viola uma regra, corrija o código. Não silencie TypeScript, ESLint ou testes.
