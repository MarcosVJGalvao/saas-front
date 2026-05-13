# 12 — Error Handling Skill

## Objetivo

Padronizar captura, normalização, tradução e exibição de erros para o usuário.

## Regras

- Usar Error Boundary global.
- Services devem normalizar erros.
- UI deve exibir mensagens amigáveis.
- Erros técnicos não devem aparecer diretamente para o usuário.
- Form errors devem vir do React Hook Form/Zod.
- Feedbacks devem usar `AppSnackbar`.
- Estados de erro de tela devem usar `AppErrorState`.
- Erros de API devem ser traduzidos por `errorCode`, depois por `message`, depois por fallback.

## Estrutura

```txt
app/error-boundary/
  AppErrorBoundary.tsx

shared/errors/
  AppError.ts
  normalizeApiError.ts
  getUserFriendlyErrorMessage.ts

shared/i18n/pt-BR/
  errors.ts
```

## Ordem de tradução

1. `errorCode`.
2. `message` traduzido.
3. Fallback genérico.

## Proibido

```tsx
toast(error.message);
```

## Correto

```tsx
toast(getUserFriendlyErrorMessage(error));
```

## Tipos de erro

- Erro de validação de formulário.
- Erro de autenticação.
- Erro de autorização.
- Erro de rede.
- Erro inesperado.
- Erro de regra de negócio do backend.

## Mensagem padrão

Sempre existir fallback em português:

```txt
Ocorreu um erro inesperado. Tente novamente.
```
