# Plataform SaaS Frontend

Frontend da aplicação SaaS multi-contexto, construído com React, Vite, TypeScript e Material UI. O projeto separa o acesso administrativo da plataforma do acesso do cliente e mantém a implementação organizada por arquitetura, domínio e responsabilidade.

## Stack

- React 19
- Vite
- TypeScript estrito
- Material UI
- React Router
- React Hook Form
- Zod
- Axios
- Vitest e Testing Library
- ESLint e Prettier

## Como rodar o projeto

Instale as dependências:

```bash
npm install
```

Execute o ambiente local:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

A página inicial exibe duas entradas temporárias:

- Login plataforma: `/platform/login`
- Login cliente: `/client/login`

## Scripts principais

```bash
npm run dev
```

Inicia o servidor de desenvolvimento do Vite.

```bash
npm run build
```

Executa a checagem TypeScript por build e gera a versão de produção.

```bash
npm run preview
```

Serve localmente o build de produção.

```bash
npm run lint
```

Executa ESLint com cache e falha em qualquer warning.

```bash
npm run lint:fix
```

Executa correções automáticas do ESLint quando possível.

```bash
npm run typecheck
```

Executa TypeScript nos projetos da aplicação e de configuração:

```txt
tsc -p tsconfig.app.json --noEmit
tsc -p tsconfig.node.json --noEmit
```

```bash
npm run test
```

Executa a suíte de testes com Vitest.

```bash
npm run compliance
```

Executa a auditoria estática de compliance do projeto.

```bash
npm run check:all
```

Executa lint, typecheck, testes e build.

## Quality gate obrigatório

Antes de considerar uma alteração concluída, execute:

```bash
npm run compliance
npm run lint
npm run typecheck
npm run test
```

Esses comandos existem para bloquear problemas de arquitetura, imports, TypeScript, encoding, lint e regressões de teste.

## Arquitetura

O projeto segue Clean Architecture adaptada para frontend. O fluxo recomendado é:

```txt
Page -> Hook -> Service -> HttpClient -> API
```

Responsabilidades:

- Page: orquestra layout, componentes e hooks.
- Hook: concentra comportamento da tela, estado local, filtros, navegação, loading, erro e sucesso.
- Service: comunica com APIs e isola detalhes externos.
- Schema: valida dados com Zod.
- Normalizer: transforma dados de UI em payload de API e dados externos em estrutura amigável.
- Component: renderiza UI a partir de props.
- Shared: concentra recursos reutilizáveis, sem depender de features.

## Estrutura de pastas

```txt
src/
  app/
    guards/
    layout/
    providers/
    router/
    theme/

  features/
    client/
      auth/
      dashboard/
      home/

    platform/
      auth/
      clients/
      dashboard/
      home/
      plans/
      subscriptions/

  pages/

  shared/
    components/
    formatters/
    hooks/
    i18n/
    masks/
    normalizers/
    parsers/
    services/
    types/
    utils/
```

## Contextos da aplicação

O frontend trabalha com dois contextos principais dentro de `src/features`.

### Platform

Fica em `src/features/platform`.

Representa o ambiente administrativo da plataforma. É onde vivem fluxos como:

- autenticação administrativa;
- dashboard da plataforma;
- gestão de clientes;
- gestão de planos;
- gestão de assinaturas.

Rotas principais:

```txt
/platform/login
/platform/home
/platform/clients
/platform/plans
/platform/subscriptions
```

### Client

Fica em `src/features/client`.

Representa o ambiente acessado pelo cliente ou tenant. É onde vivem fluxos como:

- autenticação do cliente;
- recuperação de senha;
- home do cliente;
- dashboard do cliente.

Rotas principais:

```txt
/client/login
/client/forgot-password
/client/reset-password
/client/home
```

## Onde colocar cada tipo de código

Use `src/app` para infraestrutura global da aplicação:

- rotas;
- guards;
- providers;
- layout global;
- tema;
- error boundary.

Use `src/features/platform` para regras e telas do contexto administrativo.

Use `src/features/client` para regras e telas do contexto do cliente.

Use `src/shared` para recursos reutilizáveis entre contextos:

- componentes genéricos;
- hooks genéricos;
- services compartilhados;
- tipos compartilhados;
- máscaras;
- parsers;
- formatters;
- normalizers;
- traduções em PT-BR.

Use `src/pages` apenas para páginas públicas ou neutras que não pertencem a uma feature específica. A home raiz temporária fica nessa pasta.

## Regras importantes

- Não colocar regra de negócio em page.
- Não chamar API diretamente em page ou componente visual.
- Não deixar `shared` depender de `features`.
- Não usar imports relativos profundos quando houver alias.
- Não usar `any`, type assertion, `@ts-ignore` ou `eslint-disable`.
- Não exibir enums ou erros técnicos diretamente ao usuário.
- Toda UI deve estar em português brasileiro.
- Datas, documentos, telefones e moedas devem usar masks, parsers, formatters ou normalizers centralizados.
- Componentes visuais devem usar o Design System e componentes compartilhados.

## Aliases de import

Aliases disponíveis:

```txt
@/* -> src/*
@app/* -> src/app/*
@features/* -> src/features/*
@shared/* -> src/shared/*
@theme/* -> src/app/theme/*
```

Exemplo:

```ts
import { AppButton } from '@shared/components/inputs/AppButton';
```

## Design System

Tokens e tema ficam em:

```txt
src/app/theme/
  tokens/
  mui/
  utils/
  ThemeProvider.tsx
```

Novas telas e componentes devem usar:

- cores do tema;
- espaçamentos padronizados;
- componentes compartilhados;
- responsividade via `responsive({ mobile, tablet, desktop })`.

## Testes

Os testes ficam em `src/test` e devem cobrir principalmente:

- schemas;
- normalizers;
- parsers;
- formatters;
- hooks;
- services;
- componentes compartilhados;
- fluxos críticos.

Execute:

```bash
npm run test
```

## Compliance automatizado

O projeto possui uma auditoria em:

```txt
scripts/compliance-scan.mjs
```

Ela verifica padrões proibidos, imports problemáticos, dependência indevida de `shared` para `features`, uso indevido de MUI cru em features, encoding corrompido e TypeScript strict.
