# Checklist de remediacao de selects, datas e filtros

## Infraestrutura compartilhada

- [x] Criar `useAdminReferenceOptions` com carregamento de perfis via `clientRolesService.list`
- [x] Expor `roleOptions` em `useAdminReferenceOptions`
- [x] Expor `loading` e `errorMessage` em `useAdminReferenceOptions`
- [x] Criar `useStudentEnrollmentReferenceOptions` com `studentService.list`
- [x] Adicionar `academicYearOptions` em `useStudentEnrollmentReferenceOptions`
- [x] Adicionar `schoolClassOptions` em `useStudentEnrollmentReferenceOptions`
- [x] Adicionar `studentOptions` em `useStudentEnrollmentReferenceOptions`
- [x] Expor `loading` e `errorMessage` em `useStudentEnrollmentReferenceOptions`
- [x] Criar `usePlatformSubscriptionReferenceOptions` com `clientsService.list`
- [x] Adicionar `tenantOptions` em `usePlatformSubscriptionReferenceOptions`
- [x] Adicionar `planOptions` em `usePlatformSubscriptionReferenceOptions`
- [x] Expor `loading` e `errorMessage` em `usePlatformSubscriptionReferenceOptions`
- [x] Expandir `useAcademicReferenceOptions` para suportar uso em paginas de serie
- [x] Expandir `useAcademicReferenceOptions` para suportar opcoes de professor usando `employeeService.list`
- [x] Expandir `useFinancialReferenceOptions` para fornecer opcoes de matricula
- [x] Expandir `useFinancialReferenceOptions` para fornecer opcoes de turma
- [x] Expandir `useReportCardReferenceOptions` para cenarios de entries/processings/queries
- [x] Garantir que `useReportCardReferenceOptions` exponha `studentOptions`
- [x] Garantir que `useReportCardReferenceOptions` exponha `studentEnrollmentOptions`
- [x] Garantir que `useReportCardReferenceOptions` exponha `schoolClassOptions`
- [x] Reaproveitar `useAttendanceReferenceOptions` em telas de listagem/filtro
- [x] Criar constante compartilhada para status `active/inactive`
- [x] Criar constante compartilhada para metodos de pagamento
- [x] Consolidar opcoes traduzidas de `assessmentType` do boletim
- [x] Padronizar `planId` da plataforma para usar wrapper compartilhado em vez de `Controller + AppSelect` cru
- [x] Definir estrategia de data para onboarding sem mascara manual na UI final
- [x] Atualizar checklist com observacao de bloqueio para `EmployeeCreatePage.personId` se continuar sem fonte oficial de pessoas

## Create/Edit academico

- [x] Trocar `status` por `FormSelect` em `EducationLevelCreatePage`
- [x] Trocar `status` por `FormSelect` em `EducationLevelEditPage`
- [x] Trocar `status` por `FormSelect` em `GradeCreatePage`
- [x] Trocar `educationLevelId` por `FormSelect` em `GradeCreatePage`
- [x] Exibir erro de `referenceOptions` em `GradeCreatePage`
- [x] Trocar `status` por `FormSelect` em `GradeEditPage`
- [x] Trocar `educationLevelId` por `FormSelect` em `GradeEditPage`
- [x] Exibir erro de `referenceOptions` em `GradeEditPage`
- [x] Trocar `status` por `FormSelect` em `SubjectCreatePage`
- [x] Trocar `status` por `FormSelect` em `SubjectEditPage`

## Create/Edit admin

- [x] Trocar `status` por `FormSelect` em `ClientRoleCreatePage`
- [x] Trocar `status` por `FormSelect` em `ClientRoleEditPage`
- [x] Trocar `roleId` por `FormSelect` em `ClientUserCreatePage`
- [x] Trocar `status` por `FormSelect` em `ClientUserCreatePage`
- [x] Exibir erro de `referenceOptions` em `ClientUserCreatePage`
- [x] Trocar `roleId` por `FormSelect` em `ClientUserEditPage`
- [x] Trocar `status` por `FormSelect` em `ClientUserEditPage`
- [x] Exibir erro de `referenceOptions` em `ClientUserEditPage`

## Matricula edit e onboarding

