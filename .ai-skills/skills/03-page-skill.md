# 03 — Page Skill

## Objetivo

Garantir que pages sejam finas, legíveis e responsáveis apenas por orquestrar layout, hooks e componentes.

## Page pode

- Compor layout.
- Chamar hooks da feature.
- Renderizar estados simples.
- Passar props para componentes.
- Definir ordem visual dos blocos.
- Ter componentes internos pequenos e específicos da página.

## Page não pode

- Chamar API diretamente.
- Manipular `localStorage` ou `sessionStorage` diretamente.
- Ter regra de negócio complexa.
- Fazer validação manual de formulário.
- Usar componentes MUI diretamente se existir wrapper compartilhado.
- Definir cores, espaçamentos ou tipografia hardcoded.
- Fazer lógica de autenticação ou autorização.
- Fazer parse, mask, formatter ou tradução manual.
- Montar payload para backend diretamente.

## Exemplo correto

```tsx
export function UsersPage() {
  const usersPage = useUsersPage();

  return (
    <AppLayout>
      <UsersHeader />
      <UsersFilter value={usersPage.filters} onChange={usersPage.updateFilters} />
      <UsersList data={usersPage.users} loading={usersPage.isLoading} error={usersPage.error} />
    </AppLayout>
  );
}
```

## Exemplo errado

```tsx
export function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then(setUsers);
  }, []);

  return <div>{...}</div>;
}
```

## Regra de tamanho

- Se a page crescer demais, extrair lógica para hook.
- Se o JSX ficar complexo, extrair componente específico da feature.
- Se houver transformação de dados, mover para normalizer, formatter ou hook.

## Revisão obrigatória de estados de tela

Para cada page, validar explicitamente quando aplicável:

- `loading`
- `error`
- `empty`
- `unauthorized`
- `forbidden`
- `submitting`

## MUI cru vs wrapper

- `Button` -> `AppButton`
- `Dialog/Modal` -> `AppModal`/`AppDialog`
- `Snackbar` -> `AppSnackbar`
- `Select` -> `AppSelect`
- `DatePicker` -> `AppDatePicker`
- `loading` -> `AppSkeleton` ou `AppCircularProgress`
