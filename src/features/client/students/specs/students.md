# Alunos

## Objetivo

Gerenciar alunos, responsáveis, informações médicas, documentos e histórico financeiro do aluno.

## Rotas

- `/client/students`
- `/client/students/new`
- `/client/students/:id`
- `/client/students/:id/edit`

## Componentes usados

- `QueryDataTable`
- `EntityDetailsPage`
- `AppForm`
- `ConfirmDialog`

## Estados da tela

- loading
- empty
- error
- unauthorized
- forbidden
- submitting

## Contratos e services

- Integrar `GET/POST/PATCH/DELETE /students`.
- Integrar documentos acadêmicos e histórico financeiro.

## Critérios de aceite

- Dados pessoais mascarados na UI e limpos no payload.
- Detalhes com abas de resumo, responsáveis, matrículas, financeiro e documentos.
