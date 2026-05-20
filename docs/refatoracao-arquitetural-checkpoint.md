# Checkpoint de Refatoração Arquitetural

## Cabeçalho

- Objetivo geral: refatorar integralmente o projeto para a estrutura canônica definida em `AGENTS.md`, nas skills obrigatórias e em `docs/plano-refatoracao-padronizacao-arquitetural.md`.
- Data de criação: 2026-05-19
- Plano-base de referência: `docs/plano-refatoracao-padronizacao-arquitetural.md`
- Regras mandatórias:
  - execução estritamente módulo a módulo
  - nenhum arquivo legado pode permanecer ao final do módulo
  - nenhum módulo pode ficar com padrão misto após sua conclusão
  - remoção de rotas/menu/pages autônomas de `people`, `contacts`, `addresses`, `medical-info` e `person-documents`
  - preservação integral do estilo visual atual
  - a referência estrutural obrigatória é sempre a skill, nunca a implementação atual da feature
  - apenas `shared` pode ser reaproveitado como base estável entre refatorações
  - qualquer estrutura interna de feature que não siga a skill deve ser refeita e o legado excluído
- Definição de pronto global:
  - pages, hooks, services, schemas e normalizers uniformizados
  - sem hooks exportando componentes
  - sem pages genéricas concentrando comportamento de feature
  - sem services monolíticos fora do padrão
  - `lint`, `typecheck` e `test` verdes

## Estrutura-alvo obrigatória

Todo módulo deve convergir, quando aplicável, para:

```txt
types/
schemas/
normalizers/
services/
  endpoints.ts
  types.ts
  service.ts
hooks/
  useFeatureList.ts
  useFeatureListPage.ts
  useFeatureDetailsPage.ts
  useFeatureCreatePage.ts
  useFeatureEditPage.ts
components/
  featureListColumns.tsx
pages/
  FeaturePage.tsx
  FeatureDetailsPage.tsx
  FeatureCreatePage.tsx
  FeatureEditPage.tsx
```

Regras complementares:

- Regra global de reconstrução:
  - reaproveitar somente componentes, helpers e contratos realmente compartilhados em `shared`
  - não usar feature atual como referência arquitetural se divergir da skill
  - pages, hooks, schemas, normalizers e services devem ser reescritos no padrão final
  - adaptar não é suficiente; a feature deve terminar nativa no padrão canônico
- Details padrão A:
  - entidades simples
  - hook retorna `entity`, `loading`, `errorMessage`, `onBack`, `onRetry`
  - page usa `SectionCard` e `KeyValueGrid` diretamente
- Details padrão B:
  - entidades com header, tabs, seções e dados derivados
  - hook retorna `viewState`, `data`, `errorMessage`, `onBack`, `onRetry`
  - normalizer monta `headerData` e `tabs`
  - page usa `PageHeader` + `EntityDetailsPage`
- Create e Edit:
  - separados
  - `location.state.entity` como preload no edit
  - GET só como fallback
- Exclusão:
  - arquivo antigo substituído deve ser removido
  - não usar deprecated
  - não manter compatibilidade paralela

## Ordem oficial de execução

### Etapa 0. Preparação global

- [x] validar plano-base
- [x] mapear rotas, menus e permissões
- [x] mapear módulos removidos como navegáveis
- [x] mapear pages em `components/`
- [x] mapear hooks `.tsx` sem necessidade
- [x] mapear services monolíticos
- [ ] mapear schemas fora do padrão em todos os módulos
- [ ] mapear normalizers ausentes em todos os módulos
- [x] registrar inventário inicial

### Etapa 1. Remoção da navegação dos módulos reutilizáveis

Módulos que deixam de existir como menu/rota/page:

- `people`
- `contacts`
- `addresses`
- `medical-info`
- `person-documents`

Checklist:

- [x] remover do menu
- [x] remover lazy imports
- [x] remover rotas
- [x] remover permissões exclusivamente ligadas à navegação autônoma
- [ ] remover ações de navegação residual
- [ ] manter apenas contratos reutilizáveis necessários

### Etapa 2. Refatoração módulo a módulo

Ordem oficial:

1. `client/students`
2. `client/student-enrollments`
3. `client/employees`
4. `platform/clients`
5. `client/academic`
6. `client/report-cards`
7. `client/financial`
8. `client/admin`
9. `client/attendance`
10. `client/auth` e `platform/auth`
11. `platform/plans`
12. `platform/subscriptions`
13. `client/dashboard`, `client/home`, `platform/dashboard`, `platform/home`
14. alinhamentos finais em `shared`

## Módulo: platform/plans

### Identificação

- Nome: `plans`
- Domínio: `platform`
- Prioridade: 11
- Dependências de entrada:
  - `platform/auth`
  - componentes compartilhados de list, form e details
- Dependências de saída:
  - `platform/subscriptions`
  - onboarding e seleção comercial em `platform/clients`

### Inventário atual

- Pages atuais:
  - `PlansListPage.tsx`
  - `PlanCreatePage.tsx`
  - `PlanEditPage.tsx`
  - `PlanDetailsPage.tsx`
- Hooks atuais:
  - `usePlansList.ts`
  - `usePlansListPage.ts`
  - `usePlanCreatePage.ts`
  - `usePlanEditPage.ts`
  - `usePlanDetailsPage.ts`
- Components atuais:
  - `planListColumns.tsx`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `planCreateForm.schema.ts`
  - `planEditForm.schema.ts`
- Normalizers atuais:
  - `planForm.normalizer.ts`
  - `planDetails.normalizer.ts`
