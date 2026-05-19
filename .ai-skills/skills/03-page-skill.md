# 03 — Page Skill

## Objetivo

Garantir que pages sejam finas, legíveis e responsáveis apenas por orquestrar layout, hooks e componentes do design system. A page não tem lógica — ela apenas conecta o hook aos shared components.

## Page pode

- Extrair `id` e outros params de rota (`useParams`).
- Chamar hooks da feature.
- Renderizar estados diretamente com shared components (`AppLoadingIndicator`, `AppErrorState`).
- Usar shared components do design system (`AppStack`, `SectionCard`, `KeyValueGrid`, `PageHeader`, etc.).
- Passar props para os componentes.
- Definir a ordem visual dos blocos.

## Page não pode

- Chamar API diretamente.
- Manipular `localStorage` ou `sessionStorage` diretamente.
- Ter regra de negócio.
- Fazer validação manual de formulário.
- Usar componentes MUI diretamente se existir wrapper compartilhado.
- Definir cores, espaçamentos ou tipografia hardcoded.
- Fazer lógica de autenticação ou autorização.
- Fazer parse, mask, formatter ou tradução manual.
- Montar payload para backend diretamente.
- Exportar componentes de dentro de arquivos de hook.

## Três padrões de page

### 1. List Page

A page chama `useFeatureListPage`, recebe `featureList`, `tableColumns` e `deleteModal`, e renderiza `PageHeader` + `ListFilters` + `QueryDataTable` + `ConfirmDialog`.

```tsx
const FeaturePage = () => {
  const navigate = useNavigate();
  const { featureList, tableColumns, deleteModal } = useFeatureListPage();

  return (
    <AppStack>
      <PageHeader
        title="Features"
        actions={
          <AppButton onClick={() => navigate('/client/features/new')}>Nova feature</AppButton>
        }
      />
      <ListFilters
        fields={[{ key: 'search', type: 'text', placeholder: 'Buscar...' }]}
        values={{ search: featureList.queryParams.search ?? '' }}
        onChange={(filterKey, filterValue) =>
          featureList.updateQueryParams({ [filterKey]: filterValue || undefined })
        }
      />
      <QueryDataTable
        rows={featureList.rows}
        columns={tableColumns}
        loading={featureList.loading}
        errorMessage={featureList.errorMessage}
        page={(featureList.queryParams.page ?? 1) - 1}
        rowsPerPage={featureList.queryParams.limit ?? 10}
        totalCount={featureList.pagination.total}
        onPageChange={(pageIndex) => featureList.updateQueryParams({ page: pageIndex + 1 })}
        onRowsPerPageChange={(rowsPerPage) =>
          featureList.updateQueryParams({ limit: rowsPerPage, page: 1 })
        }
      />
      <ConfirmDialog
        open={Boolean(deleteModal.featurePendingDelete)}
        title="Excluir registro"
        description={`Deseja excluir "${deleteModal.featurePendingDelete?.name}"?`}
        onConfirm={() => void deleteModal.confirm()}
        onCancel={deleteModal.close}
        loading={deleteModal.isDeleting}
      />
    </AppStack>
  );
};
```

### 2. Details Page

A page chama `useFeatureDetailsPage(id)`, recebe `entity`, `loading`, `errorMessage`, e renderiza os shared components **diretamente**. Não existe um componente intermediário `FeatureDetailsPageContent` — a page **é** o componente de detalhes.

```tsx
const FeatureDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { entity, loading, errorMessage, onBack, onRetry } = useFeatureDetailsPage(id!);

  if (loading) return <AppLoadingIndicator label="Carregando feature..." />;
  if (errorMessage) return <AppErrorState message={errorMessage} onRetry={() => void onRetry()} />;
  if (!entity) return null;

  return (
    <AppStack>
      <PageHeader title={entity.name} onBack={onBack} />
      <SectionCard title="Informações gerais">
        <KeyValueGrid
          items={[
            { label: 'Nome', value: entity.name },
            { label: 'Status', value: entity.status === 'active' ? 'Ativo' : 'Inativo' },
          ]}
        />
      </SectionCard>
      <SectionCard title="Controle">
        <KeyValueGrid
          items={[
            { label: 'Criado em', value: formatIsoDate(entity.createdAt) },
            { label: 'Atualizado em', value: formatIsoDate(entity.updatedAt) },
          ]}
        />
      </SectionCard>
    </AppStack>
  );
};
```

> **Quando criar `components/` para a details page?** Apenas se houver um elemento visual genuinamente exclusivo desta tela (ex: um gráfico, um card com lógica própria). Nunca criar componente só para "dividir" o JSX da page.

### 3. Form Pages — Create e Edit são separadas

Create e Edit têm hooks próprios com schemas próprios. A edit page pode ter campos readonly, validações distintas e comportamento diferente — nunca compartilhar o mesmo form via `isEditMode`.

```tsx
// FeatureCreatePage.tsx
const FeatureCreatePage = () => {
  const { form, submitting, errorMessage, onSubmit, onBack } = useFeatureCreatePage();
  return (
    <AppStack>
      <PageHeader title="Nova feature" />
      {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}
      <AppForm form={form} onSubmit={onSubmit}>
        <FormTextField<FeatureCreateFormValues> name="name" label="Nome" required />
        <FormActions onCancel={onBack} submitLabel="Criar" loading={submitting} />
      </AppForm>
    </AppStack>
  );
};
```

```tsx
// FeatureEditPage.tsx — campos readonly ficam fora do AppForm
const FeatureEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { form, entity, loading, submitting, errorMessage, onSubmit, onBack } = useFeatureEditPage(id!);

  if (loading) return <AppLoadingIndicator label="Carregando..." />;

  return (
    <AppStack>
      <PageHeader title="Editar feature" />
      {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}
      <AppTextField label="Nome" value={entity?.name ?? ''} disabled />
      <AppForm form={form} onSubmit={onSubmit}>
        <FormTextField<FeatureEditFormValues> name="description" label="Descrição" />
        <FormActions onCancel={onBack} submitLabel="Salvar alterações" loading={submitting} />
      </AppForm>
    </AppStack>
  );
};
```

## Regra de tamanho

- List page: até ~80 linhas.
- Details page: até ~80 linhas (se tiver muitas sections, avaliar normalizer).
- Form page: pode ter mais linhas conforme número de campos.
- Se a page crescer além disso com lógica, extrair para hook.

## Revisão obrigatória de estados de tela

Para cada page, validar explicitamente:

- `loading` — `AppLoadingIndicator`
- `error` — `AppErrorState` com `onRetry`
- `empty` — quando `!entity && !loading && !errorMessage`
- `submitting` — botão desabilitado + `loading`

## MUI cru vs wrapper

| MUI | Wrapper |
|-----|---------|
| `Button` | `AppButton` |
| `Dialog` | `ConfirmDialog` ou `BaseModal` |
| `Snackbar` | `AppSnackbar` |
| `Select` | `AppSelect` |
| `DatePicker` | `AppDatePicker` |
| `CircularProgress` | `AppCircularProgress` ou `AppLoadingIndicator` |
| `Skeleton` | `AppSkeleton` |
