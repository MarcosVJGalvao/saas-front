# Documentos

## Objetivo

Listar, detalhar, baixar e excluir documentos gerados.

## Rotas

- `/client/documents`
- `/client/documents/:id`

## Contratos

- `GET /documents`
- `GET /documents/:id`
- `GET /documents/:id/download`
- `DELETE /documents/:id`

## Critérios de aceite

- Downloads tratam `Blob` e nome do arquivo.
- Status e formatos traduzidos.
