# 05 — Component Usage Skill

## Objetivo

Garantir que pages e features usem componentes compartilhados do projeto, evitando duplicação e inconsistência visual.

## Regras obrigatórias

- Usar `AppButton` em vez de `Button` do MUI diretamente.
- Usar `AppModal` em vez de `Modal` ou `Dialog` diretamente.
- Usar `AppSnackbar` para feedback.
- Usar `AppLayout` nas pages que precisam da estrutura padrão.
- Usar `AppSelect` para selects.
- Usar `AppDatePicker` para datas.
- Usar `AppSkeleton` ou `AppCircularProgress` para loading.
- Usar `AppForm` ou `AppStepForm` para formulários.
- Usar componentes de máscara para documento, telefone, moeda e data.

## Antes de criar um componente novo

Verificar se já existe algo em:

```txt
shared/components/
```

## Quando criar componente específico da feature

Criar em `features/<feature>/components` quando:

- O componente só faz sentido naquela feature.
- Ele usa termos específicos do domínio.
- Ele compõe vários componentes compartilhados.

## Quando promover para shared

Mover para `shared/components` quando:

- O mesmo padrão aparecer em mais de uma feature.
- O componente for visual e genérico.
- O componente não depender de regra de domínio.

## Proibido

- Criar botão específico em page sem necessidade.
- Repetir layout manual com Box/Grid em várias páginas.
- Espalhar componentes MUI crus pelas pages.
- Criar snackbar manual por tela.
- Traduzir enum manualmente dentro do JSX.

## Tabela rápida de substituição

- `@mui/material/Button` -> `AppButton`
- `@mui/material/Dialog` -> `AppDialog` ou `AppModal`
- `@mui/material/Snackbar` -> `AppSnackbar`
- `@mui/material/Select` -> `AppSelect`
- `@mui/x-date-pickers` direto -> `AppDatePicker`
