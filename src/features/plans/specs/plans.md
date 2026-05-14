# Spec - Plans

## Objetivo

Gerenciar planos da plataforma com listagem, criação, edição, detalhamento e exclusão, mantendo UI em português e fluxo `Page -> Hook -> Service -> HttpClient`.

## Rotas

- `/platform/plans`: lista planos.
- `/platform/plans/new`: cria plano.
- `/platform/plans/:id`: exibe detalhes.
- `/platform/plans/:id/edit`: edita plano.

## Entidade

- `Plan`: `id`, `name`, `description`, `price`, `currency`, `billingCycle`, `trialDays`, `isActive`, datas de auditoria.
- `billingCycle`: `monthly` ou `yearly`, exibido como `Mensal` ou `Anual`.

## Camadas

- Pages: `src/features/plans/pages`.
- Hooks: `src/features/plans/hooks`.
- Services: `src/features/plans/services`.
- Schemas: `src/features/plans/schemas`.
- Types: `src/features/plans/types`.
- Normalizers: `src/features/plans/normalizers`.

## Regras de UI

- Textos em PT-BR.
- Estados de tela: loading, error, empty, submitting e feedback de ação.
- Não importar MUI cru dentro de `src/features`.
- Usar componentes compartilhados para inputs, botões, feedback e layout.

## Normalização

- `price` pode ser digitado em formato amigável e é enviado limpo.
- `currency` é enviada em maiúsculas.
- `description` vazia é enviada como `undefined`.

## Testes

- Normalizers de payload.
- Hooks de listagem/mutação quando alterados.
- Pages e estados críticos quando houver mudança visual relevante.

## Critérios de aceite

- Sem tipagem insegura, coerção manual de tipo, constantes assertivas ou comentários de bypass.
- Sem import relativo profundo.
- Sem MUI cru em `src/features`.
- Compliance, lint, typecheck e testes verdes.
