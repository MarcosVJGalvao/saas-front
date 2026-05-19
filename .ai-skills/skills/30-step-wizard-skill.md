# 30 — Step Wizard (Formulário Multi-Etapa) Skill

## Objetivo

Padronizar a implementação de formulários multi-etapa (wizards/onboarding) com o componente `StepperWizard`, garantindo consistência visual, separação de responsabilidades e acumulação correta de dados entre steps.

## Quando usar

Use o padrão de wizard quando:
- O formulário tem **4 ou mais campos agrupáveis por tema** com dependências entre etapas
- Existe um painel de **resumo lateral** com o progresso
- O usuário pode **voltar** para corrigir etapas anteriores
- O envio final depende de dados coletados em **múltiplas etapas**

Para formulários simples (até 3 grupos), use o padrão de Form Page (skill 28).

---

## Estrutura de arquivos

```
feature/
├── types/
│   ├── feature.ts                             ← entidade + CreateRequest
│   └── featureOnboarding.ts                   ← tipos específicos do wizard (UiExtras, SummaryData)
├── schemas/
│   └── featureOnboarding.schema.ts            ← schemas Zod por step + schema completo
├── normalizers/
│   ├── featureOnboarding.normalizer.ts        ← toPayload() — normaliza tudo antes da API
│   ├── featureOnboardingInitialState.ts       ← valor inicial do formulário
│   └── featureOnboardingSummary.ts            ← buildFeatureSummary() — constrói resumo lateral
├── services/
│   ├── endpoints.ts
│   ├── types.ts
│   └── service.ts
├── hooks/
│   ├── useFeatureOnboardingForm.ts            ← estado: activeStep, value, uiExtras, actions
│   ├── useFeatureOnboardingPage.ts            ← navegação, disabled state, API call
│   └── useFeatureOnboardingActions.ts         ← métodos de atualização de cada campo
├── components/
│   └── onboarding/
│       ├── FeatureOnboardingSteps.tsx         ← roteador: retorna o step ativo
│       ├── StepOne.tsx                        ← step 0: dados iniciais
│       ├── StepTwo.tsx                        ← step 1: próximo grupo
│       ├── ...                                ← demais steps
│       ├── ReviewStep.tsx                     ← último step: revisão final
│       └── FeatureOnboardingSummary.tsx       ← painel lateral de resumo
└── pages/
    └── FeatureOnboardingPage.tsx              ← orquestra: hook + StepperWizard + Summary
```

---

## `StepperWizard` — shared component

O shared component `StepperWizard` é o único componente de stepper do projeto. **Nunca criar stepper customizado** para uma feature.

```tsx
import { StepperWizard } from '@shared/components/navigation/StepperWizard';

<StepperWizard
  activeStep={activeStep}
  steps={['Dados', 'Endereço', 'Plano', 'Revisão']}
  onBack={onBack}
  onCancel={onCancel}          // exibido apenas no step 0
  onNext={() => void handleNext()}
  isLastStep={isLastStep}
  nextLabel="Finalizar"        // exibido apenas no último step
  nextDisabled={nextDisabled}
  nextLoading={loading && isLastStep}
>
  <FeatureOnboardingSteps
    activeStep={activeStep}
    value={value}
    uiExtras={uiExtras}
    actions={actions}
  />
</StepperWizard>
```

---

## Tipos específicos do wizard

```ts
// types/featureOnboarding.ts

// Dados auxiliares que não fazem parte do payload mas afetam a UI
export type FeatureOnboardingUiExtras = {
  cep: string;
  resolvedAddress: string;
  // outros dados auxiliares de UI
};

// Resumo exibido no painel lateral
export type FeatureOnboardingSummaryData = {
  stepOne: string;
  stepTwo: string;
  review: string;
  // uma linha por step
};
```

> **UiExtras** existe para separar dados auxiliares de UI (campos de máscara, CEP temporário, emails antes de normalizar) do payload real. Nunca misturar com o `value` que vai para a API.

---

## Schemas

Um schema por step, mais um schema completo para validação final:

```ts
// schemas/featureOnboarding.schema.ts
import { z } from 'zod';

export const featureStepOneSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  documentNumber: z.string().min(11, 'CPF inválido.'),
});

export const featureStepTwoSchema = z.object({
  street: z.string().min(1, 'Informe a rua.'),
  city: z.string().min(1, 'Informe a cidade.'),
});

// Schema completo com validações cruzadas entre steps
export const featureOnboardingSchema = featureStepOneSchema
  .merge(featureStepTwoSchema)
  .refine(
    (data) => data.documentNumber.length === 11,
    { message: 'CPF deve ter 11 dígitos.', path: ['documentNumber'] },
  );

export type FeatureOnboardingStepOneValues = z.infer<typeof featureStepOneSchema>;
export type FeatureOnboardingValues = z.infer<typeof featureOnboardingSchema>;
```