- Testes relacionados:
  - `src/test/features/plans/planPayloadNormalizer.test.ts`

### Estrutura-alvo do módulo

- List page alvo:
  - `hooks/usePlansList.ts`
  - `hooks/usePlansListPage.ts`
  - `components/planListColumns.tsx`
  - `pages/PlansListPage.tsx`
- Details page alvo:
  - `hooks/usePlanDetailsPage.ts`
  - `normalizers/planDetails.normalizer.ts`
  - `pages/PlanDetailsPage.tsx`
- Create page alvo:
  - `schemas/planCreateForm.schema.ts`
  - `normalizers/planForm.normalizer.ts`
  - `hooks/usePlanCreatePage.ts`
  - `pages/PlanCreatePage.tsx`
- Edit page alvo:
  - `schemas/planEditForm.schema.ts`
  - `hooks/usePlanEditPage.ts`
  - `pages/PlanEditPage.tsx`

### Anti-padrões já confirmados

- `ViewModel` em list, details, create e edit
- presentation helper para colunas e mobile
- wrapper de details em componente intermediário
- schema único
- normalizer antigo fora do naming final
- mutações em hook genérico auxiliar, em vez de fluxo explícito por page

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] reescrever list page no padrão canônico
- [x] reescrever details page no padrão canônico
- [x] reescrever create page no padrão canônico
- [x] reescrever edit page no padrão canônico
- [x] separar schemas por create/edit
- [x] separar normalizers de form e details
- [x] excluir `ViewModel`, presentation helper, details wrapper e schema legado
- [x] atualizar teste do normalizer
- [ ] validar integração com `platform/subscriptions`
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `lint`: bloqueado fora do módulo por `addresses`, `contacts`, `documents`, `medical-info`, `people`, `person-documents` e débitos atuais em `shared`
  - `compliance`: bloqueado fora do módulo pelos mesmos módulos antigos

### Status

- `concluído`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `plans` sem legado estrutural residual

## Módulo: platform/subscriptions

### Identificação

- Nome: `subscriptions`
- Domínio: `platform`
- Prioridade: 12
- Dependências de entrada:
  - `platform/plans`
  - `platform/clients`
  - componentes compartilhados de list, form e details
- Dependências de saída:
  - visões administrativas de tenant e cobrança
  - dashboards e home da plataforma

### Inventário atual

- Pages atuais:
  - `SubscriptionsListPage.tsx`
  - `SubscriptionCreatePage.tsx`
  - `SubscriptionEditPage.tsx`
  - `SubscriptionDetailsPage.tsx`
- Hooks atuais:
  - `useSubscriptionsList.ts`
  - `useSubscriptionsListPage.ts`
  - `useSubscriptionCreatePage.ts`
  - `useSubscriptionEditPage.ts`
  - `useSubscriptionDetailsPage.ts`
- Components atuais:
  - `subscriptionListColumns.tsx`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `subscriptionCreateForm.schema.ts`
  - `subscriptionEditForm.schema.ts`
- Normalizers atuais:
  - `subscriptionForm.normalizer.ts`
  - `subscriptionDetails.normalizer.ts`
- Testes relacionados:
  - `src/test/features/subscriptions/subscriptionPayloadNormalizer.test.ts`
  - `src/test/hooks/useSubscriptionsList.test.ts`

### Estrutura-alvo do módulo

- List page alvo:
  - `hooks/useSubscriptionsList.ts`
  - `hooks/useSubscriptionsListPage.ts`
  - `components/subscriptionListColumns.tsx`
  - `pages/SubscriptionsListPage.tsx`
- Details page alvo:
  - `hooks/useSubscriptionDetailsPage.ts`
  - `normalizers/subscriptionDetails.normalizer.ts`
  - `pages/SubscriptionDetailsPage.tsx`
- Create page alvo:
  - `schemas/subscriptionCreateForm.schema.ts`
  - `normalizers/subscriptionForm.normalizer.ts`
  - `hooks/useSubscriptionCreatePage.ts`
  - `pages/SubscriptionCreatePage.tsx`
- Edit page alvo:
  - `schemas/subscriptionEditForm.schema.ts`
  - `hooks/useSubscriptionEditPage.ts`
  - `pages/SubscriptionEditPage.tsx`

### Anti-padrões já confirmados

- `ViewModel` em list, details, create e edit
- helper de filtros separado da page sem necessidade canônica
- presentation helper para colunas, métricas e mobile
- wrapper de details em componente intermediário
- schema único
- normalizer antigo fora do naming final
- mutações genéricas em hook auxiliar

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] reescrever list page no padrão canônico
- [x] reescrever details page no padrão canônico
- [x] reescrever create page no padrão canônico
- [x] reescrever edit page no padrão canônico
- [x] separar schemas por create/edit
- [x] separar normalizers de form e details
- [x] excluir `ViewModel`, filters helper, presentation helper, details wrapper e schema legado
- [x] atualizar testes do normalizer e hook de listagem
- [ ] validar integração com `platform/plans` e `platform/clients`
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `lint`: bloqueado fora do módulo por `addresses`, `contacts`, `documents`, `medical-info`, `people`, `person-documents` e débitos atuais em `shared`
  - `compliance`: bloqueado fora do módulo pelos mesmos módulos antigos

### Status

- `concluído`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `subscriptions` sem legado estrutural residual

## Inventário inicial consolidado

- Rotas autônomas a remover:
  - `/client/people`
  - `/client/contacts`
  - `/client/addresses`
  - `/client/medical-info`
  - `/client/person-documents`
- Itens de menu a remover:
  - `people`
  - `contacts`
  - `addresses`
  - `medical-info`
  - `person-documents`
