# 29 — Details Page Canonical Pattern

## Objetivo

Definir o modelo canônico completo para páginas de detalhes, cobrindo dois padrões conforme a complexidade da entidade:

- **Padrão A — Simples**: entidade sem tabs. Renderiza direto com `SectionCard` + `KeyValueGrid`.
- **Padrão B — Completo**: entidade com header de perfil, múltiplas tabs e seções. Usa o shared `EntityDetailsPage`.

---

## Onde fica cada transformação de dado

Essa regra se aplica aos dois padrões:

| Tipo de valor | Onde fica | Motivo |
|---|---|---|
| `entity.name`, `entity.email` | inline na page | leitura direta, sem lógica |
| `maskCpf(entity.cpf)` | normalizer | tem transformação |
| `maskPhone(entity.phone)` | normalizer | tem transformação |
| `formatIsoDate(entity.createdAt)` | normalizer | tem formatação |
| `entity.status === 'active' ? 'Ativo' : 'Inativo'` | normalizer | tem lógica condicional |
| `entity.address?.city ?? 'Não informado'` | normalizer | tem fallback com lógica |
| `formatCurrency(entity.amount)` | normalizer | tem formatação |

**Regra:** campo direto sem lógica → inline na page. Qualquer transformação → normalizer.

**Regra prática:** se já há normalizer para algum campo da seção, coloque todos os itens da seção nele — mesmo os diretos. A page fica limpa e você não mistura inline com normalizer na mesma seção.

### Exemplo — sem normalizer (campos diretos)

```tsx
// ✅ sem transformação nenhuma → inline é ok
<SectionCard title="Plano">
  <KeyValueGrid
    items={[
      { label: 'Nome', value: entity.name },
      { label: 'Descrição', value: entity.description },
    ]}
  />
</SectionCard>
```

### Exemplo — com normalizer (campos com transformação)

```ts
// normalizers/planDetails.normalizer.ts
export const toPlanDetailsItems = (entity: Plan) => ({
  general: [
    { label: 'Nome', value: entity.name },               // direto, mas junto dos outros
    { label: 'Preço', value: formatCurrency(entity.price) },
    { label: 'Status', value: entity.status === 'active' ? 'Ativo' : 'Inativo' },
    { label: 'Criado em', value: formatIsoDate(entity.createdAt) },
  ],
});
```

```tsx
// page — sem nenhuma transformação, só renderiza
const items = toPlanDetailsItems(entity);

<SectionCard title="Plano">
  <KeyValueGrid items={items.general} />
</SectionCard>
```

---

## Padrão A — Simples (sem tabs, sem header de perfil)

### Estrutura de arquivos

```
feature/
├── hooks/
│   └── useFeatureDetailsPage.ts          ← fetch + loading + errorMessage + onBack + onRetry
├── normalizers/
│   └── featureDetails.normalizer.ts      ← só quando há formatações (CPF, moeda, datas, lógica)
└── pages/
    └── FeatureDetailsPage.tsx            ← PageHeader + SectionCard + KeyValueGrid
```

> O normalizer é **chamado na page**, não no hook. Você vê a origem dos dados sem navegar camadas.

### `hooks/useFeatureDetailsPage.ts`

```ts
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { featureService } from '../services/service';
import type { Feature } from '../types/feature';

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

### `normalizers/featureDetails.normalizer.ts`

Retorna **arrays de itens prontos** — não `EntityDetailsPageData`. A page controla a estrutura de seções.

```ts
import { maskCpf } from '@shared/masks/cpf';
import { maskPhone } from '@shared/masks/phone';
import { formatIsoDate } from '@shared/formatters/date';
import type { Feature } from '../types/feature';

export const toFeatureDetailsItems = (entity: Feature) => ({
  general: [
    { label: 'Nome', value: entity.name },
    { label: 'CPF', value: maskCpf(entity.cpf) },
    { label: 'Telefone', value: maskPhone(entity.phone) },
    { label: 'Status', value: entity.status === 'active' ? 'Ativo' : 'Inativo' },
  ],
  control: [
    { label: 'Criado em', value: formatIsoDate(entity.createdAt) },
    { label: 'Atualizado em', value: formatIsoDate(entity.updatedAt) },
  ],
});
```

### `pages/FeatureDetailsPage.tsx` — com normalizer

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { AppLoadingIndicator } from '@shared/components/feedback/AppLoadingIndicator';
import { KeyValueGrid } from '@shared/components/data-display/KeyValueGrid';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppButton } from '@shared/components/inputs/AppButton';
import { toFeatureDetailsItems } from '../normalizers/featureDetails.normalizer';
import { useFeatureDetailsPage } from '../hooks/useFeatureDetailsPage';

const FeatureDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entity, loading, errorMessage, onBack, onRetry } = useFeatureDetailsPage(id!);

  if (loading) return <AppLoadingIndicator label="Carregando..." />;
  if (errorMessage) return <AppErrorState message={errorMessage} onRetry={() => void onRetry()} />;
  if (!entity) return null;

  const items = toFeatureDetailsItems(entity);  // ← normalizer visível aqui

  return (
    <AppStack>
      <PageHeader
        title={entity.name}
        actions={
          <AppButton
            variant="outlined"
            onClick={() => navigate(`/client/features/${entity.id}/edit`, { state: { entity } })}
          >
            Editar
          </AppButton>
        }
      />
      <SectionCard title="Informações gerais">
        <KeyValueGrid items={items.general} />
      </SectionCard>
      <SectionCard title="Controle">
        <KeyValueGrid items={items.control} />
      </SectionCard>
    </AppStack>
  );
};

export default FeatureDetailsPage;
```

