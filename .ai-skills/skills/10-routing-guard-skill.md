# 10 — Routing Guard Skill

## Objetivo

Padronizar rotas, layouts, autenticação, autorização, redirecionamentos e inicialização da aplicação.

## Estrutura

```txt
app/router/
  routes.tsx
  AppRouter.tsx
  guards/
    AuthGuard.tsx
    GuestGuard.tsx
    RoleGuard.tsx
```

## Regras

- Rotas ficam apenas em `app/router`.
- Pages não fazem proteção de rota.
- Autenticação fica em `AuthGuard`.
- Usuário logado não acessa login usando `GuestGuard`.
- Permissões ficam em `RoleGuard`.
- Redirecionamentos devem ser centralizados.
- Layouts de rota devem ser definidos no router ou em composição própria.

## main.tsx

O `main.tsx` só pode inicializar a aplicação.

Permitido:

- `ReactDOM.createRoot`.
- `StrictMode`.
- `AppProviders`.
- `AppRouter`.

Proibido:

- Chamada de API.
- Lógica de autenticação.
- Estado de feature.
- Regras de negócio.
- Definição de tema inline.
- Configuração de rotas complexas diretamente no arquivo.

## Guards

### AuthGuard

Protege rotas privadas.

### GuestGuard

Impede usuário autenticado de acessar telas públicas como login.

### RoleGuard

Valida permissões e papéis de usuário.

## Proibido

```tsx
if (!user) {
  navigate('/login');
}
```

Dentro de page.
