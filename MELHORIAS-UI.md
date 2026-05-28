# Checklist de Melhorias de UI/UX

Marque cada item com `[x]` à medida que for concluído.

---

## 1. Tela de Redefinição / Alteração de Senha

- [x] Ajustar container de `ResetPasswordPage` (max-width 420px, campos fullWidth, botão large)
- [x] Ajustar container de `ForgotPasswordPage` (mesma correção)
- [x] Criar `ClientChangePasswordPage` — página interna sem banner de login
- [x] Criar `PlatformChangePasswordPage` — página interna sem banner de login
- [x] Adicionar rotas internas `/client/change-password` e `/platform/change-password` em `AppRouter`
- [x] Atualizar normalizers de perfil para navegar para rota interna (`/client/change-password`, `/platform/change-password`)
- [x] Criar hook `useClientChangePasswordPage` com campos currentPassword, newPassword, confirmPassword
- [x] Criar hook `usePlatformChangePasswordPage` (idem)
- [x] Adicionar endpoint `changePassword` nos serviços de plataforma

---

## 2. Tela de Perfil — Client

- [x] Criar componente `PermissionChipList` (chips MUI com overflow `+N` expansível)
- [x] Atualizar normalizer `clientProfileDetails.normalizer.tsx` — passar `PermissionChipList` como value
- [x] Remover `summarizePermissions` (texto corrido)

---

## 3. Tela de Perfil — Platform

- [x] Atualizar normalizer `platformProfileDetails.normalizer.tsx` — usar `PermissionChipList`
- [x] Corrigir bug de reload: `AuthProvider` agora prefere a sessão do domínio da URL atual

---

## 4. Telas de Detalhes (EntityDetailsPage)

- [x] Melhorar `DetailsSection` — separador (borderBottom) entre título e conteúdo, título `body2 fontWeight 600`
- [x] Melhorar `InfoItem` — label sem uppercase, `text.secondary` natural, tamanho `0.72rem`
- [x] Grid responsivo mantido: 3 cols desktop / 2 tablet / 1 mobile

---

## 5. Botões (AppButton / tema global)

- [x] Ajustar `src/app/theme/mui/components.ts` — `MuiButton`: `borderRadius: 8`, `paddingTop/Bottom: 10`, `paddingLeft/Right: 20`, `minHeight: 40`, `fontWeight: 600`, `fontSize: 0.875rem`

---

## 6. Tela de Relatórios Financeiros

- [x] Redesenhar `FinancialReportsPage` — grid 2 colunas desktop / 1 mobile
- [x] Cards melhores: ícone em container colorido, título `subtitle2`, descrição `body2 text.secondary`
- [x] Botão "Gerar relatório" outlined, alinhado à direita do card
- [x] Ícones específicos por tipo de relatório

---

## 7. Formulários com Pessoa Existente / Nova

- [x] Criar `PersonSearchAutocomplete` — Autocomplete com debounce 350ms, busca `/api/persons`
- [x] Substituir campo UUID de `personId` por `PersonSearchAutocomplete` no formulário de funcionários
- [x] CEP auto-fill (onBlur) já estava implementado em `EmployeeCreateFormFields` — mantido

---

## 8. Tela de Perfis (Roles) — Lista

- [x] Ajustar colunas: remover Permissões (não existe na listagem), E-mail e Status (não vêm na API)
- [x] Mostrar: Nome, Descrição
- [x] Refatorar `buildAdminEntityColumns` para suportar `showDescription`, `showEmail`, `showStatus`

---

## 9. Tela de Criar / Editar Perfil (Role)

- [x] Adicionar endpoint `listPermissions` em `adminEndpoints` (`GET /api/permissions`)
- [x] Adicionar tipo `ClientPermission` e `ClientPermissionsListResponse` em `types.ts`
- [x] Criar hook `usePermissionsList` — busca 200 permissões na montagem
- [x] Criar componente `PermissionMultiSelect` — Autocomplete múltiplo com chips e renderOption com descrição
- [x] Atualizar schema de criação: remover `status`, adicionar `permissionIds: z.array(z.string().uuid()).default([])`
- [x] Atualizar schema de edição: adicionar `name` e `permissionIds`, remover `status`
- [x] Atualizar normalizer `clientRoleForm.normalizer.ts` para incluir `permissionIds` em create/update
- [x] Atualizar hook `useClientRoleCreatePage` — expor `permissions` e `loadingPermissions`
- [x] Atualizar hook `useClientRoleEditPage` — idem, pré-carregar `permissionIds` do role existente
- [x] Atualizar `ClientRoleCreatePage` — adicionar `PermissionMultiSelect`
- [x] Atualizar `ClientRoleEditPage` — adicionar `PermissionMultiSelect`, remover campo `status`
- [x] Atualizar tipos `ClientRoleCreatePayload` e `ClientRoleUpdatePayload` na `admin.types.ts`

---

## 10. Modal de Sessão Expirada

- [x] Redesenhar `SessionExpiredDialog` — ícone `LockOutlined` em container circular, gradiente warning no topo, botão `contained fullWidth large`
- [x] Arquitetura de redirect já estava correta: `TOKEN_EXPIRED_EVENT` → modal → `onClose` redireciona (sem duplicidade)

---

## Responsividade

- [x] `FinancialReportsPage` — grid usa `responsive({ xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' })`
- [x] `DetailsSection` — padding usa `responsive({ xs: spacingScale.sm, md: 2.5 })`
- [x] `ClientRoleCreatePage` / `ClientRoleEditPage` — `gridColumn` usa `responsive({ xs: '1 / -1' })`
- [x] Todos os outros novos arquivos sem layout responsivo complexo — sem violações

## Quality Gate

- [x] Scan estático: sem `as`, `any`, `@ts-ignore`, `eslint-disable`, `@features` em shared
- [x] `npm run lint` — verde (0 erros)
- [x] `npm run typecheck` — verde (0 erros)
- [x] `npm test` — 220/220 testes passando