### `pages/FeatureDetailsPage.tsx` — sem normalizer (campos diretos)

```tsx
const FeatureDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entity, loading, errorMessage, onBack, onRetry } = useFeatureDetailsPage(id!);

  if (loading) return <AppLoadingIndicator label="Carregando..." />;
  if (errorMessage) return <AppErrorState message={errorMessage} onRetry={() => void onRetry()} />;
  if (!entity) return null;

  return (
    <AppStack>
      <PageHeader title={entity.name} actions={...} />
      <SectionCard title="Informações gerais">
        <KeyValueGrid
          items={[
            { label: 'Nome', value: entity.name },
            { label: 'Descrição', value: entity.description },
          ]}
        />
      </SectionCard>
    </AppStack>
  );
};
```

---

## Padrão B — Completo (header de perfil + tabs + seções)

Usar quando a entidade tem identidade visual (avatar, status), múltiplas tabs e dados distribuídos em categorias.

### Estrutura de arquivos

```
feature/
├── hooks/
│   └── useFeatureDetailsPage.ts        ← fetch + viewState + callbacks; chama o normalizer
├── normalizers/
│   └── featureDetails.normalizer.ts   ← toFeatureHeaderData() + toFeatureDetailsTabs()
└── pages/
    └── FeatureDetailsPage.tsx          ← PageHeader + <EntityDetailsPage /> + constante CONTENT
```

> No Padrão B o normalizer é chamado **no hook**, porque o hook precisa montar o `EntityDetailsPageData` completo para passar ao componente. A page não precisa conhecer a estrutura interna das tabs.

### `normalizers/featureDetails.normalizer.ts`

```ts
import { maskCpf } from '@shared/masks/cpf';
import { maskPhone } from '@shared/masks/phone';
import { formatIsoDate } from '@shared/formatters/date';
import type { DetailsHeaderData, DetailTab } from '@shared/types/detailsDrawer';
import type { Feature } from '../types/feature';

export const toFeatureHeaderData = (entity: Feature): DetailsHeaderData => ({
  title: entity.name,
  subtitle: entity.role ?? entity.type,
  avatarFallback: entity.name[0].toUpperCase(),
  statusLabel: entity.status === 'active' ? 'Ativo' : 'Inativo',
  statusColor: entity.status === 'active' ? 'success' : undefined,
});

export const toFeatureDetailsTabs = (entity: Feature): DetailTab[] => [
  {
    id: 'general',
    label: 'Resumo',
    sections: [
      {
        id: 'info',
        title: 'Informações gerais',
        items: [
          { label: 'Nome', value: entity.name },
          { label: 'CPF', value: maskCpf(entity.cpf) },
          { label: 'Telefone', value: maskPhone(entity.phone) },
          { label: 'Status', value: entity.status === 'active' ? 'Ativo' : 'Inativo' },
          { label: 'Criado em', value: formatIsoDate(entity.createdAt) },
        ],
      },
    ],
  },
];
```

### `hooks/useFeatureDetailsPage.ts`

```ts
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { featureService } from '../services/service';
import { toFeatureHeaderData, toFeatureDetailsTabs } from '../normalizers/featureDetails.normalizer';
import type { EntityDetailsPageData, EntityDetailsViewState } from '@shared/components/data-display/details/entityDetails.types';

export const useFeatureDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [data, setData] = useState<EntityDetailsPageData>({ headerData: null, tabs: [] });
  const [viewState, setViewState] = useState<EntityDetailsViewState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchEntity = useCallback(async () => {
    setViewState('loading');
    setErrorMessage(undefined);
    try {
      const entity = await featureService.getById(id);
      setData({
        headerData: toFeatureHeaderData(entity),
        tabs: toFeatureDetailsTabs(entity),
      });
      setViewState('ready');
    } catch {
      setErrorMessage('Não foi possível carregar os dados.');
      setViewState('error');
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchEntity(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEntity]);

  return {
    viewState,
    data,
    errorMessage,
    onBack: () => navigate('/client/features'),
    onRetry: fetchEntity,
  };
};
```

