# 09 — Hook Skill

## Objetivo

Encapsular lógica de estado, efeitos, comportamento de interface, chamadas a services e integração com libs externas. O hook é a única camada que pode fazer isso — pages e componentes não.

## Regras

- Hooks controlam comportamento da tela ou componente.
- Hooks podem chamar services.
- Hooks podem usar Context.
- Hooks devem esconder complexidade da page.
- Hooks devem ter nomes claros e autodescritivoos.
- Hooks devem retornar uma API simples e tipada.
- Hooks de feature devem exportar tipo/interface explícita de retorno (`UseXxxResult`).
- Pages não devem montar mensagens de erro manualmente quando o hook puder devolver erro pronto.

## Anti-padrões críticos — proibido

### Hook exportando componente React

O arquivo de hook (`use*.ts`) tem uma única responsabilidade: encapsular estado e lógica. Exportar um componente React de dentro de um hook mistura camadas e viola SRP.

```tsx
// ❌ ERRADO — hook exporta componente
export const useFeatureDetailsPage = () => { ... };

export const FeatureDetailsPageContent = () => {     // ← PROIBIDO
  const model = useFeatureDetailsPage();
  return <EntityDetailsPage {...model} />;
};
```

```tsx
// ✅ CORRETO — hook só exporta hook
// hooks/useFeatureDetailsPage.ts
export const useFeatureDetailsPage = (id: string) => {
  // lógica de estado
  return { entity, loading, errorMessage, onBack, onRetry };
};
```
```tsx
// ✅ CORRETO — componente em arquivo próprio
// pages/FeatureDetailsPage.tsx
const FeatureDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { entity, loading, errorMessage, onBack, onRetry } = useFeatureDetailsPage(id!);
  // renderiza diretamente com shared components
};
```

### Hook montando estrutura de UI via useMemo

Quando o hook monta `EntityDetailsPageData` (tabs, sections, items) via `useMemo`, ele está assumindo responsabilidade de apresentação — violação de SRP. Essa montagem é uma transformação de dados: responsabilidade do **normalizer**.

```tsx
// ❌ ERRADO — hook monta estrutura de exibição
const data: EntityDetailsPageData = useMemo(() => ({
  headerData: { title: entity.name, subtitle: entity.status },
  tabs: [{ id: 'summary', sections: [{ items: [...] }] }],
}), [entity]);
```

```ts
// ✅ CORRETO — hook chama normalizer, que é função pura
// normalizers/featureDetails.normalizer.ts
export const toFeatureDetailsData = (entity: Feature): EntityDetailsPageData => ({ ... });

// hooks/useFeatureDetailsPage.ts
return {
  entity,
  loading,
  errorMessage,
  onBack: () => navigate('/client/features'),
  onRetry: fetchEntity,
};
// page usa o normalizer diretamente, ou o hook retorna entity bruta
```

### JSX inline no hook (fora de column builders)

Hooks com extensão `.tsx` que definem `render: (row) => <JSX />` inline violam a separação de camadas.

```tsx
// ❌ ERRADO — JSX dentro do hook
const columns = [
  { key: 'actions', render: (row) => <RowActionsMenu actions={buildRowActions(row)} /> }
];
```

```tsx
// ✅ CORRETO — builder em components/
// components/featureListColumns.tsx
export const buildFeatureColumns = (actions: FeatureColumnActions): DataTableColumn<Feature>[] => [
  { key: 'actions', render: (row) => <RowActionsMenu actions={[...]} /> }
];

// hooks/useFeatureListPage.ts (extensão .ts)
const tableColumns = buildFeatureColumns({ onEdit, onDelete, onDetails });
```

### Constante de config de UI no arquivo de hook

```ts
// ❌ ERRADO — constante de config de UI no hook
const CONTENT: EntityDetailsPageContent = {
  pageTitle: 'Detalhes',
  loadingLabel: 'Carregando...',
  // ...
};
```

Essa constante pertence à page ou ao componente que a usa, não ao hook.

## Separação: hook de dados vs hook de página

Para listagens com lógica complexa, separar em dois hooks:

| Hook | Responsabilidade |
|------|-----------------|
| `useFeatureList.ts` | fetch, `queryParams`, `pagination`, `loading`, `errorMessage`, `reload` |
| `useFeatureListPage.ts` | lógica da página: ações, modal de delete/toggle, builders de colunas |

```ts
// useFeatureList.ts — só dados
export const useFeatureList = () => {
  const [rows, setRows] = useState<Feature[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [queryParams, setQueryParams] = useState<FeatureQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchList = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await featureService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta);
    } catch {
      setErrorMessage('Não foi possível carregar os registros.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchList(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchList]);

  return {
    rows, pagination, queryParams, loading, errorMessage,
    updateQueryParams: (patch: Partial<FeatureQueryParams>) =>
      setQueryParams((current) => ({ ...current, ...patch, page: 1 })),
    reload: fetchList,
  };
};
```

```ts
// useFeatureListPage.ts — lógica da página
export const useFeatureListPage = () => {
  const navigate = useNavigate();
  const featureList = useFeatureList();
  const [featurePendingDelete, setFeaturePendingDelete] = useState<Feature | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!featurePendingDelete) return;
    setIsDeleting(true);
    try {
      await featureService.remove(featurePendingDelete.id);
      setFeaturePendingDelete(undefined);
      await featureList.reload();
    } finally {
      setIsDeleting(false);
    }
  };

  const tableColumns = buildFeatureColumns({
    onDetails: (feature) => navigate(`/client/features/${feature.id}`),
    onEdit: (feature) => navigate(`/client/features/${feature.id}/edit`, { state: { entity: feature } }),
    onDelete: setFeaturePendingDelete,
  });

  return {
    featureList,
    tableColumns,
    deleteModal: {
      featurePendingDelete,
      openWith: setFeaturePendingDelete,
      close: () => setFeaturePendingDelete(undefined),
      confirm: handleDeleteConfirm,
      isDeleting,
    },
  };
};
```

## Hook de detalhes — padrão

```ts
// hooks/useFeatureDetailsPage.ts
export const useFeatureDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchEntity = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEntity = await featureService.getById(id);
      setEntity(fetchedEntity);
    } catch {
      setErrorMessage('Erro ao carregar registro.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchEntity(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEntity]);

  return {
    entity,
    loading,
    errorMessage,
    onBack: () => navigate('/client/features'),
    onRetry: fetchEntity,
  };
};
```

## Exemplos de hooks bem nomeados

- `useFeatureList` — busca dados da listagem
- `useFeatureListPage` — orquestra a página de listagem
- `useFeatureDetailsPage` — carrega e gerencia estado da página de detalhes
- `useFeatureCreatePage` — gerencia estado do formulário de criação
- `useFeatureEditPage` — carrega entidade + gerencia formulário de edição
- `useAuth` — contexto de autenticação
- `useClientPermission` — permissões do tenant

## Quando criar hook

- Estado reutilizável.
- Efeito complexo.
- Chamada de service.
- Lógica de formulário.
- Lógica de filtro/paginação.
- Controle de modal/confirmação.

## Proibido

- Hook exportando componente React.
- Hook com `const VARIAVEL_MAIUSCULA` de configuração de UI.
- Hook montando `EntityDetailsPageData` / estrutura de tabs via `useMemo`.
- Hook com arquivo `.tsx` sem necessidade (se não tem JSX, extensão deve ser `.ts`).
- Hook retornando dados sem tipagem.
- Hook fazendo tradução manual que deveria estar no i18n.
- Variáveis com nomes ambíguos: `res`, `id` para timer, `q` para query, `p` para page index.
