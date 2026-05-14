# Spec - Platform Auth

## Objetivo

Autenticar usuários administrativos da plataforma com login, MFA e configuração inicial de TOTP.

## Rotas

- `/platform/login`: login da plataforma.
- `/platform/mfa`: validação de MFA.
- `/platform/mfa/setup`: configuração inicial de TOTP.

## Camadas

- Pages: `src/features/platform-auth/pages`.
- Hooks: `src/features/platform-auth/hooks`.
- Services: `src/features/platform-auth/services`.
- Layout compartilhado: `src/shared/components/layout/PlatformAuthPageLayout`.

## Fluxo

```txt
Page -> Hook -> Service -> HttpClient -> API
```

## Estados

- Loading durante submit.
- Redirecionamento quando a sessão já existe.
- Redirecionamento quando o desafio MFA expira ou não existe.
- Erros normalizados por `ErrorHandler` e exibidos por provider global.

## Critérios de aceite

- Sem import de MUI cru em `src/features`.
- Sem import relativo profundo.
- Textos de UI em português.
- Compliance, lint, typecheck e testes verdes.