- [x] Trocar `academicYearId` por `FormSelect`
- [x] Trocar `schoolClassId` por `FormSelect`
- [x] Trocar `enrollmentDate` por `FormDatePicker`
- [x] Exibir erro de `referenceOptions`
- [x] Garantir reset correto dos valores vindos de `getById`
- [x] Trocar campo de ano letivo por select remoto
- [x] Trocar campo de turma por select remoto
- [x] Trocar `enrollmentDate` mascarada por componente de data adequado ao wizard
- [x] Remover texto de ID manual de ano letivo
- [x] Remover texto de ID manual de turma
- [x] Trocar `selectedStudentId` por select remoto de aluno existente
- [x] Remover texto de ID manual de aluno existente
- [x] Trocar `dateOfBirth` mascarada por componente de data adequado ao wizard
- [x] Manter fluxo alternativo de criacao manual do aluno funcionando
- [x] Verificar se ha fonte oficial de responsaveis existentes reutilizavel
- [x] Registrar no checklist que nao existe hoje campo de responsavel legal existente
- [x] Nao implementar select de responsavel existente sem fonte oficial e regra de produto
- [x] Trocar exibicao de `academicYearId` por label amigavel
- [x] Trocar exibicao de `schoolClassId` por label amigavel
- [x] Trocar exibicao de `selectedStudentId` por nome amigavel quando disponivel

## Funcionarios

- [x] Trocar `status` por `FormSelect` em `EmployeeCreatePage`
- [x] Verificar se `personId` pode usar fonte oficial de pessoas
- [x] Registrar bloqueio explicito no checklist para `personId`
- [x] Trocar `status` por `FormSelect` em `EmployeeEditPage`

## Plataforma / assinaturas

- [x] Trocar `tenantId` por `FormSelect`
- [x] Trocar `planId` por wrapper compartilhado
- [x] Trocar `startDate` por `FormDatePicker`
- [x] Trocar `renewalDate` por `FormDatePicker`
- [x] Trocar `trialEndsAt` por `FormDatePicker`
- [x] Verificar se `endDate` deve aparecer no formulario
- [x] Exibir erro de `referenceOptions`
- [x] Trocar `tenantId` por `FormSelect` em edicao
- [x] Trocar `planId` por wrapper compartilhado em edicao
- [x] Trocar `startDate` por `FormDatePicker` em edicao
- [x] Trocar `renewalDate` por `FormDatePicker` em edicao
- [x] Trocar `trialEndsAt` por `FormDatePicker` em edicao
- [x] Verificar se `endDate` deve aparecer no formulario de edicao
- [x] Exibir erro de `referenceOptions` em edicao

## Filtros academicos

- [x] Trocar `teacherId` por `select` na criacao
- [x] Trocar `subjectId` por `select` na criacao
- [x] Trocar `teacherId` por `select` nos filtros
- [x] Trocar `subjectId` por `select` nos filtros
- [x] Reaproveitar `status` como select traduzido consistente
- [x] Ajustar `clear` da criacao para os novos selects
- [x] Ajustar `clearFilters` para os novos selects

## Filtros de frequencia

- [x] Trocar filtro `schoolClassId` por `select`
- [x] Trocar filtro `subjectId` por `select`
- [x] Trocar filtro `schoolClassId` por `select` em resumos
- [x] Trocar filtro `studentId` por `select`
- [x] Validar select de `status` com labels consistentes

## Filtros de financeiro

- [x] Trocar filtro `categoryId` por `select` em contas a pagar
- [x] Trocar filtro `costCenterId` por `select` em contas a pagar
- [x] Trocar filtro `paymentMethod` por `select` traduzido em contas a pagar
- [x] Trocar filtro `categoryId` por `select` em contas a receber
- [x] Trocar filtro `costCenterId` por `select` em contas a receber
- [x] Trocar filtro `studentId` por `select` em contas a receber
- [x] Trocar filtro `studentEnrollmentId` por `select` em contas a receber
- [x] Trocar filtro `schoolClassId` por `select` em contas a receber
- [x] Trocar filtro `paymentMethod` por `select` traduzido em contas a receber

## Boletim operacional

