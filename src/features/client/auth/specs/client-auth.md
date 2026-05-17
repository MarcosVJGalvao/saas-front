# Spec - Client Auth

## Objetivo

Autenticar usuários do domínio cliente e carregar dados básicos do painel do cliente autenticado.

## Rotas

- `/client/login`: login do cliente.
- `/client/forgot-password`: solicitação de redefinição de senha.
- `/client/reset-password`: redefinição de senha.

## Camadas

- Pages: `src/features/client-auth/pages`.
- Hooks: `src/features/client-auth/hooks`.
- Services: `src/features/client-auth/services`.
- Layout compartilhado: `src/shared/components/layout/PlatformAuthPageLayout`.

## Fluxo

```txt
Page -> Hook -> Service -> HttpClient -> API
```

## Estados

- Loading durante submit.
- Feedback de erro normalizado.
- Perfil e dados do painel carregados por hook.
- Logout centralizado em hook.

## Critérios de aceite

- Sem import de MUI cru em `src/features`.
- Sem import relativo profundo.
- Textos de UI em português.
- Compliance, lint, typecheck e testes verdes.
