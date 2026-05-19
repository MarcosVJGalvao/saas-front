# 07 — Form Skill

## Objetivo

Padronizar formulários com React Hook Form, Zod, schemas e normalizers separados, e pré-carregamento inteligente na edição.

## Regras obrigatórias

- Todo formulário usa React Hook Form.
- Toda validação usa Zod.
- Tipos vêm de `z.infer` — nunca duplicar o tipo do schema.
- Não validar formulário manualmente na page.
- Campos reutilizáveis ficam em `shared/components/form`.
- Formulários específicos ficam dentro da feature.
- Inputs de documento, telefone, data e moeda devem exibir máscara.
- Payload deve ser normalizado antes de ir para o service.

## Create e Edit são sempre separados

Create e Edit têm **schemas, hooks e pages independentes**. Nunca usar `isEditMode ? ... : ...` para bifurcar comportamento no mesmo form — a edit page pode ter campos bloqueados, validações distintas e campos diferentes.

```
feature/
  schemas/
    featureCreateForm.schema.ts    ← schema de criação
    featureEditForm.schema.ts      ← schema de edição (pode diferir)
  normalizers/
    featureForm.normalizer.ts      ← toCreatePayload() + toEditFormValues() + toEditPayload()
  hooks/
    useFeatureCreatePage.ts        ← lógica de criação
    useFeatureEditPage.ts          ← carregar entidade + lógica de edição
  pages/
    FeatureCreatePage.tsx          ← form de criação
    FeatureEditPage.tsx            ← form de edição (campos readonly fora do AppForm)
```

## Exemplo de schemas

```ts
// featureCreateForm.schema.ts
export const featureCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  status: z.enum(['active', 'inactive'], { required_error: 'Selecione o status.' }),
  description: z.string().optional(),
});
export type FeatureCreateFormValues = z.infer<typeof featureCreateFormSchema>;

// featureEditForm.schema.ts — name é readonly no edit, não entra no schema
export const featureEditFormSchema = z.object({
  status: z.enum(['active', 'inactive'], { required_error: 'Selecione o status.' }),
  description: z.string().optional(),
});
export type FeatureEditFormValues = z.infer<typeof featureEditFormSchema>;
```

## Normalizer — três funções obrigatórias

```ts
// featureForm.normalizer.ts

// Form values → payload de criação
export const toFeatureCreatePayload = (values: FeatureCreateFormValues): CreateFeatureRequest => ({
  name: values.name.trim(),
  status: values.status,
  description: values.description?.trim() || undefined,
});

// Entidade existente → valores iniciais do form de edição
export const toFeatureEditFormValues = (entity: Feature): FeatureEditFormValues => ({
  status: entity.status,
  description: entity.description ?? '',
});

// Form values → payload de atualização
export const toFeatureEditPayload = (values: FeatureEditFormValues): UpdateFeatureRequest => ({
  status: values.status,
  description: values.description?.trim() || undefined,
});
```

## Hook de criação

```ts
// useFeatureCreatePage.ts
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

  return { form, submitting, errorMessage, onSubmit: handleSubmit, onBack: () => navigate('/client/features') };
};
```

## Hook de edição — pré-carregamento inteligente

O fluxo mais comum é **detalhes → edição**. A entidade já está carregada. Passar via `navigate state` evita GET redundante. O hook só faz a chamada à API como fallback (acesso direto pela URL).

```ts
// useFeatureEditPage.ts
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

  return { form, entity, loading, submitting, errorMessage, onSubmit: handleSubmit, onBack: () => navigate('/client/features') };
};
```

## Como navegar de detalhes para edição

```ts
// Na details page — passar entidade no state ao navegar para edit
navigate(`/client/features/${entity.id}/edit`, { state: { entity } });
```

## Campos readonly na Edit Page

Campos que não são editáveis ficam **fora do `AppForm`**, exibidos como `AppTextField` com `disabled`. Não devem entrar no schema de edição.

```tsx
// FeatureEditPage.tsx
<AppTextField label="Nome" value={entity?.name ?? ''} disabled />

<AppForm form={form} onSubmit={onSubmit}>
  {/* apenas campos editáveis */}
  <FormTextField<FeatureEditFormValues> name="description" label="Descrição" />
  <FormActions onCancel={onBack} submitLabel="Salvar alterações" loading={submitting} />
</AppForm>
```

## Fluxo completo

```
Input mascarado -> React Hook Form -> Zod (schema) -> normalizer -> service.ts -> backend
```

## Formatos

| Dado | Exibição | Envio ao backend |
|------|----------|-----------------|
| Data | `dd/MM/yyyy` | `yyyy-MM-dd` |
| Documento (CPF/CNPJ) | `123.456.789-00` | `12345678900` |
| Telefone | `(11) 99999-9999` | `11999999999` |
| Moeda | `R$ 1.250,90` | `1250.9` |

## Proibido

- Validação manual com `if` espalhado na page.
- Schema único compartilhado entre create e edit quando os campos diferem.
- `isEditMode ? fieldA : fieldB` dentro do mesmo form.
- `replace` de máscara inline na page.
- Enviar data em formato visual ao backend.
- Enviar moeda formatada ao backend.
- Montar payload dentro da page em vez do normalizer.