- [x] Trocar `studentEnrollmentId` por `select` no formulario individual
- [x] Trocar `subjectId` por `select` no formulario individual
- [x] Trocar `academicPeriodId` por `select` no formulario individual
- [x] Trocar `assessmentType` por `select` no formulario individual
- [x] Trocar `schoolClassId` por `select` no lote de criacao
- [x] Trocar `subjectId` por `select` no lote de criacao
- [x] Trocar `academicPeriodId` por `select` no lote de criacao
- [x] Trocar `studentEnrollmentId` por `select` no lote de criacao
- [x] Trocar `secondStudentEnrollmentId` por `select` no lote de criacao
- [x] Trocar `thirdStudentEnrollmentId` por `select` no lote de criacao
- [x] Trocar `assessmentType` por `select` no lote de criacao
- [x] Trocar `secondAssessmentType` por `select` no lote de criacao
- [x] Trocar `thirdAssessmentType` por `select` no lote de criacao
- [x] Trocar `schoolClassId` por `select` no lote de atualizacao
- [x] Trocar `assessmentType` por `select` no lote de atualizacao
- [x] Trocar `secondAssessmentType` por `select` no lote de atualizacao
- [x] Trocar `thirdAssessmentType` por `select` no lote de atualizacao
- [x] Trocar `updateAssessmentType` por `select` na atualizacao individual
- [x] Manter `entryId`, `firstEntryId`, `secondEntryId`, `thirdEntryId`, `bulkEntryIds` como texto nesta fase
- [x] Registrar no checklist que IDs operacionais ficaram fora desta fase por decisao explicita
- [x] Trocar `studentEnrollmentId` por `select` em processamentos
- [x] Trocar `schoolClassId` por `select` em processamentos
- [x] Trocar `academicPeriodId` por `select` em processamentos
- [x] Manter `processingId` como texto nesta fase
- [x] Trocar `studentId` por `select` em consultas
- [x] Trocar `schoolClassId` por `select` em consultas

## Atualizacao de hooks, normalizers e resumo amigavel

- [x] Garantir que hooks de page retornem `referenceOptions` quando a page passar a depender de select remoto
- [x] Garantir que paginas exibam `referenceOptions.errorMessage`
- [x] Garantir que normalizers continuem enviando IDs limpos para a API
- [x] Garantir que normalizers de data convertam corretamente UI -> payload
- [x] Garantir que edicao/reset preserve IDs e labels corretos
- [x] Garantir que `EnrollmentReviewStep` nao exiba IDs crus quando label estiver disponivel
- [x] Garantir que placeholders em ingles sejam removidos das areas corrigidas
- [x] Garantir que labels finais de UI estejam em PT-BR

## Testes

- [x] Criar/atualizar testes de `useAdminReferenceOptions`
- [x] Criar/atualizar testes de `useStudentEnrollmentReferenceOptions`
- [x] Criar/atualizar testes de `usePlatformSubscriptionReferenceOptions`
- [x] Atualizar testes dos hooks expandidos de `academic`, `financial`, `attendance`, `report-cards`
- [x] Atualizar testes de normalizer de matricula para datas/selects
- [x] Atualizar testes de normalizer de assinatura para datas/selects
- [x] Atualizar testes de enums/opcoes traduzidas
- [x] Adicionar smoke test de `StudentEnrollmentEditPage`
- [x] Adicionar smoke test do onboarding de matricula
- [x] Adicionar smoke test de `ClientUserCreate/EditPage`
- [x] Adicionar smoke test de `SubscriptionCreate/EditPage`
- [x] Adicionar smoke test de `TeacherSubjectsPage`
- [x] Adicionar smoke test de filtros de financeiro
- [x] Adicionar smoke test de `ReportCardEntriesPage`
- [x] Adicionar smoke test de `ReportCardProcessingsPage`
- [x] Adicionar smoke test de `ReportCardQueriesPage`

## Bloqueios documentados

- [x] `EmployeeCreatePage.personId` continua texto porque o frontend ainda nao possui fonte oficial de pessoas existente para selecao
- [x] O onboarding de matricula nao possui hoje campo de responsavel legal existente
- [x] `entryId`, `firstEntryId`, `secondEntryId`, `thirdEntryId`, `bulkEntryIds` e `processingId` continuam texto por serem identificadores operacionais

## Gate final

- [x] Verificar se todos os checks implementaveis do arquivo estao marcados
- [x] Verificar se bloqueios estao documentados explicitamente
- [x] Rodar auditoria de compliance
- [x] Procurar ocorrencias de label de ID manual nas areas ajustadas
- [x] Procurar placeholders de ID manual nas areas ajustadas
- [x] Procurar placeholder `active ou inactive` nas areas ajustadas
- [x] Procurar `regular, recovery, final ou other` nas areas ajustadas
- [x] Procurar `type="date"` nas areas ajustadas
- [x] Procurar `maskDateInput(` nas areas ajustadas
- [x] Procurar caracteres de substituicao e `U+FFFD` nas areas ajustadas
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`
- [x] Registrar no checklist que o gate ficou 100% verde
- [x] Registrar no checklist os itens bloqueados que ficaram fora por dependencia externa