- Módulos com pages ainda em `components/`:
  - `client/academic`
  - `client/admin`
  - `client/financial`
  - `client/report-cards`
- Módulos com service monolítico mapeado:
  - `client/students`
  - `client/addresses`
  - `client/contacts`
  - `client/medical-info`
  - `client/people`
  - `client/financial`
  - `client/admin`
  - `client/attendance`
  - `client/report-cards`
  - `client/documents`
  - `client/employees`

## Módulo: client/students

### Identificação

- Nome: `students`
- Domínio: `client`
- Prioridade: 1
- Dependências de entrada:
  - rotas de aluno e responsável legal
  - compartilhamento de pessoa/contato/endereço/documento
- Dependências de saída:
  - `student-enrollments`
  - `employees`
  - futura consolidação de contratos reutilizáveis

### Inventário atual

- Pages atuais:
  - `StudentsPage.tsx`
  - `StudentCreatePage.tsx`
  - `StudentEditPage.tsx`
  - `StudentDetailsPage.tsx`
  - `LegalGuardiansPage.tsx`
  - `LegalGuardianCreatePage.tsx`
  - `LegalGuardianEditPage.tsx`
  - `LegalGuardianDetailsPage.tsx`
- Hooks atuais:
  - `useStudentsList.ts`
  - `useStudentsListPageViewModel.ts`
  - `useStudentDetailsPageViewModel.tsx`
  - `useStudentBasicFormPageViewModel.ts`
  - `useLegalGuardiansList.ts`
  - `useLegalGuardiansListPageViewModel.ts`
  - `useLegalGuardianDetailsPageViewModel.ts`
- Components atuais:
  - `StudentBasicFormPage.tsx`
  - `studentsListPresentation.tsx`
  - `legalGuardiansListPresentation.tsx`
- Services atuais:
  - `studentServices.ts`
- Schemas atuais:
  - `studentBasicFormSchema.ts`
- Normalizers atuais:
  - `studentBasicFormNormalizer.ts`
- Rotas:
  - `/client/students/*`
  - `/client/legal-guardians/*`
- Menu:
  - `students`
  - `legal-guardians`
- Testes relacionados:
  - não mapeados neste checkpoint inicial

### Estrutura-alvo do módulo

- List pages alvo:
  - `StudentsPage.tsx`
  - `LegalGuardiansPage.tsx`
- Details pages alvo:
  - `StudentDetailsPage.tsx`
  - `LegalGuardianDetailsPage.tsx`
- Create pages alvo:
  - `StudentCreatePage.tsx`
  - `LegalGuardianCreatePage.tsx`
- Edit pages alvo:
  - `StudentEditPage.tsx`
  - `LegalGuardianEditPage.tsx`
- Hooks alvo:
  - `useStudentsList.ts`
  - `useStudentsListPage.ts`
  - `useStudentDetailsPage.ts`
  - `useStudentCreatePage.ts`
  - `useStudentEditPage.ts`
  - `useLegalGuardiansList.ts`
  - `useLegalGuardiansListPage.ts`
  - `useLegalGuardianDetailsPage.ts`
  - `useLegalGuardianCreatePage.ts`
  - `useLegalGuardianEditPage.ts`
- Services alvo:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Contratos reutilizáveis envolvidos:
  - pessoa
  - contatos
  - endereços
  - documentos
- Integrações com shared:
  - `EntityDetailsPage`
  - `AppForm`
  - `FormActions`
  - `ListFilters`
  - `QueryDataTable`

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] definir estrutura-alvo do módulo
- [x] criar services no padrão de 3 arquivos
- [x] separar list hooks e page hooks
- [x] remover details content exportado por hook
- [x] separar create e edit com hooks próprios
- [x] criar normalizers de details
- [x] criar builders de coluna dedicados
- [x] reescrever pages
- [x] excluir arquivos antigos substituídos
- [ ] validar rotas do módulo
- [ ] validar navegação entre pages
- [ ] validar integrações com `student-enrollments`
- [x] validar testes do módulo
- [ ] validar quality gate do módulo

### Riscos

- dependência do fluxo de matrícula para “Nova matrícula”
- risco de quebra em navegação detalhes -> edição
- risco de contratos duplicados durante futura extração para `shared`
- risco de comportamento divergente ao remover services antigos

### Status

- `em refatoração`

### Evidências atuais

- `typecheck`: verde
- `test`: verde

## Módulo: client/attendance

### Identificação

- Nome: `attendance`
- Domínio: `client`
- Prioridade: 9
- Dependências de entrada:
  - `academic`
  - `students`
  - `student-enrollments`
- Dependências de saída:
  - consolidados acadêmicos
  - relatórios de frequência

### Inventário atual

- Pages atuais:
  - `AttendanceSchedulesPage.tsx`
  - `AttendanceScheduleCreatePage.tsx`
  - `AttendanceRecordsPage.tsx`
  - `AttendanceSummariesPage.tsx`
- Hooks atuais:
  - `useAttendanceFilters.ts`
  - `useAttendanceSchedulesList.ts`
  - `useAttendanceSchedulesPage.ts`
  - `useAttendanceScheduleCreatePage.ts`
  - `useAttendanceSummariesList.ts`
  - `useAttendanceSummariesPage.ts`
  - `useAttendanceRecordCreatePage.ts`
- Components atuais:
  - `attendanceScheduleListColumns.tsx`
  - `attendanceSummaryListColumns.tsx`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `attendanceScheduleCreateForm.schema.ts`
  - `attendanceRecordCreateForm.schema.ts`