---

## `normalizers/featureOnboardingInitialState.ts`

```ts
import type { CreateFeatureRequest } from '../types/feature';
import type { FeatureOnboardingUiExtras } from '../types/featureOnboarding';

export const initialFeatureValue: CreateFeatureRequest = {
  name: '',
  documentNumber: '',
  address: {
    street: '',
    city: '',
    state: '',
  },
};

export const initialFeatureUiExtras: FeatureOnboardingUiExtras = {
  cep: '',
  resolvedAddress: '',
};
```

---

## `normalizers/featureOnboarding.normalizer.ts`

Normalização aplicada **apenas no payload final** — não em cada step. Campos vazios são removidos, máscaras são limpas, dados de `uiExtras` são mesclados:

```ts
import { onlyDigits } from '@shared/utils/masks';
import type { CreateFeatureRequest } from '../types/feature';
import type { FeatureOnboardingUiExtras } from '../types/featureOnboarding';

export const toFeatureOnboardingPayload = (
  value: CreateFeatureRequest,
  uiExtras: FeatureOnboardingUiExtras,
): CreateFeatureRequest => ({
  name: value.name.trim(),
  documentNumber: onlyDigits(value.documentNumber),
  address: {
    street: uiExtras.resolvedAddress || value.address.street,
    city: value.address.city,
    state: value.address.state,
  },
});
```

---

## `normalizers/featureOnboardingSummary.ts`

Função pura que converte o estado atual em strings para o painel lateral:

```ts
import type { CreateFeatureRequest } from '../types/feature';
import type { FeatureOnboardingSummaryData } from '../types/featureOnboarding';

export const buildFeatureSummary = (value: CreateFeatureRequest): FeatureOnboardingSummaryData => ({
  stepOne: value.name || 'Não preenchido',
  stepTwo: value.address.city
    ? `${value.address.street}, ${value.address.city}`
    : 'Não preenchido',
  review: '—',
});
```

---

## `hooks/useFeatureOnboardingActions.ts`

Um método por campo — sem updates genéricos. Isso mantém o contrato explícito e evita typos:

```ts
import type { CreateFeatureRequest } from '../types/feature';
import type { FeatureOnboardingUiExtras } from '../types/featureOnboarding';

interface UseFeatureOnboardingActionsParams {
  setValue: React.Dispatch<React.SetStateAction<CreateFeatureRequest>>;
  setUiExtras: React.Dispatch<React.SetStateAction<FeatureOnboardingUiExtras>>;
}

export const useFeatureOnboardingActions = ({
  setValue,
  setUiExtras,
}: UseFeatureOnboardingActionsParams) => {
  const updateName = (name: string) =>
    setValue((current) => ({ ...current, name }));

  const updateDocumentNumber = (documentNumber: string) =>
    setValue((current) => ({ ...current, documentNumber }));

  const updateCep = (cep: string) =>
    setUiExtras((current) => ({ ...current, cep }));

  const resolveAddressByCep = async () => {
    // busca endereço via API de CEP
  };

  return {
    updateName,
    updateDocumentNumber,
    updateCep,
    resolveAddressByCep,
  };
};

export type FeatureOnboardingActions = ReturnType<typeof useFeatureOnboardingActions>;
```

---

## `hooks/useFeatureOnboardingForm.ts`

Estado central do wizard — sem lógica de navegação:

```ts
import { useMemo, useState } from 'react';
import { useFeatureOnboardingActions } from './useFeatureOnboardingActions';
import { initialFeatureValue, initialFeatureUiExtras } from '../normalizers/featureOnboardingInitialState';
import { toFeatureOnboardingPayload } from '../normalizers/featureOnboarding.normalizer';
import { buildFeatureSummary } from '../normalizers/featureOnboardingSummary';
import type { CreateFeatureRequest } from '../types/feature';
import type { FeatureOnboardingUiExtras } from '../types/featureOnboarding';

export const useFeatureOnboardingForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<CreateFeatureRequest>(initialFeatureValue);
  const [uiExtras, setUiExtras] = useState<FeatureOnboardingUiExtras>(initialFeatureUiExtras);

  const actions = useFeatureOnboardingActions({ setValue, setUiExtras });

  const payload = useMemo(
    () => toFeatureOnboardingPayload(value, uiExtras),
    [value, uiExtras],
  );

  const summary = useMemo(() => buildFeatureSummary(value), [value]);

  // Validações por step — determina se "Próximo" está habilitado
  const isStepOneComplete = value.name.length > 0 && value.documentNumber.length >= 11;
  const isStepTwoComplete = value.address.city.length > 0;

  return {
    activeStep,
    setActiveStep,
    value,
    uiExtras,
    actions,
    payload,
    summary,
    isStepOneComplete,
    isStepTwoComplete,
  };
};
```

