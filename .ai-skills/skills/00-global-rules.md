# 00 — Global Rules

## Objetivo

Definir as regras obrigatórias para qualquer código, documentação, spec ou alteração gerada no projeto.

## Regras obrigatórias

- Seguir Clean Architecture.
- Seguir Clean Code.
- Seguir Specification Driven Development.
- Usar componentes compartilhados existentes antes de criar novos.
- Usar Design System para cores, espaçamentos, sombras, bordas e tipografia.
- Usar TypeScript estrito.
- Usar Zod para validação de dados externos e formulários.
- Usar React Hook Form para formulários.
- Usar services para APIs e integrações externas.
- Usar hooks para lógica de comportamento e estado de interface.
- Usar guards para autenticação, autorização e proteção de rotas.
- Exibir todo texto para usuário em português.
- Normalizar dados antes de enviar ao backend.

## Proibido

- `any`.
- `as`.
- `as const`.
- Casting/type assertion.
- `@ts-ignore`.
- `@ts-expect-error` sem justificativa formal e aprovação.
- `eslint-disable`.
- `eslint-disable-line`.
- `eslint-disable-next-line`.
- Desativar regras do ESLint por arquivo.
- Alterar configuração do ESLint para permitir má prática.
- Regra de negócio em page.
- Regra de negócio em componente visual.
- API dentro de page.
- API dentro de componente visual.
- MUI cru em page quando existe wrapper compartilhado.
- Cor hardcoded.
- Typography hardcoded.
- Layout duplicado.
- `main.tsx` com lógica de aplicação.
- Exibir erro técnico do backend diretamente.
- Exibir enum em inglês para o usuário.

## Nomenclatura de variáveis e parâmetros

Toda variável, parâmetro, propriedade e callback deve ser **autodescritivoa** — quem lê não pode precisar rastrear o contexto para entender o que ela contém.

### Proibido — abreviações ambíguas

```ts
// ❌ — q, p, res, id como nome de timer, e, ev são proibidos
const res = await service.list(query);
const id = window.setTimeout(...);
setQuery((q) => ({ ...q, ...patch }));
onPageChange={(p) => updateQuery({ page: p + 1 })}
```

### Correto

```ts
// ✅ — nomes que descrevem o conteúdo
const response = await service.list(queryParams);
const timeoutId = window.setTimeout(...);
setQueryParams((current) => ({ ...current, ...patch }));
onPageChange={(pageIndex) => updateQueryParams({ page: pageIndex + 1 })}
```

### Regras de nomenclatura

- Parâmetros de callback devem nomear o que representam: `pageIndex`, `rowsPerPage`, `filterKey`, `filterValue`, `feature`, `currentQuery`.
- Variáveis de resultado de `await` devem nomear o conteúdo: `response`, `fetchedEntity`, `createdRecord`.
- IDs de timer devem ser `timeoutId`, `intervalId` — nunca `id` (ambíguo com id de entidade).
- Nunca usar letra única como nome de variável fora de índices em `for` clássico.
- Estado derivado do `useState` deve ter nome que descreva o domínio: `queryParams`, `pagination`, `featurePendingDelete` — nunca `query`, `meta`, `item`.

## Constantes de módulo

Constantes de módulo (`const UPPER_CASE`) são permitidas apenas para valores genuinamente compartilhados e imutáveis (ex: `ROUTES`, `STATUS_OPTIONS`). É proibido usar constante de módulo para:

- Configuração de UI específica de uma tela (`const CONTENT = { pageTitle: ... }`).
- Valores que podem ser inlined no `useState` ou na props sem perda de legibilidade.

```ts
// ❌ — constante de módulo para config de UI de uma tela
const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };
const CONTENT: EntityDetailsPageContent = { pageTitle: 'Detalhes', ... };

// ✅ — inlined onde usado
const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
```

## Ordem de prioridade em conflitos

1. Segurança de tipo e arquitetura.
2. Clareza e manutenção.
3. Reutilização de componentes.
4. Experiência do usuário.
5. Performance.

## Regra de correção

Se o código viola uma regra, corrija o código. Não silencie TypeScript, ESLint ou testes.
