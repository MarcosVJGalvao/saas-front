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
