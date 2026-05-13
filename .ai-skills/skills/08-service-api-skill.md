# 08 — Service API Skill

## Objetivo

Centralizar comunicação externa, evitar API dentro da UI e garantir validação/normalização de dados.

## Regras

- Toda chamada HTTP deve ficar em service.
- Nenhuma page chama API diretamente.
- Nenhum componente visual chama API diretamente.
- Services devem validar resposta externa com Zod quando necessário.
- Services devem retornar dados tratados para a aplicação.
- Erros devem ser normalizados.
- Tokens, headers e autenticação técnica devem ficar no `httpClient` ou service adequado.
- Services não devem exibir snackbar diretamente.

## Estrutura

```txt
shared/services/
  httpClient.ts
  storageService.ts
  authStorageService.ts

features/users/services/
  userService.ts
```

## Fluxo

```txt
Page
  -> Hook
    -> Service
      -> HttpClient
        -> API
```

## DTOs e domínio

- DTO representa o contrato externo.
- Types da aplicação representam o modelo usado pela UI.
- Mappers podem ser usados quando backend e UI tiverem formatos diferentes.

## Proibido

```tsx
await fetch('/api/users');
```

Dentro de page ou componente visual.

## Correto

```ts
const users = await userService.getUsers(filters);
```
