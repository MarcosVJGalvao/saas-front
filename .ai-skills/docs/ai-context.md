# AI Context

## Stack

Projeto frontend usando React, Vite, TypeScript, Material UI, Recharts, Zod, React Hook Form, TanStack Query, Zustand ou Context quando necessário, Vitest e Testing Library.

## Arquitetura

A aplicação segue Clean Architecture adaptada para frontend.

```txt
src/
  app/
    providers/
    router/
    guards/
    theme/
    store/
    error-boundary/

  shared/
    components/
    hooks/
    services/
    utils/
    types/
    schemas/
    formatters/
    parsers/
    masks/
    normalizers/
    i18n/
    assets/

  features/
    client/
      feature-name/
        components/
        pages/
        hooks/
        services/
        schemas/
        types/
        normalizers/
        specs/

    platform/
      feature-name/
        components/
        pages/
        hooks/
        services/
        schemas/
        types/
        normalizers/
      specs/

  pages/
    HomePage.tsx

  main.tsx
```

## Fluxo padrão

```txt
Page -> Hook -> Service -> HttpClient -> API
```

- Page orquestra componentes.
- Hook encapsula comportamento e estado.
- Service faz comunicação externa.
- Schema valida dados.
- Normalizer monta payload.
- Component renderiza.
- Theme define visual.

## Convenção de busca em listas

- Busca textual geral deve ser enviada apenas por `search`.
- Não duplicar busca textual em query params paralelos como `name`, `fullName`, `documentNumber`, `registrationCode`, `registerNumber` ou `enrollmentCode`.
- Filtros estruturados continuam separados quando representam dimensões específicas, como `status`, `type`, `code`, `startDate`, `endDate`, `academicYearId` e `schoolClassId`.

## Organização de features por contexto

As features devem ficar separadas por domínio de acesso:

- `src/features/client/*`: fluxos e telas do contexto client.
- `src/features/platform/*`: fluxos e telas do contexto platform.

Não criar features diretamente em `src/features/*` fora desses dois contextos sem decisão arquitetural explícita.

## Pages públicas neutras

Páginas públicas que não pertencem ao contexto `client` nem ao contexto `platform` podem ficar em `src/pages`.

A rota raiz `/` usa `src/pages/HomePage.tsx` como entrada temporária para direcionar o usuário ao login da plataforma ou ao login do cliente.

## Regras proibidas

- Não usar `any`.
- Não usar `as`.
- Não usar `as const`.
- Não usar casting/type assertion.
- Não usar `@ts-ignore`.
- Não usar `@ts-expect-error` sem justificativa formal.
- Não usar `eslint-disable`.
- Não alterar ESLint para liberar má prática.
- Não colocar regra de negócio em page.
- Não chamar API em page.
- Não chamar API em componente visual.
- Não usar MUI cru em page se existir wrapper compartilhado.
- Não usar cor hardcoded.
- Não usar typography hardcoded.
- Não usar máscara, parser ou formatter diretamente na page quando existir utilitário ou normalizer.

## UI e idioma

- Tudo exibido ao usuário deve estar em português.
- Enums vindos do backend em inglês devem ser traduzidos para português.
- Erros técnicos não devem ser exibidos diretamente.
- Mensagens devem vir de `shared/i18n/pt-BR`.
- Inputs podem exibir máscara, mas payload enviado ao backend deve ser limpo.
- Datas exibem `dd/MM/yyyy` e enviam `yyyy-MM-dd`.
- Documento e telefone exibem com máscara e enviam apenas dígitos.
- Valores monetários exibem formatados e enviam número limpo.

## Context economy

- Não carregar todas as skills para toda tarefa.
- Não ler o projeto inteiro.
- Não reescrever contexto sem decisão nova.
- Usar specs curtas e objetivas por feature.
- Atualizar este arquivo apenas quando houver decisão arquitetural relevante.

## Breakpoints globais

Responsividade centralizada em `src/app/theme/tokens/breakpoints.ts` com 3 níveis:

- mobile
- tablet
- desktop

Novos componentes e pages devem usar apenas essas chaves.
