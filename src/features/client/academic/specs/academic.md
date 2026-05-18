# Acadêmico

## Objetivo

Gerenciar anos letivos, níveis de ensino, séries, turmas, disciplinas e vínculos professor-disciplina.

## Rotas

- `/client/academic-years`
- `/client/education-levels`
- `/client/grades`
- `/client/school-classes`
- `/client/subjects`
- `/client/teacher-subjects`

## Estados da tela

- loading
- empty
- error
- forbidden
- submitting

## Contratos e services

- Integrar CRUDs acadêmicos do guia.
- Integrar ações de fechar/reabrir ano letivo e vínculos de turma.

## Critérios de aceite

- Enums acadêmicos traduzidos.
- Formulários com Zod.
- Detalhes com `EntityDetailsPage`.