### `pages/FeatureDetailsPage.tsx`

```tsx
import { useParams } from 'react-router-dom';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { PageHeader } from '@shared/components/layout/PageHeader';
import type { EntityDetailsPageContent } from '@shared/components/data-display/details/entityDetails.types';
import { useFeatureDetailsPage } from '../hooks/useFeatureDetailsPage';

const FeatureDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { viewState, data, errorMessage, onBack, onRetry } = useFeatureDetailsPage(id!);

  return (
    <AppStack>
      <PageHeader
        title="Detalhes da Feature"
        actions={
          <AppButton variant="outlined" onClick={onBack}>
            Voltar
          </AppButton>
        }
      />
      <EntityDetailsPage
        viewState={viewState}
        data={data}
        errorMessage={errorMessage}
        onRetry={onRetry}
      />
    </AppStack>
  );
};

export default FeatureDetailsPage;
```

> `content` é opcional — os defaults vêm de `sharedComponentsI18n.entityDetails` (ver skill 18).
> Passe `content` apenas quando precisar sobrescrever algum texto específico desta feature:
> ```tsx
> <EntityDetailsPage
>   content={{ emptyTitle: 'Nenhuma feature encontrada' }}
>   viewState={viewState} data={data} onRetry={onRetry}
> />
> ```
> `PageHeader` fica sempre na page — `EntityDetailsPage` não renderiza título nem botão de voltar.

---

## Quando usar cada padrão

| Pergunta | Padrão A | Padrão B |
|---|---|---|
| A entidade tem nome, avatar e status proeminentes? | não | sim |
| Os dados se dividem em mais de uma categoria (tabs)? | não | sim |
| São mais de 6–8 campos no total? | raramente | sim |
| A entidade é referenciada em múltiplas outras telas? | não | sim |
| Exemplos no projeto | planos, assinaturas, boletins | alunos, colaboradores, responsáveis, empresas |

> **Regra prática:** "perfil de X" → Padrão B. "configuração de X" ou "registro de X" → Padrão A.

---

## Onde o normalizer é chamado — resumo

| Padrão | Normalizer chamado em | Retorna |
|---|---|---|
| A (com formatações) | **page** | `{ general: DetailItem[], control: DetailItem[] }` |
| B | **hook** | `DetailsHeaderData` + `DetailTab[]` |

---

## Navegação para edição — passando entidade no state

Sempre passar `entity` no state ao navegar para edição. Evita GET redundante.

```tsx
navigate(`/client/features/${entity.id}/edit`, { state: { entity } });
```

O hook `useFeatureEditPage` lê esse state e só faz fetch se chegou diretamente pela URL (ver skill 28).

---

## Checklist de verificação

**Padrão A:**
- [ ] Hook retorna `entity`, `loading`, `errorMessage`, `onBack`, `onRetry`
- [ ] Hook extensão `.ts` (sem JSX)
- [ ] Page trata `loading` → `AppLoadingIndicator`
- [ ] Page trata `errorMessage` → `AppErrorState` com `onRetry`
- [ ] Page trata `!entity` → `return null`
- [ ] Normalizer (se existir) é chamado na page, não no hook
- [ ] Normalizer retorna itens por seção, não `EntityDetailsPageData`

**Padrão B:**
- [ ] Normalizer tem `toFeatureHeaderData()` e `toFeatureDetailsTabs()`
- [ ] Hook chama o normalizer e retorna `viewState`, `data`, `errorMessage`, `onBack`, `onRetry`
- [ ] Page renderiza `PageHeader` + `<EntityDetailsPage />`
- [ ] `content` só é passado quando precisar sobrescrever algum texto do i18n padrão
- [ ] Nenhum componente intermediário `FeatureDetailsPageContent`

## Customização de estados (loadingFallback / errorFallback)

`EntityDetailsPage` aceita `loadingFallback` e `errorFallback` como `ReactNode`. Use quando precisar de um comportamento visual diferente do padrão (ex: modal de erro, skeleton customizado):

```tsx
<EntityDetailsPage
  viewState={viewState}
  data={data}
  onRetry={onRetry}
  loadingFallback={<StudentSkeleton />}
  errorFallback={
    <ErrorModal open={viewState === 'error'} message={errorMessage} onRetry={onRetry} />
  }
/>
```

O `errorMessage` vem do hook — disponível na page para passar ao componente customizado.

## Proibido (ambos os padrões)

- Hook exportando componente React
- `useMemo` montando items/sections/tabs no hook (pertence ao normalizer)
- Chamar service diretamente na page
- `AppErrorState` sem `onRetry`
- MUI cru na page (usar shared components)
- Lógica de formatação inline na page quando já existe normalizer na mesma feature
- Strings de texto hardcoded dentro de shared components (devem estar em `sharedComponentsI18n`)
