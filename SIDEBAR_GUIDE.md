# Guia da Sidebar — Como Configurar Menus e Submenus

A navegação agora é separada por domínio:\n\n- `src/components/layout/admin-navigation/navigationGroups/platformNavigationGroups.ts`\n- `src/components/layout/admin-navigation/navigationGroups/clientNavigationGroups.ts`\n\nO arquivo `src/components/layout/admin-navigation/config.tsx` virou composição/export e não concentra mais toda a definição do menu.

---

## Estrutura geral

A navegação é definida como arrays de **grupos** (`NavigationGroup[]`), um por domínio. Cada grupo pode ter:

- Uma **seção** opcional (`section`) — um label de categoria não-clicável.
- Um ou mais **itens** (`items`) — os botões do menu.

```ts
const navigationGroups: NavigationGroup[] = [
  {
    // Grupo sem seção — itens aparecem sem label de categoria
    items: [ ... ],
  },
  {
    // Grupo com seção — itens aparecem agrupados sob o label
    section: { id: 'minha-secao', label: 'Minha Seção' },
    items: [ ... ],
  },
];
```

O sistema converte automaticamente essa estrutura em um array plano e adiciona os prefixos de rota (`/platform` ou `/client`) de acordo com o domínio.

---

## Nível 1 — Item simples (sem filhos)

O caso mais comum: um botão que navega direto para uma rota.

```ts
{
  id: 'dashboard',          // ID único — usado como key no React
  label: 'Dashboard',       // Texto exibido no menu
  href: '/home',            // Rota relativa (prefixo é adicionado automaticamente)
  permission: 'dashboard:read', // Permissão necessária para exibir o item
  icon: HomeOutlinedIcon,   // Ícone (SvgIconComponent do @mui/icons-material)
}
```

**Como adicionar um item simples:**

```ts
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// Dentro de navigationGroups, no items de algum grupo:
{
  id: 'configuracoes',
  label: 'Configurações',
  href: '/settings',
  permission: 'settings:read',
  icon: SettingsOutlinedIcon,
}
```

A rota final será `/platform/settings` (domínio platform) ou `/client/settings` (domínio client).

---

## Nível 2 — Item com submenu (children)

Adicione a propriedade `children` com um array de itens filhos. O item pai vira um acordeão — clicá-lo abre/fecha o submenu.

```ts
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

{
  id: 'documentos',
  label: 'Documentos',
  permission: 'documents:read',
  icon: FolderOutlinedIcon,
  // Sem href — itens com filhos não navegam diretamente
  children: [
    {
      id: 'documentos-lista',
      label: 'Todos os documentos',
      href: '/documents',
      permission: 'documents:read',
      icon: InsertDriveFileOutlinedIcon,
    },
    {
      id: 'documentos-upload',
      label: 'Enviar documento',
      href: '/documents/upload',
      permission: 'documents:create',
      icon: UploadFileOutlinedIcon,
    },
  ],
}
```

**Regras dos itens com submenu:**

- O item pai não precisa de `href` (não navega).
- Cada filho deve ter seu próprio `id`, `label`, `href` e `permission`.
- O ícone do filho é exibido em tamanho menor (18px vs 20px do pai).
- O item pai fica destacado enquanto algum filho estiver ativo.

---

## Nível 3 — Item com submenu de submenu (grandchildren)

Adicione `children` dentro de um filho. O filho vira um sub-acordeão dentro do acordeão do pai.

```ts
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

{
  id: 'acesso',
  label: 'Controle de Acesso',
  permission: 'access:read',
  icon: AccountTreeOutlinedIcon,
  children: [
    {
      id: 'acesso-usuarios',
      label: 'Usuários',
      permission: 'users:read',
      icon: GroupOutlinedIcon,
      // Filho sem href — vira sub-acordeão
      children: [
        {
          id: 'acesso-usuarios-lista',
          label: 'Todos os usuários',
          href: '/access/users',
          permission: 'users:read',
          icon: ManageAccountsOutlinedIcon,
        },
        {
          id: 'acesso-usuarios-convites',
          label: 'Convites',
          href: '/access/users/invites',
          permission: 'users:invite',
          icon: AdminPanelSettingsOutlinedIcon,
        },
      ],
    },
    {
      id: 'acesso-permissoes',
      label: 'Permissões',
      href: '/access/permissions',
      permission: 'roles:read',
      icon: LockOutlinedIcon,
      // Filho simples — sem children
    },
  ],
}
```

**Regras dos itens de nível 3:**

