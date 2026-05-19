# 28 — Form Page Canonical Pattern (Create + Edit)

## Objetivo

Definir o modelo canônico completo para páginas de formulário: create e edit separados, schemas independentes, normalizer com três funções, e pré-carregamento inteligente na edição via `location.state`.

## Estrutura de arquivos

```
feature/
├── types/
│   └── feature.ts                        ← entidade + CreateRequest + UpdateRequest
├── services/
│   ├── endpoints.ts
│   ├── types.ts
│   └── service.ts
├── schemas/
│   ├── featureCreateForm.schema.ts       ← schema de criação + type inferido
│   └── featureEditForm.schema.ts         ← schema de edição (pode diferir)
├── normalizers/
│   └── featureForm.normalizer.ts         ← toCreatePayload + toEditFormValues + toEditPayload
├── hooks/
│   ├── useFeatureCreatePage.ts           ← lógica do form de criação
│   └── useFeatureEditPage.ts             ← carrega entidade + lógica do form de edição
└── pages/
    ├── FeatureCreatePage.tsx             ← form de criação
    └── FeatureEditPage.tsx               ← form de edição (campos readonly fora do AppForm)
```

> Create e Edit são **sempre** arquivos separados. Nunca usar `isEditMode ? ... : ...` para bifurcar comportamento no mesmo form.

---

## `schemas/featureCreateForm.schema.ts`

```ts
import { z } from 'zod';

export const featureCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  status: z.enum(['active', 'inactive'], { required_error: 'Selecione o status.' }),
  description: z.string().optional(),
});

export type FeatureCreateFormValues = z.infer<typeof featureCreateFormSchema>;
```

## `schemas/featureEditForm.schema.ts`

```ts
import { z } from 'zod';

// name é readonly no edit — não entra no schema de validação
export const featureEditFormSchema = z.object({
  status: z.enum(['active', 'inactive'], { required_error: 'Selecione o status.' }),
  description: z.string().optional(),
});

export type FeatureEditFormValues = z.infer<typeof featureEditFormSchema>;
```

---

## `normalizers/featureForm.normalizer.ts`

Três funções obrigatórias: `toCreatePayload`, `toEditFormValues`, `toEditPayload`.

```ts
import type { Feature } from '../types/feature';
import type { FeatureCreateFormValues } from '../schemas/featureCreateForm.schema';
import type { FeatureEditFormValues } from '../schemas/featureEditForm.schema';
import type { CreateFeatureRequest, UpdateFeatureRequest } from '../types/feature';

export const toFeatureCreatePayload = (values: FeatureCreateFormValues): CreateFeatureRequest => ({
  name: values.name.trim(),
  status: values.status,
  description: values.description?.trim() || undefined,
});

export const toFeatureEditFormValues = (entity: Feature): FeatureEditFormValues => ({
  status: entity.status,
  description: entity.description ?? '',
});

export const toFeatureEditPayload = (values: FeatureEditFormValues): UpdateFeatureRequest => ({
  status: values.status,
  description: values.description?.trim() || undefined,
});
```

---

## `hooks/useFeatureCreatePage.ts`

```ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { featureCreateFormSchema } from '../schemas/featureCreateForm.schema';
import { featureService } from '../services/service';
import { toFeatureCreatePayload } from '../normalizers/featureForm.normalizer';

export const useFeatureCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm(featureCreateFormSchema);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await featureService.create(toFeatureCreatePayload(values));
      navigate('/client/features');
    } catch {
      setErrorMessage('Erro ao criar registro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  });

  return {
    form,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => navigate('/client/features'),
  };
};
```

---

## `hooks/useFeatureEditPage.ts`

O fluxo mais comum é **detalhes → edição**: a entidade já está carregada. Passar via `navigate state` evita GET redundante. O hook só faz a chamada à API como fallback (acesso direto pela URL).