- Normalizers atuais:
  - `attendanceScheduleForm.normalizer.ts`
  - `attendanceRecordForm.normalizer.ts`

### Estrutura-alvo do módulo

- List pages alvo:
  - `AttendanceSchedulesPage.tsx`
  - `AttendanceSummariesPage.tsx`
  - hooks de dados e hooks de page separados
  - builders JSX apenas em `components/*ListColumns.tsx`
- Create flows alvo:
  - `AttendanceScheduleCreatePage.tsx`
  - `AttendanceRecordsPage.tsx`
  - normalizers próprios para payload
- Services alvo:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`

### Anti-padrões já confirmados

- service monolítico
- schemas agrupados em arquivo único
- normalizers agrupados em arquivo único
- listagens acopladas a presentations antigas
- forms em `ViewModel`

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] migrar services para o padrão final
- [x] separar schemas por fluxo
- [x] separar normalizers por fluxo
- [x] refatorar listagem de horários
- [x] refatorar criação de horários
- [x] refatorar lançamento de frequência
- [x] refatorar listagem de resumos
- [x] excluir presentations e arquivos antigos substituídos
- [ ] validar integrações com `academic` e `student-enrollments`
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `lint`: bloqueado fora do módulo por `addresses`, `contacts`, `documents`, `medical-info`, `people`, `person-documents` e débitos atuais em `shared`
  - `compliance`: bloqueado fora do módulo por `addresses`, `contacts`, `documents`, `medical-info` e `people`

### Status

- `concluído`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `lint`: sem bloqueios residuais em `attendance`; falha global restante está fora do módulo
- `compliance`: sem bloqueios residuais em `attendance`; falha global restante está fora do módulo

## Módulo: client/academic

### Identificação

- Nome: `academic`
- Domínio: `client`
- Prioridade: 5
- Dependências de entrada:
  - `students`
  - `student-enrollments`
  - `employees`
- Dependências de saída:
  - `report-cards`
  - `attendance`
  - integrações acadêmicas em módulos consumidores

### Inventário atual

- Subdomínios refatorados nesta etapa:
  - `academic-years`
  - `school-classes`
  - `education-levels`
  - `grades`
  - `subjects`
  - `teacher-subjects`
- Hooks atuais:
  - `useAcademicYearsList.ts`
  - `useAcademicYearsListPage.ts`
  - `useAcademicYearDetailsPage.ts`
  - `useAcademicYearCreatePage.ts`
  - `useAcademicYearEditPage.ts`
  - `useSchoolClassesList.ts`
  - `useSchoolClassesListPage.ts`
  - `useSchoolClassDetailsPage.ts`
  - `useSchoolClassCreatePage.ts`
  - `useSchoolClassEditPage.ts`
  - `useAcademicCatalogList.ts`
  - `useAcademicCatalogListPage.ts`
  - `useAcademicCatalogDetailsPage.ts`
  - `useAcademicCatalogCreatePage.ts`
  - `useAcademicCatalogEditPage.ts`
  - `useTeacherSubjectsList.ts`
  - `useTeacherSubjectsListPage.ts`
- Components atuais:
  - `academicYearListColumns.tsx`
  - `schoolClassListColumns.tsx`
  - `academicCatalogListColumns.tsx`
  - `teacherSubjectListColumns.tsx`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `academicYearCreateForm.schema.ts`
  - `academicYearEditForm.schema.ts`
  - `schoolClassCreateForm.schema.ts`
  - `schoolClassEditForm.schema.ts`
  - `academicCatalogCreateForm.schema.ts`
  - `academicCatalogEditForm.schema.ts`
- Normalizers atuais:
  - `academicYearFormNormalizer.ts`
  - `academicYearDetails.normalizer.ts`
  - `schoolClassFormNormalizer.ts`
  - `schoolClassDetails.normalizer.ts`
  - `academicCatalogFormNormalizer.ts`
  - `academicCatalogDetails.normalizer.ts`

### Estrutura-alvo do módulo

- List pages alvo:
  - pages reais por subdomínio, sem wrappers genéricas
  - hooks de list e hooks de page separados
  - builders JSX apenas em `components/*ListColumns.tsx`
- Details pages alvo:
  - `academic-years`, `school-classes`, `education-levels`, `grades` e `subjects` no padrão canônico
- Create/Edit pages alvo:
  - `academic-years`
  - `school-classes`
  - `education-levels`
  - `grades`
  - `subjects`
- Services alvo:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`

### Anti-padrões já confirmados

- pages genéricas em `components/`
- `ViewModel` legado para catálogo e vínculos docentes
- hooks com JSX e componente exportado no legado
- service monolítico
- pages de create/edit herdando do mesmo arquivo

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] refatorar `academic-years`
- [x] refatorar `school-classes`
- [x] refatorar `education-levels`
- [x] refatorar `grades`
- [x] refatorar `subjects`
- [x] refatorar `teacher-subjects`
- [x] substituir wrappers genéricas de catálogo por pages canônicas reais
- [x] migrar services para `endpoints.ts`, `types.ts` e `service.ts`
- [x] excluir arquivos antigos substituídos
- [ ] validar integrações com `report-cards` e `attendance`
- [ ] validar quality gate do módulo
  - `compliance`: bloqueado fora do módulo por `addresses`, `contacts`, `documents`, `medical-info` e `people`
  - `lint`: bloqueado fora do módulo e em `shared`
  - `typecheck`: verde
  - `test`: verde

### Status

- `em refatoração`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `compliance`: sem bloqueios residuais em `academic`; falha global restante está em módulos ainda antigos
- `lint`: `academic` saiu dos bloqueios estruturais principais, mas a rodada global ainda falha por módulos legados e débitos atuais em `shared`

## Módulo: client/report-cards

### Identificação

- Nome: `report-cards`
- Domínio: `client`
- Prioridade: 6
- Dependências de entrada:
  - `academic`
  - `student-enrollments`
- Dependências de saída:
  - `attendance`
  - relatórios e dashboards acadêmicos

### Inventário atual

- Catálogo refatorado nesta etapa:
  - `academic-periods`
  - `grade-subjects`
- Fluxos operacionais refatorados nesta etapa:
  - `entries`
  - `queries`
  - `processings`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `reportCardAcademicPeriodCreateForm.schema.ts`
  - `reportCardGradeSubjectCreateForm.schema.ts`
  - `reportCardEntryFormSchema.ts`
- Normalizers atuais:
  - `reportCardCatalogForm.normalizer.ts`
  - `reportCardCatalogDetails.normalizer.ts`
  - `reportCardEntryFormNormalizer.ts`

### Estrutura-alvo do módulo

- Catálogo alvo:
  - list/details/create separados para `academic-periods`
  - list/details/create separados para `grade-subjects`
  - hooks canônicos e sem pages genéricas
- Fluxos operacionais alvo:
  - `entries`, `queries` e `processings` sem `ViewModel` legado
  - services consumidos apenas via hooks
- Services alvo:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`

### Anti-padrões já confirmados

- service monolítico
- catálogo com create inline dentro da list page
- pages genéricas em `components/`
- details genérico com montagem de UI no hook
- hooks com sufixo `ViewModel` em fluxos operacionais

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] migrar services para o padrão final
- [x] refatorar `academic-periods` para list/details/create separados
- [x] refatorar `grade-subjects` para list/details/create separados
- [x] excluir componentes genéricos antigos do catálogo
- [x] atualizar rotas para create explícito do catálogo
- [x] refatorar `entries`
- [x] refatorar `queries`
- [x] refatorar `processings`
- [x] excluir hooks legados restantes do módulo
- [ ] validar integrações com `academic`
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `compliance`: módulo limpo; rodada global ainda bloqueada por `addresses`, `contacts`, `documents`, `medical-info` e `people`
  - `lint`: módulo limpo no escopo da feature; rodada global ainda bloqueada por módulos legados e por débitos atuais em `shared`

### Status

- `em refatoração`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `compliance`: sem bloqueios residuais em `report-cards`; falha global restante está fora do módulo
- `lint`: sem bloqueios residuais em `report-cards`; falha global restante está fora do módulo
- catálogo e fluxos operacionais já seguem a estrutura final do módulo

## Módulo: client/financial

### Identificação

- Nome: `financial`
- Domínio: `client`
- Prioridade: 7
- Dependências de entrada:
  - `students`
  - `student-enrollments`
  - `academic`
- Dependências de saída:
  - dashboards administrativos
  - relatórios financeiros
  - integrações futuras com inadimplência e cobrança

### Regra especial de UX

- o visual atual do módulo deve ser preservado
- a preservação visual não autoriza manter wrappers genéricos, `ViewModel` ou service monolítico
- toda implementação interna deve seguir a skill canônica de list, form, details e reports

### Inventário atual

- Pages atuais:
  - `FinancialCategoriesPage.tsx`
  - `FinancialCategoryCreatePage.tsx`
  - `FinancialCategoryEditPage.tsx`
  - `FinancialCategoryDetailsPage.tsx`
  - `FinancialCostCentersPage.tsx`
  - `FinancialCostCenterCreatePage.tsx`
  - `FinancialCostCenterEditPage.tsx`
  - `FinancialCostCenterDetailsPage.tsx`
  - `AccountsReceivablePage.tsx`
  - `AccountsReceivableCreatePage.tsx`
  - `AccountsReceivableEditPage.tsx`
  - `AccountsReceivableDetailsPage.tsx`
  - `AccountsPayablePage.tsx`
  - `AccountsPayableCreatePage.tsx`
  - `AccountsPayableEditPage.tsx`
  - `AccountsPayableDetailsPage.tsx`
  - `FinancialTransactionsPage.tsx`
  - `FinancialTransactionDetailsPage.tsx`
  - `FinancialDashboardPage.tsx`
  - `FinancialReportsPage.tsx`
- Hooks atuais:
  - `useFinancialCategoriesList.ts`
  - `useFinancialCategoriesListPage.ts`
  - `useFinancialCategoryCreatePage.ts`
  - `useFinancialCategoryEditPage.ts`
  - `useFinancialCategoryDetailsPage.ts`
  - `useFinancialCostCentersList.ts`
  - `useFinancialCostCentersListPage.ts`
  - `useFinancialCostCenterCreatePage.ts`
  - `useFinancialCostCenterEditPage.ts`
  - `useFinancialCostCenterDetailsPage.ts`
  - `useAccountsReceivableList.ts`
  - `useAccountsReceivableListPage.ts`
  - `useAccountsReceivableCreatePage.ts`
  - `useAccountsReceivableEditPage.ts`
  - `useAccountsReceivableDetailsPage.ts`
  - `useAccountsPayableList.ts`
  - `useAccountsPayableListPage.ts`
  - `useAccountsPayableCreatePage.ts`
  - `useAccountsPayableEditPage.ts`
  - `useAccountsPayableDetailsPage.ts`
  - `useFinancialTransactionsList.ts`
  - `useFinancialTransactionsPage.ts`
  - `useFinancialTransactionDetailsPage.ts`
  - `useFinancialDashboardPage.ts`
  - `useFinancialReportsPage.ts`
- Components atuais:
  - `financialEntityListColumns.tsx`
  - `financialRecordListColumns.tsx`
  - `financialTransactionListColumns.tsx`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `financialCategoryCreateForm.schema.ts`
  - `financialCategoryEditForm.schema.ts`
  - `financialCostCenterCreateForm.schema.ts`
  - `financialCostCenterEditForm.schema.ts`
  - `accountsReceivableCreateForm.schema.ts`
  - `accountsReceivableEditForm.schema.ts`
  - `accountsPayableCreateForm.schema.ts`
  - `accountsPayableEditForm.schema.ts`
- Normalizers atuais:
  - `financialCategoryForm.normalizer.ts`
  - `financialCostCenterForm.normalizer.ts`
  - `accountsReceivableForm.normalizer.ts`
  - `accountsPayableForm.normalizer.ts`
  - `financialEntityDetails.normalizer.ts`
  - `financialRecordDetails.normalizer.ts`
  - `financialSettlementNormalizer.ts`

### Estrutura-alvo do módulo

- List pages alvo:
  - list pages reais para categorias, centros de custo, contas a receber, contas a pagar e transações
  - hooks de dados e hooks de page separados
  - JSX de colunas isolado em builders dedicados
- Details pages alvo:
  - details no padrão B para contas e entidades financeiras
  - transação financeira com hook próprio e `EntityDetailsPage`
- Create/Edit pages alvo:
  - create e edit separados para categorias, centros de custo, contas a receber e contas a pagar
  - payloads gerados apenas por normalizers
- Services alvo:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`

### Anti-padrões já confirmados

- pages genéricas em `components/`
- hooks `*ViewModel`
- presentations antigas para colunas e mobile cards
- service monolítico legado
- mistura de pages novas com wrappers antigos dentro da mesma feature

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] definir estrutura-alvo do módulo
- [x] migrar services para o padrão final
- [x] refatorar list/details/create/edit de categorias
- [x] refatorar list/details/create/edit de centros de custo
- [x] refatorar list/details/create/edit de contas a receber
- [x] refatorar list/details/create/edit de contas a pagar
- [x] refatorar list/details de transações financeiras
- [x] refatorar dashboard e relatórios para hooks canônicos
- [x] excluir wrappers genéricos, presentations, `ViewModel` e service legado
- [x] atualizar testes do módulo para `services/service.ts`
- [ ] validar integrações com `students` e `student-enrollments`
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `compliance`: bloqueado fora do módulo por `addresses`, `contacts`, `documents`, `medical-info` e `people`
  - `lint`: bloqueado fora do módulo por `addresses`, `contacts`, `documents`, `medical-info`, `people`, `person-documents` e débitos atuais em `shared`

### Status

- `concluído`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `lint`: sem bloqueios residuais em `financial`; falha global restante está fora do módulo
- `compliance`: sem bloqueios residuais em `financial`; falha global restante está fora do módulo
- service monolítico removido
- wrappers genéricos removidos
- hooks `ViewModel` removidos

## Módulo: platform/clients

### Identificação

- Nome: `clients`
- Domínio: `platform`
- Prioridade: 4
- Dependências de entrada:
  - `platform/plans` para seleção de plano no onboarding
  - contratos reutilizáveis de pessoa, endereço e contato
  - serviços compartilhados de endereço e tratamento de erro
- Dependências de saída:
  - `platform/subscriptions`
  - futuros fluxos administrativos e de tenant da plataforma

### Regra especial de UX

- o onboarding de `platform/clients` deve preservar a experiência visual atual
- a preservação do visual não autoriza manter `ViewModel`, schema misto ou normalizers fragmentados
- o fluxo deve terminar aderente à skill 30, com `StepperWizard`, hooks explícitos e payload final normalizado

### Inventário atual

- Pages atuais:
  - `ClientsListPage.tsx`
  - `ClientCreatePage.tsx`
  - `ClientEditPage.tsx`
  - `ClientDetailsPage.tsx`
  - `ClientOnboardingPage.tsx`
- Hooks atuais:
  - `useClientsList.ts`
  - `useClientsListFilters.ts`
  - `useClientsListPage.ts`
  - `useClientsListPageViewModel.ts`
  - `useClientDetails.ts`
  - `useClientDetailsPageViewModel.ts`
  - `useClientCreatePage.ts`
  - `useClientCreatePageViewModel.ts`
  - `useClientEditPage.ts`
  - `useClientEditPageViewModel.ts`
  - `useClientOnboardingForm.ts`
  - `useClientOnboardingActions.ts`
  - `useClientOnboardingPageViewModel.ts`
  - `useClientsMutations.ts`
- Components atuais:
  - `clientsListPresentation.tsx`
  - `clientDetailsPresentation.tsx`
  - `clientDetailsDrawerSchema.tsx`
  - `ClientFormFields.tsx`
  - `components/onboarding/*`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `clientsSchemas.ts`
- Normalizers atuais:
  - `clientPayloadNormalizer.ts`
  - `clientOnboardingNormalizer.ts`
  - `clientOnboardingInitialState.ts`
  - `clientOnboardingSummary.ts`
  - `clientOnboardingFieldNormalizers.ts`
- Rotas:
  - `/platform/clients/*`
- Menu:
  - `clients`
- Testes relacionados:
  - `clientPayloadNormalizer.test.ts`
  - `clientsHooksSmoke.test.ts`
  - `useClientsListPage.test.ts`

### Estrutura-alvo do módulo

- List page alvo:
  - `hooks/useClientsList.ts`
  - `hooks/useClientsListPage.ts`
  - `components/clientListColumns.tsx`
  - `pages/ClientsListPage.tsx`
- Details page alvo:
  - `hooks/useClientDetailsPage.ts`
  - `normalizers/clientDetails.normalizer.ts`
  - `pages/ClientDetailsPage.tsx`
- Create page alvo:
  - `schemas/clientCreateForm.schema.ts`
  - `normalizers/clientForm.normalizer.ts`
  - `hooks/useClientCreatePage.ts`
  - `pages/ClientCreatePage.tsx`
- Edit page alvo:
  - `schemas/clientEditForm.schema.ts`
  - `hooks/useClientEditPage.ts`
  - `pages/ClientEditPage.tsx`
- Onboarding alvo:
  - `schemas/clientOnboarding.schema.ts`
  - `normalizers/clientOnboarding.normalizer.ts`
  - `normalizers/clientOnboardingInitialState.ts`
  - `normalizers/clientOnboardingSummary.ts`
  - `hooks/useClientOnboardingActions.ts`
  - `hooks/useClientOnboardingForm.ts`
  - `hooks/useClientOnboardingPage.ts`
  - `components/onboarding/*`
  - `pages/ClientOnboardingPage.tsx`
- Services alvo:
  - manter `services/endpoints.ts`
  - manter `services/types.ts`
  - manter `services/service.ts`

### Anti-padrões já confirmados

- coexistência de hooks canônicos e `ViewModel`
- schema único misturando listagem, create, edit e onboarding
- create/edit baseados em schema compartilhado inadequado
- details montado por presentation helper legado
- listagem dependente de presentation helper e drawer schema legado
- onboarding fora do contrato final da skill 30
- mutações encapsuladas em hook genérico, em vez de fluxo explícito por page

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] registrar regra especial do onboarding
- [x] definir estrutura-alvo do módulo
- [x] reconstruir list page no padrão canônico
- [x] reconstruir details page no padrão canônico
- [x] reconstruir create page no padrão canônico
- [x] reconstruir edit page no padrão canônico
- [x] reconstruir onboarding no padrão skill 30 preservando a experiência visual
- [x] separar schemas por responsabilidade e naming final
- [x] consolidar normalizers no naming final
- [x] excluir `ViewModel`, presentation helpers e arquivos antigos substituídos
- [x] atualizar testes do módulo
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `compliance`: bloqueado fora do módulo por hooks antigos em `academic`, `addresses`, `contacts`, `documents`, `medical-info` e `people`
  - `lint`: bloqueado fora do módulo por hooks antigos desses módulos e por débitos atuais em `shared`

### Riscos

- risco de regressão no onboarding ao preservar a mesma experiência visual
- risco de dependência implícita com `platform/plans`
- risco de fluxo direto por URL no edit sem `location.state.entity`
- risco de contratos antigos ainda referenciados em testes

### Status

- `em refatoração`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `compliance`: módulo limpo; rodada global ainda bloqueada por módulos legados restantes
- `lint`: rodada global ainda bloqueada por módulos legados e componentes de `shared` fora do escopo desta onda
- `lint`: ainda bloqueado por débitos pré-existentes em outros módulos e componentes compartilhados fora do escopo já refatorado

## Próximos módulos

- `client/student-enrollments`: depende da estabilidade dos contratos de `students`
- `client/employees`: deve absorver padrões reutilizáveis sem depender de pages autônomas de pessoa/contato/endereço
- `platform/clients`: revisar onboarding e contratos compartilhados

## Módulo: client/student-enrollments

### Identificação

- Nome: `student-enrollments`
- Domínio: `client`
- Prioridade: 2
- Dependências de entrada:
  - contratos de `students`
  - componentes visuais de onboarding já existentes em `shared` e na experiência atual
- Dependências de saída:
  - `employees`
  - consolidação dos contratos reutilizáveis de aluno, responsável, contato, endereço e saúde

### Regra especial de UX

- `student-enrollments` deve preservar o visual e a experiência atual
- preservação visual não autoriza reaproveitar a estrutura interna atual
- a implementação deve seguir a skill mesmo quando o visual permanecer idêntico

### Inventário atual

- Pages atuais:
  - `StudentEnrollmentsListPage.tsx`
  - `StudentEnrollmentOnboardingPage.tsx`
  - `StudentEnrollmentDetailsPage.tsx`
  - `StudentEnrollmentEditPage.tsx`
- Hooks atuais:
  - `useStudentEnrollmentsList.ts`
  - `useStudentEnrollmentsListPageViewModel.ts`
  - `useStudentEnrollmentOnboardingPageViewModel.ts`
  - `useStudentEnrollmentOnboardingForm.ts`
  - `useStudentEnrollmentEditPageViewModel.ts`
  - `useStudentEnrollmentDetailsPageViewModel.tsx`
  - `useStudentEnrollmentDetails.ts`
  - `useStudentEnrollmentActions.ts`
- Components atuais:
  - `studentEnrollmentsListPresentation.tsx`
  - `components/onboarding/*`
- Services atuais:
  - `studentEnrollmentService.ts`
  - `studentEnrollmentEndpoints.ts`
- Schemas atuais:
  - `studentEnrollmentSchemas.ts`
- Normalizers atuais:
  - `studentEnrollmentSummary.ts`
  - `studentEnrollmentOnboardingNormalizer.ts`
  - `studentEnrollmentInitialState.ts`
  - `studentEnrollmentFieldNormalizers.ts`
  - `studentEnrollmentEditNormalizer.ts`
  - `studentEnrollmentEditInitialState.ts`
- Rotas:
  - `/client/student-enrollments/*`
- Menu:
  - `student-enrollments`
- Testes relacionados:
  - service
  - schemas
  - normalizers

### Estrutura-alvo do módulo

- List page alvo:
  - `hooks/useStudentEnrollmentsList.ts`
  - `hooks/useStudentEnrollmentsListPage.ts`
  - `components/studentEnrollmentListColumns.tsx`
  - `pages/StudentEnrollmentsListPage.tsx`
- Details page alvo:
  - `hooks/useStudentEnrollmentDetailsPage.ts`
  - `normalizers/studentEnrollmentDetails.normalizer.ts` se necessário
  - `pages/StudentEnrollmentDetailsPage.tsx`
- Create flow alvo:
  - preservar UX do onboarding atual
  - reestruturar internamente para o padrão das skills
  - `schemas/studentEnrollmentCreateForm.schema.ts`
  - `normalizers/studentEnrollmentForm.normalizer.ts`
  - `hooks/useStudentEnrollmentCreatePage.ts`
  - `pages/StudentEnrollmentOnboardingPage.tsx`
- Edit flow alvo:
  - `schemas/studentEnrollmentEditForm.schema.ts`
  - `hooks/useStudentEnrollmentEditPage.ts`
  - `pages/StudentEnrollmentEditPage.tsx`
- Services alvo:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`

### Anti-padrões já confirmados

- viewmodel de listagem no formato legado
- details com hook `.tsx`
- services fora do padrão de naming final
- normalizers fragmentados por fase do fluxo
- wizard com forte acoplamento ao estado atual da feature

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] registrar restrição de visual/UX
- [x] definir recorte entre visual reaproveitado e estrutura a reconstruir
- [x] redesenhar list page no padrão canônico
- [x] redesenhar details page no padrão canônico
- [x] reconstruir create/onboarding mantendo a experiência visual
- [x] reconstruir edit page no padrão canônico
- [x] consolidar schemas e normalizers no naming final
- [x] migrar services para o padrão final
- [x] excluir arquivos antigos substituídos
- [ ] validar integrações com `students`
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `lint`: bloqueado por módulos ainda fora do padrão (`addresses`, `contacts`, `documents`, `medical-info`, `people`, `person-documents`) e por débitos atuais em `shared`

### Status

- `em refatoração`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
- `lint`: módulo limpo; rodada global ainda bloqueada fora de `student-enrollments`

## Módulo: client/employees

### Identificação

- Nome: `employees`
- Domínio: `client`
- Prioridade: 3
- Dependências de entrada:
  - contratos compartilhados de pessoa reutilizável
  - alinhamento do padrão `students` e `student-enrollments`
- Dependências de saída:
  - futuros vínculos acadêmicos e administrativos
  - consolidação de contratos compartilhados para colaborador

### Inventário atual

- Pages atuais:
  - `EmployeesPage.tsx`
  - `EmployeeCreatePage.tsx`
  - `EmployeeEditPage.tsx`
  - `EmployeeDetailsPage.tsx`
- Hooks atuais:
  - `useEmployeesList.ts`
  - `useEmployeesListPage.ts`
  - `useEmployeeDetailsPage.ts`
  - `useEmployeeCreatePage.ts`
  - `useEmployeeEditPage.ts`
- Components atuais:
  - `employeeListColumns.tsx`
- Services atuais:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`
- Schemas atuais:
  - `employeeCreateForm.schema.ts`
  - `employeeEditForm.schema.ts`
- Normalizers atuais:
  - `employeeForm.normalizer.ts`
  - `employeeDetails.normalizer.ts`
- Rotas:
  - `/client/employees/*`
- Menu:
  - `employees`
- Testes relacionados:
  - `employeeService.test.ts`
  - `employeeFormNormalizer.test.ts`

### Estrutura-alvo do módulo

- List pages alvo:
  - `hooks/useEmployeesList.ts`
  - `hooks/useEmployeesListPage.ts`
  - `components/employeeListColumns.tsx`
  - `pages/EmployeesPage.tsx`
- Details page alvo:
  - `hooks/useEmployeeDetailsPage.ts`
  - `normalizers/employeeDetails.normalizer.ts`
  - `pages/EmployeeDetailsPage.tsx`
- Create page alvo:
  - `schemas/employeeCreateForm.schema.ts`
  - `hooks/useEmployeeCreatePage.ts`
  - `pages/EmployeeCreatePage.tsx`
- Edit page alvo:
  - `schemas/employeeEditForm.schema.ts`
  - `hooks/useEmployeeEditPage.ts`
  - `pages/EmployeeEditPage.tsx`
- Services alvo:
  - `services/endpoints.ts`
  - `services/types.ts`
  - `services/service.ts`

### Anti-padrões já confirmados

- service genérico monolítico
- listagem com `ViewModel` e JSX no hook
- details com hook `.tsx` e componente exportado pelo hook
- form único para create/edit
- schema único

### Checklist operacional

- [x] mapear estrutura atual do módulo
- [x] redesenhar list page no padrão canônico
- [x] redesenhar details page no padrão canônico
- [x] separar create e edit em pages e hooks próprios
- [x] consolidar schemas e normalizers no naming final
- [x] migrar services para o padrão final
- [x] excluir arquivos antigos substituídos
- [ ] validar integrações com contratos compartilhados
- [ ] validar quality gate do módulo
  - `typecheck`: verde
  - `test`: verde
  - `lint`: pendente de rodada global

### Status

- `em refatoração`

### Evidências atuais

- `typecheck`: verde
- `test`: verde
