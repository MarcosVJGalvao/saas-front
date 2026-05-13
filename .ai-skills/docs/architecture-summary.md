# Architecture Summary

## Responsabilidades

## app

Contém configuração global da aplicação:

- Providers
- Router
- Guards
- Theme
- Store global
- Error Boundary

## shared

Contém tudo que pode ser reutilizado por múltiplas features:

- Componentes base
- Hooks genéricos
- Services compartilhados
- Formatters
- Parsers
- Masks
- Normalizers
- i18n
- Utils
- Types
- Schemas comuns

## features

Contém regras específicas de domínio. Cada feature pode possuir:

- Pages específicas
- Components específicos
- Hooks específicos
- Services específicos
- Schemas específicos
- Types específicos
- Normalizers específicos
- Specs específicas

## pages

Pages devem ser finas e apenas orquestrar componentes. A lógica deve ficar em hooks, services, normalizers, schemas ou guards.

## main.tsx

O arquivo `main.tsx` deve apenas inicializar a aplicação com `ReactDOM.createRoot`, `StrictMode`, `AppProviders` e `AppRouter`.
