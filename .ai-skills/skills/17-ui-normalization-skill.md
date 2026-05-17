# 17 — UI Normalization Skill

## Objetivo

Garantir que dados exibidos ao usuário sejam amigáveis, localizados em português e mascarados quando necessário, sem contaminar os dados enviados ao backend.

## Regra principal

```txt
Usuário vê dado amigável em português e mascarado.
Backend recebe dado técnico, limpo e padronizado.
```

## Estrutura recomendada

```txt
shared/
  formatters/
    dateFormatter.ts
    currencyFormatter.ts
    documentFormatter.ts
    phoneFormatter.ts

  parsers/
    dateParser.ts
    currencyParser.ts
    documentParser.ts
    phoneParser.ts

  masks/
    documentMask.ts
    phoneMask.ts
    currencyMask.ts
    dateMask.ts

  normalizers/
    normalizeFormPayload.ts
```

## Regras obrigatórias

- Todo enum recebido em inglês deve ser exibido em português.
- Todo campo de documento deve exibir com máscara e enviar sem máscara.
- Todo campo de telefone deve exibir com máscara e enviar sem máscara.
- Todo campo monetário deve exibir formatado e enviar valor limpo.
- Todo campo de data deve exibir em `dd/MM/yyyy` e enviar em `yyyy-MM-dd`.
- Nenhuma page deve implementar máscara manualmente.
- Nenhuma page deve traduzir enum manualmente.
- Nenhuma page deve formatar payload manualmente.
- Toda normalização deve ficar em `shared/formatters`, `shared/parsers`, `shared/masks` ou `shared/normalizers`.
- Normalização específica de uma feature deve ficar em `features/<feature>/normalizers`.

## Exemplos de formato

### Documento

```txt
UI: 123.456.789-00
API: 12345678900
```

### Telefone

```txt
UI: (11) 99999-9999
API: 11999999999
```

### Data

```txt
UI: 25/09/1900
API: 1900-09-25
```

### Moeda

```txt
UI: R$ 1.250,90
API: 1250.9
```

## Proibido

```tsx
status === 'ACTIVE' ? 'Ativo' : 'Inativo';
cpf.replace(/\D/g, '');
```

Dentro de page ou JSX.

## Correto

```tsx
translateEnum('userStatus', status);
parseDocument(cpf);
normalizeUserFormPayload(formData);
```

## Normalizer da feature

Cada feature deve possuir normalizers quando o payload enviado ao backend for diferente do estado do formulário.

```txt
features/users/normalizers/normalizeUserFormPayload.ts
```

## Responsabilidades

### Mask

Define como o usuário digita ou visualiza o valor.

### Formatter

Converte dado técnico para exibição.

### Parser

Converte dado visual para formato técnico.

### Normalizer

Monta payload final para o backend.
