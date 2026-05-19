# 04 — Component Skill

## Objetivo

Criar componentes reutilizáveis, previsíveis, configuráveis, acessíveis e alinhados ao Design System.

## Estrutura recomendada

```txt
shared/components/
  data-display/
    AppList/
    AppDetails/
    AppInfo/
    AppSkeleton/
    AppCircularProgress/

  feedback/
    AppSnackbar/
    AppModal/
    AppErrorState/

  form/
    AppForm/
    AppStepForm/
    AppSelect/
    AppDatePicker/
    AppUpload/
    AppLoginForm/
    AppDocumentInput/
    AppPhoneInput/
    AppCurrencyInput/

  layout/
    AppLayout/
    AppHeader/
    AppFooter/
    AppSidebar/
    AppTopbar/
    AppFilter/

  inputs/
    AppButton/
```

## Regras

- Todo componente compartilhado deve ter props tipadas.
- Todo componente deve ter valores padrão.
- Props devem permitir override quando necessário.
- Componentes visuais não devem conter regra de negócio.
- Componentes devem ser pequenos e focados.
- Componentes devem usar theme/tokens, nunca valores hardcoded.
- Componentes devem ser acessíveis.
- Componentes devem expor API simples para as pages.
- Componentes não devem conhecer detalhes de backend.
- Componentes não devem montar payload.

## Regra: `sx` obrigatório em todo shared component

Todo shared component **deve aceitar `sx?: SxProps<Theme>`** e repassar ao elemento raiz. Isso permite que a page ajuste espaçamento, cor ou tamanho sem criar um wrapper desnecessário.

```tsx
import type { SxProps, Theme } from '@mui/material/styles';

interface MyComponentProps {
  sx?: SxProps<Theme>;
  // ...outros props
}

// elemento raiz usa array merge para não sobrescrever o sx interno:
<Box sx={[{ mb: 2 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} />
```

Quando o componente não tem sx próprio, repasse diretamente: `<Card sx={sx}>`.

## Regra: strings visíveis ao usuário vêm de `shared/i18n/pt-BR/components.ts`

Toda string padrão exibida ao usuário por um shared component deve ter seu default em `sharedComponentsI18n` (ver skill 18). Strings dentro do componente nunca são hardcoded — elas são defaults de parâmetros vindos do i18n.

```tsx
// ❌ ERRADO — hardcoded dentro do componente
confirmLabel = 'Confirmar',

// ✅ CORRETO — default vem do i18n centralizado
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
confirmLabel = sharedComponentsI18n.confirmDialog.confirmLabel,
```

Props de texto que têm default i18n devem ser **opcionais** — a page só passa quando quer sobrescrever.

## Componentes com variantes

Botões, inputs e feedbacks podem ter variantes padronizadas:

- confirm
- cancel
- back
- export
- danger
- neutral
- custom

## Exemplo de responsabilidade correta

`AppDocumentInput`:

- Exibe documento com máscara.
- Integra com React Hook Form quando necessário.
- Não envia payload.
- Não chama API.
- Não decide regra de negócio.

## Proibido

- Botão específico duplicado em múltiplas features.
- Modal específico copiado entre telas.
- Componente compartilhado acessando service de feature.
- Componente com cor hardcoded.
- Componente com regra de negócio escondida.
