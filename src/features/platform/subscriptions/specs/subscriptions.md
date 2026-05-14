# Spec - Subscriptions

## Objetivo

Gerenciar assinaturas da plataforma com listagem, criação, edição, detalhamento, cancelamento e histórico de plano.

## Rotas

- `/platform/subscriptions`: lista assinaturas.
- `/platform/subscriptions/new`: cria assinatura.
- `/platform/subscriptions/:id`: exibe detalhes usando `tenantId` na query.
- `/platform/subscriptions/:id/edit`: edita assinatura usando `tenantId` na query.

## Entidade

- `Subscription`: vínculo entre tenant e plano.
- Status: ativo, cancelado, pagamento pendente, em teste ou bloqueado.
- Valores de backend são traduzidos por `shared/i18n/pt-BR/enums`.

## Camadas

- Pages: `src/features/subscriptions/pages`.
- Hooks: `src/features/subscriptions/hooks`.
- Services: `src/features/subscriptions/services`.
- Schemas: `src/features/subscriptions/schemas`.
- Types: `src/features/subscriptions/types`.
- Normalizers: `src/features/subscriptions/normalizers`.

## Fluxo

```txt
Page -> Hook -> Service -> HttpClient -> API
```

## Normalização

- `priceAtSubscription` é enviado em formato numérico limpo.
- Datas de UI são normalizadas para `yyyy-MM-dd`.
- Campos opcionais vazios são removidos do payload.

## Estados de tela

- Loading de detalhes.
- Erro com retry.
- Empty quando a assinatura não existe.
- Loading/submitting em formulários.
- Modal de cancelamento na listagem.
- Dialog de histórico de plano na listagem.

## Critérios de aceite

- Sem import de MUI cru em `src/features`.
- Sem import relativo profundo.
- Mensagens e enums em português.
- Compliance, lint, typecheck e testes verdes.
