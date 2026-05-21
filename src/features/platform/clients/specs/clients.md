# Spec - Clients

## Objetivo

Gerenciar clientes da plataforma com listagem, criação, edição, detalhes e onboarding completo.

## Rotas

- `/platform/clients`: lista clientes.
- `/platform/clients/new`: cria cliente.
- `/platform/clients/:id`: exibe detalhes.
- `/platform/clients/:id/edit`: edita cliente.
- `/platform/clients/onboarding`: executa onboarding guiado.

## Entidade

- `Client`: dados cadastrais, documento, contato, status, tenant, plano, assinatura e endereços.
- Documento: CPF/CNPJ/RG/PASSAPORTE/OUTRO.
- Status: ativo ou inativo.

## Camadas

- Pages: `src/features/platform/clients/pages`.
- Components: `src/features/platform/clients/components`.
- Hooks: `src/features/platform/clients/hooks`.
- Services: `src/features/platform/clients/services`.
- Schemas: `src/features/platform/clients/schemas`.
- Types: `src/features/platform/clients/types`.
- Normalizers: `src/features/platform/clients/normalizers`.

## Fluxo

```txt
Page -> Hook -> Service -> HttpClient -> API
```

## Normalização

- Documento e telefone são enviados apenas com dígitos.
- E-mail é enviado em minúsculas.
- Textos opcionais vazios são removidos do payload.
- Datas e payloads do onboarding são normalizados antes do envio.

## Estados de tela

- Loading, error e empty na listagem/detalhes.
- Submitting em criação, edição e onboarding.
- Drawer de detalhes na listagem.
- Feedback de erro e sucesso via componentes compartilhados.

## Critérios de aceite

- Sem import de MUI cru em `src/features`.
- Sem import relativo profundo.
- UI em português.
- Compliance, lint, typecheck e testes verdes.
