# 24 — Structure Hygiene Skill

## Objetivo

Manter estrutura limpa, sem ruído arquitetural e sem pastas “mortas”.

## Regras

- Não manter pastas vazias sem uso real.
- Se uma pasta prevista na arquitetura não for usada:
  - remover a pasta, ou
  - criar arquivo útil com propósito claro.
- Evitar arquivos duplicados de utilitário com a mesma responsabilidade.
- Evitar estruturas temporárias esquecidas.

## Checklist de higiene antes de concluir

1. Verificar pastas vazias em `src/`.
2. Verificar utilitários duplicados por responsabilidade.
3. Verificar imports órfãos após refactor.
4. Rodar `lint`, `typecheck` e `test`.

## Proibido

- Deixar pasta vazia “só para existir”.
- Introduzir estrutura sem uso concreto.
- Criar `index.ts` apenas para reexportar módulos.
