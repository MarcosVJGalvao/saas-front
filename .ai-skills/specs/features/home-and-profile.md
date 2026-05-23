# Home And Profile

## Objetivo

Substituir as homes atuais de `platform` e `client` por páginas de entrada elegantes em `/platform/home` e `/client/home`, e criar páginas de `Meu Perfil` em `/platform/me` e `/client/me` usando a rota `me`.

## Rotas

- `/platform/home`
- `/client/home`
- `/platform/me`
- `/client/me`

## Contratos

### Platform `me`

- `id`
- `email`
- `name`
- `status`
- `roles`
- `permissions`

### Client `me`

- `id`
- `tenantId`
- `email`
- `name`
- `status`
- `permissions`
- `client.role`
- `tenant.id`
- `tenant.name`

## Regras da feature

- Manter `/platform/home` e `/client/home` como entrada pós-login.
- Conectar o item `Meu perfil` do menu superior à rota correspondente ao domínio autenticado.
- Reaproveitar `usePlatformProfile` e `useClientProfile` como fonte do `me`.
- `Meu Perfil` deve seguir o padrão canônico de details page.
- `Platform` não possui endpoint explícito de alteração de senha no frontend atual.
- `Client` possui `changePassword`, mas esta entrega não criará formulário novo sem fluxo visual consolidado.
- Ação de senha nesta versão será CTA segura:
  - `client`: navegar para `/client/forgot-password`
  - `platform`: navegar para `/platform/login`

## Home curada

### Platform

- Hero com saudação e contexto administrativo.
- Cards com status, quantidade de papéis e permissões.
- Atalhos para `Clientes`, `Planos`, `Assinaturas` e `Meu Perfil`.
- Bloco de ações recomendadas para operação.

### Client

- Hero com saudação e contexto do tenant.
- Cards com status, tenant, papel e permissões.
- Atalhos para módulos principais disponíveis por permissão.
- Bloco de próximos passos e contexto operacional.

## Estados por page

- `loading`
- `error`
- `empty`
- `ready`
- `unauthorized` quando suportado pelo `EntityDetailsPage`
- `forbidden` quando suportado pelo `EntityDetailsPage`

## Testes

- Navegação do `ProfileMenu` para `Meu Perfil`.
- Hooks/páginas de home com sucesso, erro e vazio.
- Perfil com renderização por estado.
- Atalhos condicionados por permissões quando aplicável.

## Critérios de aceite

- O login continua redirecionando para `/platform/home` e `/client/home`.
- `Meu perfil` do menu abre a página correta.
- Homes novas exibem layout elegante, em PT-BR e responsivo.
- Perfis exibem dados da rota `me` e CTA de senha sem expor detalhes técnicos.
- `lint`, `typecheck` e `test` passam ao final.
