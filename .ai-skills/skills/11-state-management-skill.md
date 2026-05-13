# 11 — State Management Skill

## Objetivo

Definir onde cada tipo de estado deve ficar e evitar uso indevido de estado global.

## Estado local

Usar `useState` quando o estado pertence somente ao componente.

Exemplos:

- Abrir/fechar popover local.
- Valor temporário de campo local.
- Aba selecionada em componente isolado.

## Estado de formulário

Usar React Hook Form.

Exemplos:

- Campos de cadastro.
- Validação.
- Dirty state.
- Submit state.

## Estado de servidor

Usar TanStack Query.

Exemplos:

- Listas vindas da API.
- Detalhes de entidade.
- Cache de requests.
- Refetch/invalidation.

## Estado global

Usar Zustand ou Context apenas para estado realmente global.

Pode ficar global:

- Usuário autenticado.
- Tema.
- Permissões.
- Snackbar global.
- Modal global.
- Sidebar aberta/fechada.

Não deve ficar global:

- Estado temporário de formulário.
- Filtros específicos de uma tela, salvo quando precisam persistir entre telas.
- Dados que já estão no TanStack Query.
- Estados internos de componentes isolados.

## Proibido

- Colocar tudo no Zustand.
- Duplicar estado do TanStack Query no store global.
- Guardar payload de formulário globalmente sem necessidade.
- Criar Context para cada feature sem justificativa.
