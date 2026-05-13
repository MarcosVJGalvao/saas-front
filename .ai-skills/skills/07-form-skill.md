# 07 — Form Skill

## Objetivo

Padronizar formulários com React Hook Form, Zod, componentes reutilizáveis, máscara de exibição e normalização de payload.

## Regras obrigatórias

- Todo formulário deve usar React Hook Form.
- Toda validação deve usar Zod.
- Tipos devem vir de `z.infer` quando aplicável.
- Não validar formulário manualmente na page.
- Campos reutilizáveis devem ficar em `shared/components/form`.
- Formulários específicos ficam dentro da feature.
- Formulário de login deve ser separado por conter lógica específica de autenticação.
- Inputs de documento, telefone, data e moeda devem exibir máscara.
- Payload deve ser normalizado antes de ir para o service.

## Estrutura recomendada

```txt
features/users/
  schemas/
    userForm.schema.ts
  types/
    user.types.ts
  components/
    UserForm.tsx
  hooks/
    useUserForm.ts
  normalizers/
    normalizeUserFormPayload.ts
```

## Fluxo correto

```txt
AppInput mascarado -> React Hook Form -> Zod -> Normalizer -> Service -> Backend
```

## Proibido

- Validação manual com `if` espalhado.
- Duplicar tipo e schema.
- Misturar submit com lógica visual complexa.
- Fazer `replace` de máscara dentro da page.
- Enviar data em formato visual ao backend.
- Enviar moeda formatada ao backend.

## Datas

- Exibir: `dd/MM/yyyy`.
- Enviar: `yyyy-MM-dd`.

## Documento e telefone

- Exibir com máscara.
- Enviar apenas dígitos.

## Moeda

- Exibir em formato brasileiro.
- Enviar número limpo ao backend.