---

## `hooks/useFeatureOnboardingPage.ts`

Lógica de navegação, submissão e disabled state — sem estado de formulário:

```ts
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { featureService } from '../services/service';
import { useFeatureOnboardingForm } from './useFeatureOnboardingForm';
import type { FeatureOnboardingSummaryData } from '../types/featureOnboarding';

const STEPS = ['Dados', 'Endereço', 'Revisão'];

export const useFeatureOnboardingPage = () => {
  const navigate = useNavigate();
  const form = useFeatureOnboardingForm();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [committedSummary, setCommittedSummary] = useState<FeatureOnboardingSummaryData>(
    form.summary,
  );
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);

  // Ref para capturar o summary no momento do clique (evita stale closure)
  const summaryRef = useRef(form.summary);
  summaryRef.current = form.summary;

  const isLastStep = form.activeStep === STEPS.length - 1;

  const createFeature = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      await featureService.create(form.payload);
      navigate('/client/features');
    } catch {
      setErrorMessage('Erro ao criar registro. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [form.payload, navigate]);

  const handleNext = useCallback(() => {
    setCommittedSummary(summaryRef.current);
    if (isLastStep) {
      void createFeature();
      return;
    }
    form.setActiveStep((current) => {
      const nextStep = Math.min(STEPS.length - 1, current + 1);
      setMaxCompletedStep((previous) => Math.max(previous, nextStep));
      return nextStep;
    });
  }, [createFeature, form, isLastStep]);

  const handleStepSelect = useCallback(
    (stepIndex: number) => {
      setCommittedSummary(summaryRef.current);
      form.setActiveStep(stepIndex);
    },
    [form],
  );

  const nextDisabled =
    (form.activeStep === 0 && !form.isStepOneComplete) ||
    (form.activeStep === 1 && !form.isStepTwoComplete) ||
    (loading && isLastStep);

  return {
    steps: STEPS,
    activeStep: form.activeStep,
    isLastStep,
    loading,
    errorMessage,
    nextDisabled,
    committedSummary,
    maxCompletedStep,
    value: form.value,
    uiExtras: form.uiExtras,
    actions: form.actions,
    handleNext,
    onBack: () => form.setActiveStep((current) => Math.max(0, current - 1)),
    onCancel: () => navigate('/client/features'),
    onStepSelect: handleStepSelect,
  };
};
```

---

## `components/onboarding/FeatureOnboardingSteps.tsx`

Componente roteador — retorna o step ativo com base no índice:

```tsx
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';
import { ReviewStep } from './ReviewStep';
import type { CreateFeatureRequest } from '../../types/feature';
import type { FeatureOnboardingUiExtras, FeatureOnboardingActions } from '../../types/featureOnboarding';

interface FeatureOnboardingStepsProps {
  activeStep: number;
  value: CreateFeatureRequest;
  uiExtras: FeatureOnboardingUiExtras;
  actions: FeatureOnboardingActions;
}

export const FeatureOnboardingSteps = ({
  activeStep,
  value,
  uiExtras,
  actions,
}: FeatureOnboardingStepsProps) => {
  const sharedProps = { value, uiExtras, actions };

  const stepsByIndex = [
    <StepOne key="step-one" {...sharedProps} />,
    <StepTwo key="step-two" {...sharedProps} />,
    <ReviewStep key="review" {...sharedProps} />,
  ];

  return stepsByIndex[activeStep] ?? stepsByIndex[0];
};
```

---

## Step individual — contrato de props

Todos os steps recebem o mesmo contrato de props — nunca props individuais por campo:

```tsx
// components/onboarding/StepOne.tsx
import type { CreateFeatureRequest } from '../../types/feature';
import type { FeatureOnboardingUiExtras, FeatureOnboardingActions } from '../../types/featureOnboarding';

interface StepOneProps {
  value: CreateFeatureRequest;
  uiExtras: FeatureOnboardingUiExtras;
  actions: FeatureOnboardingActions;
}

export const StepOne = ({ value, actions }: StepOneProps) => (
  <AppStack>
    <AppTextField
      label="Nome"
      value={value.name}
      onChange={(event) => actions.updateName(event.target.value)}
      required
    />
    <AppTextField
      label="CPF"
      value={value.documentNumber}
      onChange={(event) => actions.updateDocumentNumber(event.target.value)}
      required
    />
  </AppStack>
);
```

