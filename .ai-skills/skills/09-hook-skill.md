# 09 — Hook Skill

## Objetivo

Encapsular lógica de estado, efeitos, comportamento de interface, chamadas a services e integração com libs como TanStack Query.

## Regras

- Hooks controlam comportamento da tela ou componente.
- Hooks podem chamar services.
- Hooks podem usar TanStack Query, Zustand ou Context.
- Hooks devem esconder complexidade da page.
- Hooks devem ter nomes claros.
- Hooks devem retornar uma API simples e tipada.
- Hooks de feature devem exportar tipo/interface explícita de retorno (`UseXxxResult`).
- Pages não devem montar mensagens de erro manualmente quando o hook puder devolver erro pronto.
- Hooks não devem renderizar JSX.
- Hooks não devem conter estilos.
- Hooks não devem acessar storage diretamente se existir service da feature para isso.

## Exemplos

- `useUsersPage`
- `useUserForm`
- `useAuth`
- `useThemeMode`
- `useSnackbar`
- `useModal`
- `useFileUpload`
- `usePagination`
- `useFilters`

## Quando criar hook

Criar hook quando houver:

- Estado reutilizável.
- Efeito complexo.
- Chamada de service.
- Integração com query/cache.
- Lógica de formulário.
- Lógica de filtro/paginação.
- Controle de modal/snackbar.

## Proibido

- Hook com responsabilidade demais.
- Hook retornando dados sem tipagem.
- Hook com regra visual acoplada demais.
- Hook manipulando DOM diretamente sem necessidade.
- Hook fazendo tradução manual que deveria estar no i18n.
