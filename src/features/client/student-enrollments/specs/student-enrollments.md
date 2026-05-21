# Matrículas

## Objetivo

Gerenciar matrículas do contexto cliente/tenant com listagem, detalhes, criação guiada em steps, edição e exclusão.

## Rotas

- `/client/student-enrollments`
- `/client/student-enrollments/new`
- `/client/student-enrollments/:id`
- `/client/student-enrollments/:id/edit`

## Componentes usados

- `QueryDataTable`
- `PageHeader`
- `StepperWizard`
- `EntityDetailsPage`
- Componentes de onboarding específicos de matrícula

## Estados da tela

- loading
- empty
- error
- success após criação
- unauthorized
- forbidden
- submitting

## Regras de negócio

- Criar matrícula via `POST /api/student-enrollments`.
- Payload deve enviar `studentId` quando aluno existente for selecionado.
- Payload deve enviar `student` quando a matrícula criar aluno junto.
- `academic.academicYearId` e `academic.enrollmentDate` são obrigatórios.
- Deve existir responsável principal quando aluno novo for informado.

## Contratos de dados

- `CreateStudentEnrollmentRequest`
- `StudentEnrollment`
- `StudentEnrollmentQueryParams`

## Schemas Zod

- `studentEnrollmentCreateForm.schema.ts`
- `studentEnrollmentEditForm.schema.ts`

## Services necessários

- `studentEnrollmentService.list`
- `studentEnrollmentService.getById`
- `studentEnrollmentService.create`
- `studentEnrollmentService.update`
- `studentEnrollmentService.remove`
- `studentEnrollmentService.downloadEnrollmentContract`

## Hooks necessários

- `useStudentEnrollmentsList`
- `useStudentEnrollmentsListPage`
- `useStudentEnrollmentDetailsPage`
- `useStudentEnrollmentOnboardingForm`
- `useStudentEnrollmentOnboardingActions`
- `useStudentEnrollmentOnboardingPage`
- `useStudentEnrollmentEditPage`

## Normalização de UI e payload

- Documento e telefone saem apenas com dígitos.
- Data sai em `yyyy-MM-dd`.
- Campos opcionais vazios não devem ser enviados como texto vazio.

## Mensagens de erro

- Traduzir por `errorCode`.
- Fallback: `Ocorreu um erro inesperado. Tente novamente.`

## Enums exibidos ao usuário

- `EnrollmentStatus`
- `StudentStatus`
- `DocumentType`
- `Gender`
- `MaritalStatus`
- `Nationality`
- `GuardianRelationshipType`

## Critérios de aceite

- Criação de matrícula envia payload normalizado.
- Onboarding replica a experiência visual do onboarding de cliente.
- Lista e detalhes usam componentes compartilhados.
- Textos exibidos em PT-BR.

## Testes esperados

- Schema de criação.
- Normalizer de payload.
- Service de criação.
- Onboarding: bloqueio de steps e submit final.