```ts
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { featureEditFormSchema } from '../schemas/featureEditForm.schema';
import { featureService } from '../services/service';
import { toFeatureEditFormValues, toFeatureEditPayload } from '../normalizers/featureForm.normalizer';
import type { Feature } from '../types/feature';

type FeatureEditLocationState = { entity?: Feature };

export const useFeatureEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as FeatureEditLocationState | null;

  const form = useAppForm(featureEditFormSchema);
  const [entity, setEntity] = useState<Feature | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // Pré-popula se entidade veio via navegação (fluxo: detalhes → edição)
  useEffect(() => {
    if (locationState?.entity) {
      form.reset(toFeatureEditFormValues(locationState.entity));
    }
  }, [locationState?.entity, form]);

  // Fallback: busca da API se chegou direto pela URL
  const fetchEntity = useCallback(async () => {
    if (locationState?.entity) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEntity = await featureService.getById(id);
      setEntity(fetchedEntity);
      form.reset(toFeatureEditFormValues(fetchedEntity));
    } catch {
      setErrorMessage('Erro ao carregar registro.');
    } finally {
      setLoading(false);
    }
  }, [id, locationState?.entity, form]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchEntity(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEntity]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await featureService.update(id, toFeatureEditPayload(values));
      navigate('/client/features');
    } catch {
      setErrorMessage('Erro ao salvar alterações.');
    } finally {
      setSubmitting(false);
    }
  });

  return {
    form,
    entity,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => navigate('/client/features'),
  };
};
```

---

## `pages/FeatureCreatePage.tsx`

```tsx
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useFeatureCreatePage } from '../hooks/useFeatureCreatePage';
import type { FeatureCreateFormValues } from '../schemas/featureCreateForm.schema';

const FeatureCreatePage = () => {
  const { form, submitting, errorMessage, onSubmit, onBack } = useFeatureCreatePage();

  return (
    <AppStack>
      <PageHeader title="Nova feature" onBack={onBack} />
      {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}
      <AppForm form={form} onSubmit={onSubmit}>
        <FormTextField<FeatureCreateFormValues> name="name" label="Nome" required />
        <FormTextField<FeatureCreateFormValues> name="description" label="Descrição" multiline rows={3} />
        <FormActions onCancel={onBack} submitLabel="Criar" loading={submitting} />
      </AppForm>
    </AppStack>
  );
};

export default FeatureCreatePage;
```

---

## `pages/FeatureEditPage.tsx`

Campos readonly ficam **fora do `AppForm`**, exibidos como `AppTextField` com `disabled`. Não entram no schema de edição.

```tsx
import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppLoadingIndicator } from '@shared/components/feedback/AppLoadingIndicator';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useFeatureEditPage } from '../hooks/useFeatureEditPage';
import type { FeatureEditFormValues } from '../schemas/featureEditForm.schema';

const FeatureEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { form, entity, loading, submitting, errorMessage, onSubmit, onBack } = useFeatureEditPage(id!);

  if (loading) return <AppLoadingIndicator label="Carregando feature..." />;

  return (
    <AppStack>
      <PageHeader title="Editar feature" onBack={onBack} />
      {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}

      {/* Campo readonly — fora do AppForm, não entra na validação */}
      <AppTextField label="Nome" value={entity?.name ?? ''} disabled />

      <AppForm form={form} onSubmit={onSubmit}>
        <FormTextField<FeatureEditFormValues> name="description" label="Descrição" multiline rows={3} />
        <FormActions onCancel={onBack} submitLabel="Salvar alterações" loading={submitting} />
      </AppForm>
    </AppStack>
  );
};

export default FeatureEditPage;
```

---

## Como navegar de detalhes para edição

```ts
// Na details page — passar entidade no state evita GET redundante no edit
navigate(`/client/features/${entity.id}/edit`, { state: { entity } });
```

---

## Checklist de verificação

- [ ] Schemas separados: `featureCreateForm.schema.ts` e `featureEditForm.schema.ts`
- [ ] Types vêm de `z.infer` — nunca duplicar manualmente
- [ ] Normalizer com as 3 funções: `toCreatePayload`, `toEditFormValues`, `toEditPayload`
- [ ] `useFeatureEditPage` lê `location.state` antes de fazer fetch
- [ ] Fetch na edição só ocorre se `locationState?.entity` for undefined (fallback URL direta)
- [ ] Campos readonly ficam **fora** do `AppForm`
- [ ] Nenhum `isEditMode ? ... : ...` em nenhum arquivo
- [ ] Payload é construído no normalizer, nunca na page ou hook
- [ ] Extensões corretas: hooks `.ts`, pages `.tsx`

## Proibido

- `isEditMode ? fieldA : fieldB` no mesmo form
- Schema único compartilhado entre create e edit quando os campos diferem
- Validação manual com `if` na page
- Montar payload dentro da page em vez do normalizer
- Enviar data em formato visual (`dd/MM/yyyy`) ao backend
- Enviar moeda formatada ao backend