> Steps usam `AppTextField` diretamente com `value`/`onChange` (modo controlado) — **não** usam React Hook Form internamente, pois o estado está centralizado no hook do wizard.

---

## `pages/FeatureOnboardingPage.tsx`

A page orquestra — não tem lógica:

```tsx
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { StepperWizard } from '@shared/components/navigation/StepperWizard';
import { FeatureOnboardingSteps } from '../components/onboarding/FeatureOnboardingSteps';
import { FeatureOnboardingSummary } from '../components/onboarding/FeatureOnboardingSummary';
import { useFeatureOnboardingPage } from '../hooks/useFeatureOnboardingPage';

const FeatureOnboardingPage = () => {
  const {
    steps,
    activeStep,
    isLastStep,
    loading,
    errorMessage,
    nextDisabled,
    committedSummary,
    maxCompletedStep,
    value,
    uiExtras,
    actions,
    handleNext,
    onBack,
    onCancel,
    onStepSelect,
  } = useFeatureOnboardingPage();

  return (
    <AppStack direction="row" spacing={3}>
      <StepperWizard
        activeStep={activeStep}
        steps={steps}
        onBack={onBack}
        onCancel={onCancel}
        onNext={() => void handleNext()}
        isLastStep={isLastStep}
        nextLabel="Finalizar"
        nextDisabled={nextDisabled}
        nextLoading={loading && isLastStep}
      >
        {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}
        <FeatureOnboardingSteps
          activeStep={activeStep}
          value={value}
          uiExtras={uiExtras}
          actions={actions}
        />
      </StepperWizard>

      <FeatureOnboardingSummary
        summary={committedSummary}
        maxCompletedStep={maxCompletedStep}
        activeStep={activeStep}
        onStepSelect={onStepSelect}
      />
    </AppStack>
  );
};

export default FeatureOnboardingPage;
```

---

## Fluxo de dados completo

```
Usuário digita em StepOne
  ↓
actions.updateName(value) chamado
  ↓
setValue((current) => ({ ...current, name: value }))
  ↓
value atualizado no useFeatureOnboardingForm
  ↓
useMemo recalcula payload e summary
  ↓
isStepOneComplete recalculado
  ↓
nextDisabled atualizado na page

Usuário clica "Próximo"
  ↓
handleNext() chamado
  ↓
committedSummary ← snapshot do summary atual
  ↓
activeStep incrementado
  ↓
maxCompletedStep atualizado

Usuário clica "Finalizar" no último step
  ↓
createFeature() chamado
  ↓
featureService.create(form.payload) — dados já normalizados
  ↓
navigate('/client/features')
```

---

## Checklist de verificação

- [ ] Usa `StepperWizard` do shared — sem stepper customizado
- [ ] `useFeatureOnboardingForm` gerencia estado, sem lógica de navegação
- [ ] `useFeatureOnboardingPage` gerencia navegação e API, sem estado de formulário
- [ ] `useFeatureOnboardingActions` — um método por campo, sem updates genéricos
- [ ] `UiExtras` separado do `value` — dados auxiliares não entram no payload diretamente
- [ ] Normalização aplicada apenas no payload final (`toFeatureOnboardingPayload`)
- [ ] `buildFeatureSummary` é função pura, sem efeitos colaterais
- [ ] `initialFeatureValue` e `initialFeatureUiExtras` em normalizer dedicado
- [ ] Steps recebem `{ value, uiExtras, actions }` — contrato uniforme
- [ ] Steps usam `AppTextField` em modo controlado — **não** React Hook Form
- [ ] `committedSummary` é snapshot capturado no clique de "Próximo"
- [ ] `nextDisabled` calculado por step com validações explícitas
- [ ] Hooks extensão `.ts` (sem JSX)
- [ ] Page com `onNext={() => void handleNext()}` — não inlina async

## Proibido

- Criar stepper visual customizado por feature — usar sempre `StepperWizard`
- Usar React Hook Form dentro dos steps — estado é centralizado no hook do wizard
- Misturar dados de UI (`uiExtras`) com dados do payload (`value`)
- Aplicar normalização em cada step — só no payload final
- Hook de form com lógica de navegação (`handleNext`, `onBack`)
- Hook de page com estado de formulário (`value`, `uiExtras`)
- Step recebendo props individuais por campo — sempre `{ value, uiExtras, actions }`
- `isEditMode` ou condicional para "criar vs editar" no mesmo wizard
