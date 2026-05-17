# 01 — Project Architecture Skill

## Objetivo

Garantir que o projeto siga Clean Architecture, separação de responsabilidades e organização por features.

## Estrutura obrigatória

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
    constants/
    formatters/
    parsers/
    masks/
    normalizers/
    i18n/
    assets/

  features/
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
  main.tsx
```

## Responsabilidades

### app

- Inicialização global.
- Providers.
- Router.
- Guards.
- Theme.
- Store global.
- Error Boundary.

### shared

- Componentes reutilizáveis.
- Hooks genéricos.
- Services reutilizáveis.
- Formatters, parsers, masks e normalizers genéricos.
- i18n centralizado.
- Types e schemas compartilhados.

### features

- Domínio específico.
- Componentes específicos da feature.
- Hooks específicos.
- Services específicos.
- Schemas específicos.
- Normalização de payloads específicos.

### pages

- Apenas composição e orquestração.
- Não devem conter regra de negócio complexa.

## Fluxo padrão

```txt
Page -> Hook -> Service -> HttpClient -> API
```

## Regras

- `shared` não pode depender de `features`.
- `features` podem depender de `shared`.
- `app` pode compor providers, guards, router e theme.
- Pages devem depender de hooks e componentes.
- Services devem depender do `httpClient`.
- Components devem depender do theme e props, não de APIs.

### Regra crítica de dependência

- É proibido qualquer import de `src/shared/**` apontando para `src/features/**`.

Anti-pattern:

```ts
// shared/services/httpClient.ts
import { platformSessionService } from '@features/platform-auth/storage/platformSessionService';
```

Padrão correto:

```ts
// shared depende apenas de shared/app/contracts neutros
import { notifySessionExpired } from '@shared/services/sessionEvents';
```

## Checklist de dependências por camada

- `shared` importa somente `shared` (e libs externas).
- `features` podem importar `shared`.
- `app` pode compor `features` e `shared`.
- `pages` não importam `httpClient` diretamente.

## Proibido

- Chamada de API dentro de page.
- Regra de negócio dentro de componente visual.
- Configuração global dentro de feature.
- Componentes compartilhados dependendo de features.
- Código duplicado entre features.
- Page importando `httpClient` diretamente.
- `main.tsx` inicializando regras de domínio.
