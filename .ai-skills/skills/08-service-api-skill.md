# 08 — Service API Skill

## Objetivo

Centralizar comunicação externa em três arquivos com responsabilidades distintas, evitar chamadas HTTP na UI e garantir contratos tipados com o backend.

## Estrutura obrigatória — 3 arquivos por feature

```
features/feature-name/
  types/
    feature.ts          ← entidade + requests + query params (contrato com o backend)
  services/
    endpoints.ts        ← chamadas HTTP puras (só httpClient, sem await .data)
    types.ts            ← aliases de request/response (ponte entre types/ e services/)
    service.ts          ← métodos async que chamam endpoints e retornam .data
```

### Responsabilidade de cada arquivo

| Arquivo | Responsabilidade | Pode importar |
|---------|-----------------|---------------|
| `types/feature.ts` | Entidade, enums, requests, query params | nada interno |
| `services/types.ts` | Aliases `XxxListResponse`, `XxxCreatePayload`, etc. | `types/feature.ts`, `@shared/types/pagination` |
| `services/endpoints.ts` | Chamadas `httpClient.get/post/patch/delete` | `httpClient`, `services/types.ts` |
| `services/service.ts` | Métodos `async` com `await endpoint()` e retorno de `.data` | `services/endpoints.ts`, `services/types.ts` |

### O que cada arquivo NÃO pode fazer

- `endpoints.ts` — proibido ter `await` ou acessar `.data`. Só retorna a Promise do httpClient.
- `types.ts` — proibido ter lógica, funções ou imports que não sejam de tipos.
- `service.ts` — proibido importar `httpClient` diretamente.
- Hooks — proibido importar `endpoints.ts` diretamente. Sempre passam pelo `service.ts`.

## Exemplo completo

### `types/feature.ts`
```ts
export type FeatureStatus = 'active' | 'inactive';

export type Feature = {
  id: string;
  name: string;
  status: FeatureStatus;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FeatureQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: FeatureStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type CreateFeatureRequest = {
  name: string;
  status?: FeatureStatus;
  description?: string;
};

export type UpdateFeatureRequest = {
  [Key in keyof CreateFeatureRequest]?: CreateFeatureRequest[Key];
};
```

### `services/types.ts`
```ts
import type { Feature, FeatureQueryParams, CreateFeatureRequest, UpdateFeatureRequest } from '../types/feature';
import type { PaginatedResponse } from '@shared/types/pagination';

export type FeatureListResponse = PaginatedResponse<Feature>;
export type FeatureDetailsResponse = Feature;
export type FeatureCreateResponse = Feature;
export type FeatureUpdateResponse = Feature;
export type FeatureDeleteResponse = void;

export type FeatureListParams = FeatureQueryParams;
export type FeatureCreatePayload = CreateFeatureRequest;
export type FeatureUpdatePayload = UpdateFeatureRequest;
```

### `services/endpoints.ts`
```ts
import { httpClient } from '@shared/services/httpClient';
import type {
  FeatureListParams, FeatureListResponse, FeatureDetailsResponse,
  FeatureCreatePayload, FeatureCreateResponse,
  FeatureUpdatePayload, FeatureUpdateResponse, FeatureDeleteResponse,
} from './types';

const BASE_PATH = '/api/features';

export const featureEndpoints = {
  list: (params: FeatureListParams) =>
    httpClient.get<FeatureListResponse>(BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),

  getById: (id: string) =>
    httpClient.get<FeatureDetailsResponse>(`${BASE_PATH}/${id}`),

  create: (payload: FeatureCreatePayload) =>
    httpClient.post<FeatureCreateResponse>(BASE_PATH, payload),

  update: (id: string, payload: FeatureUpdatePayload) =>
    httpClient.patch<FeatureUpdateResponse>(`${BASE_PATH}/${id}`, payload),

  remove: (id: string) =>
    httpClient.delete<FeatureDeleteResponse>(`${BASE_PATH}/${id}`),
};
```

### `services/service.ts`
```ts
import { featureEndpoints } from './endpoints';
import type {
  FeatureListParams, FeatureListResponse, FeatureDetailsResponse,
  FeatureCreatePayload, FeatureCreateResponse,
  FeatureUpdatePayload, FeatureUpdateResponse,
} from './types';

export const featureService = {
  async list(params: FeatureListParams): Promise<FeatureListResponse> {
    const { data } = await featureEndpoints.list(params);
    return data;
  },

  async getById(id: string): Promise<FeatureDetailsResponse> {
    const { data } = await featureEndpoints.getById(id);
    return data;
  },

  async create(payload: FeatureCreatePayload): Promise<FeatureCreateResponse> {
    const { data } = await featureEndpoints.create(payload);
    return data;
  },

  async update(id: string, payload: FeatureUpdatePayload): Promise<FeatureUpdateResponse> {
    const { data } = await featureEndpoints.update(id, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await featureEndpoints.remove(id);
  },
};
```

## Métodos extras (além do CRUD)

```ts
// services/endpoints.ts
activate: (id: string) =>
  httpClient.patch<FeatureUpdateResponse>(`${BASE_PATH}/${id}/activate`),

// services/service.ts
async activate(id: string): Promise<FeatureUpdateResponse> {
  const { data } = await featureEndpoints.activate(id);
  return data;
},
```

## Fluxo

```
Page -> Hook -> service.ts -> endpoints.ts -> httpClient -> API
```

## Proibido

```tsx
// ❌ — chamada HTTP em page ou componente
await fetch('/api/features');
await httpClient.get('/api/features');

// ❌ — hook importando endpoints diretamente
import { featureEndpoints } from '../services/endpoints';

// ❌ — service.ts importando httpClient diretamente
import { httpClient } from '@shared/services/httpClient';

// ❌ — arquivo único mesclando endpoints + service + tipos
export const featureService = createClientCrudService<...>('/api/features');
```
