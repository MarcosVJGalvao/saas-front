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

- Pages: `src/features/clients/pages`.
- Components: `src/features/clients/components`.
- Hooks: `src/features/clients/hooks`.
- Services: `src/features/clients/services`.
- Schemas: `src/features/clients/schemas`.
- Types: `src/features/clients/types`.
- Normalizers: `src/features/clients/normalizers`.

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
