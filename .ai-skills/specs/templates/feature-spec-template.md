# Feature Spec Template

## Feature

Nome da feature.

## Objetivo

Descrever o objetivo da tela/fluxo.

## Rotas

- `/exemplo`
- `/exemplo/:id`

## Componentes usados

### Shared

- AppLayout
- AppButton
- AppList
- AppFilter
- AppSnackbar
- AppModal
- AppSkeleton

### Feature

- FeatureHeader
- FeatureList
- FeatureForm

## Estados da tela

- loading
- empty
- error
- success
- unauthorized
- forbidden

## Regras de negócio

- Regra 1.
- Regra 2.

## Contratos de dados

### Entidade

```ts
type Entity = {
  id: string;
  name: string;
};
```

## Schemas Zod

Descrever schemas necessários.

## Services necessários

- getItems
- getItemById
- createItem
- updateItem
- deleteItem

## Hooks necessários

- useItemsPage
- useItemForm

## Normalização de UI e payload

Descrever campos que possuem máscara, tradução ou parse.

| Campo    | UI              | Backend     |
| -------- | --------------- | ----------- |
| document | 123.456.789-00  | 12345678900 |
| phone    | (11) 99999-9999 | 11999999999 |
| date     | 25/09/1900      | 1900-09-25  |
| amount   | R$ 1.250,90     | 1250.9      |

## Mensagens de erro

| errorCode/message   | Mensagem em português      |
| ------------------- | -------------------------- |
| INVALID_CREDENTIALS | E-mail ou senha inválidos. |

## Enums exibidos ao usuário

| Backend  | UI      |
| -------- | ------- |
| ACTIVE   | Ativo   |
| INACTIVE | Inativo |

## Critérios de aceite

- [ ] Deve carregar dados.
- [ ] Deve exibir loading.
- [ ] Deve exibir erro amigável.
- [ ] Deve validar formulário.
- [ ] Deve enviar payload normalizado.

## Testes esperados

- Teste de renderização.
- Teste de formulário.
- Teste de normalização.
- Teste de erro.
- Teste de permissão.
