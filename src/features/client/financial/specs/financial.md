# Financeiro

## Objetivo

Gerenciar contas a pagar, contas a receber, categorias, centros de custo, transações, dashboard e relatórios.

## Rotas

- `/client/financial/dashboard`
- `/client/financial/accounts-payable`
- `/client/financial/accounts-receivable`
- `/client/financial/categories`
- `/client/financial/cost-centers`
- `/client/financial/transactions`
- `/client/financial/reports`

## Estados da tela

- loading
- empty
- error
- forbidden
- submitting
- modal

## Normalização

- Moeda exibida em PT-BR e enviada como número limpo.
- Datas enviadas em `yyyy-MM-dd`.

## Critérios de aceite

- Ações de pagar, receber e cancelar usam modal de confirmação.
- Relatórios e dashboard usam Design System.