- O nível 3 é o máximo suportado — não adicione `children` dentro dos netos.
- O ícone do neto é exibido em tamanho ainda menor (16px).
- O neto é exibido com mais indentação (`pl: 3.5`) para indicar a hierarquia.
- A seleção se propaga: se um neto está ativo, o filho e o pai também ficam destacados.

---

## Criando uma nova seção

Envolva os itens em um grupo com a propriedade `section`:

```ts
{
  section: { id: 'financeiro-section', label: 'Financeiro' },
  items: [
    {
      id: 'receitas',
      label: 'Receitas',
      href: '/finance/revenue',
      permission: 'finance:read',
      icon: TrendingUpOutlinedIcon,
    },
    {
      id: 'despesas',
      label: 'Despesas',
      href: '/finance/expenses',
      permission: 'finance:read',
      icon: TrendingDownOutlinedIcon,
    },
  ],
}
```

Quando a sidebar está **expandida**, o label da seção aparece em caixa alta entre os grupos.  
Quando está **recolhida**, o label vira um `<Divider />` horizontal.

---

## Exemplo completo

```ts
const navigationGroups: NavigationGroup[] = [
  {
    // Sem seção — item aparece no topo sem label
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/home',
        permission: 'dashboard:read',
        icon: HomeOutlinedIcon,
      },
    ],
  },
  {
    section: { id: 'gestao-section', label: 'Gestão' },
    items: [
      {
        id: 'clientes',
        label: 'Clientes',
        href: '/clients',
        permission: 'clients:read',
        icon: PeopleOutlineOutlinedIcon,
      },
      // Item com submenu
      {
        id: 'relatorios',
        label: 'Relatórios',
        permission: 'reports:read',
        icon: BarChartOutlinedIcon,
        children: [
          {
            id: 'relatorios-mensal',
            label: 'Mensal',
            href: '/reports/monthly',
            permission: 'reports:read',
            icon: CalendarMonthOutlinedIcon,
          },
          // Item com sub-submenu
          {
            id: 'relatorios-financeiro',
            label: 'Financeiro',
            permission: 'reports:finance',
            icon: AttachMoneyOutlinedIcon,
            children: [
              {
                id: 'relatorios-financeiro-receitas',
                label: 'Receitas',
                href: '/reports/finance/revenue',
                permission: 'reports:finance',
                icon: TrendingUpOutlinedIcon,
              },
              {
                id: 'relatorios-financeiro-despesas',
                label: 'Despesas',
                href: '/reports/finance/expenses',
                permission: 'reports:finance',
                icon: TrendingDownOutlinedIcon,
              },
            ],
          },
        ],
      },
    ],
  },
];
```

---

## Permissões

Cada item tem uma `permission` no formato `recurso:acao`. O sistema adiciona o prefixo do domínio automaticamente:

| Domínio    | `permission` no config | Permissão final verificada |
| ---------- | ---------------------- | -------------------------- |
| `platform` | `clients:read`         | `platform:clients:read`    |
| `client`   | `clients:read`         | `client:clients:read`      |

As permissões disponíveis por domínio são definidas em:  
`src/components/layout/admin-navigation/permissions.ts`

Se um item não tiver a permissão correspondente na lista do usuário, ele simplesmente não aparece na sidebar. Seções sem nenhum item visível ainda aparecem — se quiser evitar isso, certifique-se de que as permissões dos itens do grupo existam para o domínio.

Para adicionar uma nova permissão ao domínio `platform`, edite `platformDefaultPermissions` nesse arquivo. Para o domínio `client`, edite `clientDefaultPermissions`.

---

## Comportamento por domínio (platform vs client)

Cada domínio possui sua própria fonte de grupos (`platformNavigationGroups` e `clientNavigationGroups`).\n\n- `platform` usa seus grupos + prefixo `/platform` + permissões `platform:*`.\n- `client` usa seus grupos + prefixo `/client` + permissões `client:*`.\n\nAlém disso, o filtro de permissões remove automaticamente seções sem itens visíveis, evitando seção "solta".

Para adicionar um item **apenas no domínio client**, a abordagem mais simples é criar uma permissão exclusiva (ex: `client:meu-recurso:read`) e não incluí-la nas permissões do platform.

---

## Adicionando rotas para novos itens

Após adicionar um item no `config.tsx`, registre a rota correspondente em `src/App.tsx` dentro do bloco `<Route element={<AppLayout />}>`:

```tsx
<Route
  path="/platform/reports/monthly"
  element={
    <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
      <MonthlyReportsPage />
    </DomainProtectedRoute>
  }
/>
```

Sem a rota registrada, o link navegará para a URL mas a página não renderizará nada (ou cairá no catch-all).
