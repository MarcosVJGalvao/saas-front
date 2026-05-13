# 23 — Screen States Skill

## Objetivo

Garantir previsibilidade de UX com estados explícitos de tela.

## Estados obrigatórios por page

Cada page deve avaliar, conforme o fluxo:

- `loading`
- `error` genérico
- `empty`
- `unauthorized`
- `forbidden`
- `success` (quando aplicável)
- `submitting` e `disabled` (quando houver formulário)
- `modal open/close` (quando houver modal)
- `snackbar success/error` (quando houver feedback)

## Regras

- Não concentrar todos os erros no mesmo fallback quando houver semântica diferente.
- `UNAUTHORIZED` e `FORBIDDEN` devem ter tratamento explícito na UI.
- `empty` deve ser diferente de `error`.
- Page deve apenas orquestrar estados; regras de derivação ficam no hook.

## Evidência obrigatória no fechamento

Listar no resumo final quais estados foram implementados/validados por page alterada.
