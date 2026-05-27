export type ActiveInactiveStatus = 'active' | 'inactive';
export type BillingCycleValue = 'monthly' | 'yearly';
export type DocumentTypeValue = 'CPF' | 'CNPJ' | 'RG' | 'PASSPORT' | 'OTHER';
export type SubscriptionStatusValue = 'active' | 'canceled' | 'past_due' | 'trialing' | 'blocked';
export type EnrollmentStatusValue = 'active' | 'cancelled' | 'transferred';
export type StudentStatusValue = 'active' | 'inactive' | 'cancelled';
export type EmployeeJobTitleValue =
  | 'teacher'
  | 'teaching_assistant'
  | 'coordinator'
  | 'director'
  | 'secretary'
  | 'financial'
  | 'administrator'
  | 'administrative'
  | 'assistant'
  | 'other';
export type EmployeeStatusValue = 'active' | 'inactive' | 'terminated';
export type SchoolClassStatusValue = 'active' | 'inactive' | 'cancelled';
export type SchoolClassShiftValue = 'morning' | 'afternoon' | 'evening' | 'full_time';
export type AcademicYearStatusValue = 'scheduled' | 'active' | 'closed';
export type ReportCardCalculationTypeValue = 'arithmetic' | 'weighted';
export type ReportCardRecoveryStrategyValue = 'none' | 'replace_lowest' | 'replace_average';
export type ReportCardFinalStatusStrategyValue =
  | 'approval_or_recovery'
  | 'approval_recovery_or_failure';
export type GenderValue = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type MaritalStatusValue = 'single' | 'married' | 'divorced' | 'widowed' | 'other';
export type NationalityValue = 'brazilian' | 'foreign' | 'other';
export type GuardianRelationshipTypeValue =
  | 'mother'
  | 'father'
  | 'legal_guardian'
  | 'grandparent'
  | 'other';
export type ContactTypeValue = 'email' | 'phone' | 'whatsapp' | 'linkedin' | 'other';
export type AttendanceStatusValue = 'present' | 'absent' | 'justified';
export type DocumentFormatValue = 'pdf' | 'csv' | 'xlsx';
export type DocumentGenerationStatusValue = 'pending' | 'processing' | 'completed' | 'failed';
export type FinancialCategoryTypeValue = 'revenue' | 'expense';
export type FinancialEntityStatusValue = 'active' | 'inactive';
export type FinancialRecordStatusValue =
  | 'open'
  | 'partially_paid'
  | 'paid'
  | 'received'
  | 'overdue'
  | 'cancelled'
  | 'reversed';
export type FinancialRecurrenceTypeValue =
  | 'none'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'yearly';
export type PaymentMethodValue =
  | 'cash'
  | 'pix'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'bank_slip'
  | 'other';
export type FinancialTransactionTypeValue =
  | 'income'
  | 'expense'
  | 'reversal_income'
  | 'reversal_expense';
export type FinancialOriginTypeValue =
  | 'accounts_payable'
  | 'accounts_receivable'
  | 'manual'
  | 'reversal';
export type ReportCardAssessmentTypeValue = 'regular' | 'recovery' | 'final' | 'other';

export const activeInactiveStatusLabels: Record<ActiveInactiveStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export const activeInactiveStatusFemaleLabels: Record<ActiveInactiveStatus, string> = {
  active: 'Ativa',
  inactive: 'Inativa',
};

export const billingCycleLabels: Record<BillingCycleValue, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
};

export const documentTypeLabels: Record<DocumentTypeValue, string> = {
  CPF: 'CPF',
  CNPJ: 'CNPJ',
  RG: 'RG',
  PASSPORT: 'Passaporte',
  OTHER: 'Outro',
};

export const subscriptionStatusLabelByValue: Record<SubscriptionStatusValue, string> = {
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Em atraso',
  trialing: 'Em trial',
  blocked: 'Bloqueada',
};

export const enrollmentStatusLabels: Record<EnrollmentStatusValue, string> = {
  active: 'Ativa',
  cancelled: 'Cancelada',
  transferred: 'Transferida',
};

export const studentStatusLabels: Record<StudentStatusValue, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  cancelled: 'Cancelado',
};

export const employeeJobTitleLabels: Record<EmployeeJobTitleValue, string> = {
  teacher: 'Professor(a)',
  teaching_assistant: 'Auxiliar de ensino',
  coordinator: 'Coordenador(a)',
  director: 'Diretor(a)',
  secretary: 'Secretário(a)',
  financial: 'Financeiro',
  administrator: 'Administrador(a)',
  administrative: 'Administrativo',
  assistant: 'Assistente',
  other: 'Outro',
};

export const employeeStatusLabels: Record<EmployeeStatusValue, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  terminated: 'Desligado',
};

export const schoolClassStatusLabels: Record<SchoolClassStatusValue, string> = {
  active: 'Ativa',
  inactive: 'Inativa',
  cancelled: 'Cancelada',
};

export const schoolClassShiftLabels: Record<SchoolClassShiftValue, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  evening: 'Noite',
  full_time: 'Integral',
};

export const academicYearStatusLabels: Record<AcademicYearStatusValue, string> = {
  scheduled: 'Agendado',
  active: 'Ativo',
  closed: 'Encerrado',
};

export const reportCardCalculationTypeLabels: Record<ReportCardCalculationTypeValue, string> = {
  arithmetic: 'Média aritmética',
  weighted: 'Média ponderada',
};

export const reportCardRecoveryStrategyLabels: Record<ReportCardRecoveryStrategyValue, string> = {
  none: 'Sem recuperação',
  replace_lowest: 'Substitui a menor nota',
  replace_average: 'Substitui a média',
};

export const reportCardFinalStatusStrategyLabels: Record<
  ReportCardFinalStatusStrategyValue,
  string
> = {
  approval_or_recovery: 'Aprovação ou recuperação',
  approval_recovery_or_failure: 'Aprovação, recuperação ou reprovação',
};

export const genderLabels: Record<GenderValue, string> = {
  male: 'Masculino',
  female: 'Feminino',
  other: 'Outro',
  prefer_not_to_say: 'Prefiro não informar',
};

export const maritalStatusLabels: Record<MaritalStatusValue, string> = {
  single: 'Solteiro(a)',
  married: 'Casado(a)',
  divorced: 'Divorciado(a)',
  widowed: 'Viúvo(a)',
  other: 'Outro',
};

export const nationalityLabels: Record<NationalityValue, string> = {
  brazilian: 'Brasileira',
  foreign: 'Estrangeira',
  other: 'Outra',
};

export const guardianRelationshipTypeLabels: Record<GuardianRelationshipTypeValue, string> = {
  mother: 'Mãe',
  father: 'Pai',
  legal_guardian: 'Responsável legal',
  grandparent: 'Avô/avó',
  other: 'Outro',
};

export const contactTypeLabels: Record<ContactTypeValue, string> = {
  email: 'E-mail',
  phone: 'Telefone',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
  other: 'Outro',
};

export const attendanceStatusLabels: Record<AttendanceStatusValue, string> = {
  present: 'Presente',
  absent: 'Ausente',
  justified: 'Justificada',
};

export const documentFormatLabels: Record<DocumentFormatValue, string> = {
  pdf: 'PDF',
  csv: 'CSV',
  xlsx: 'XLSX',
};

export const documentGenerationStatusLabels: Record<DocumentGenerationStatusValue, string> = {
  pending: 'Pendente',
  processing: 'Processando',
  completed: 'Concluído',
  failed: 'Falhou',
};

export const financialCategoryTypeLabels: Record<FinancialCategoryTypeValue, string> = {
  revenue: 'Receita',
  expense: 'Despesa',
};

export const financialEntityStatusLabels: Record<FinancialEntityStatusValue, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export const financialRecordStatusLabels: Record<FinancialRecordStatusValue, string> = {
  open: 'Aberto',
  partially_paid: 'Parcialmente pago',
  paid: 'Pago',
  received: 'Recebido',
  overdue: 'Em atraso',
  cancelled: 'Cancelado',
  reversed: 'Estornado',
};

export const financialRecurrenceTypeLabels: Record<FinancialRecurrenceTypeValue, string> = {
  none: 'Sem recorrência',
  weekly: 'Semanal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  yearly: 'Anual',
};

export const paymentMethodLabels: Record<PaymentMethodValue, string> = {
  cash: 'Dinheiro',
  pix: 'Pix',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  bank_transfer: 'Transferência bancária',
  bank_slip: 'Boleto',
  other: 'Outro',
};

export const financialTransactionTypeLabels: Record<FinancialTransactionTypeValue, string> = {
  income: 'Entrada',
  expense: 'Saída',
  reversal_income: 'Estorno de entrada',
  reversal_expense: 'Estorno de saída',
};

export const financialOriginTypeLabels: Record<FinancialOriginTypeValue, string> = {
  accounts_payable: 'Contas a pagar',
  accounts_receivable: 'Contas a receber',
  manual: 'Manual',
  reversal: 'Estorno',
};

export const reportCardAssessmentTypeLabels: Record<ReportCardAssessmentTypeValue, string> = {
  regular: 'Regular',
  recovery: 'Recuperação',
  final: 'Final',
  other: 'Outro',
};

export const translateActiveInactiveStatus = (status: ActiveInactiveStatus): string =>
  activeInactiveStatusLabels[status];

export const translateActiveInactiveStatusFemale = (status: ActiveInactiveStatus): string =>
  activeInactiveStatusFemaleLabels[status];

export const translateBillingCycle = (billingCycle: BillingCycleValue): string =>
  billingCycleLabels[billingCycle];

export const translateDocumentType = (documentType: DocumentTypeValue): string =>
  documentTypeLabels[documentType];

export const translateGuardianRelationshipType = (
  relationshipType: GuardianRelationshipTypeValue,
): string => guardianRelationshipTypeLabels[relationshipType];

export const translateContactType = (contactType: ContactTypeValue): string =>
  contactTypeLabels[contactType];

export const translateSubscriptionStatus = (status: SubscriptionStatusValue): string =>
  subscriptionStatusLabelByValue[status];

export const translateEnrollmentStatus = (status: EnrollmentStatusValue): string =>
  enrollmentStatusLabels[status];

export const translateAcademicYearStatus = (status: AcademicYearStatusValue): string =>
  academicYearStatusLabels[status];

export const translateReportCardCalculationType = (
  calculationType: ReportCardCalculationTypeValue,
): string => reportCardCalculationTypeLabels[calculationType];

export const translateReportCardRecoveryStrategy = (
  recoveryStrategy: ReportCardRecoveryStrategyValue,
): string => reportCardRecoveryStrategyLabels[recoveryStrategy];

export const translateReportCardFinalStatusStrategy = (
  finalStatusStrategy: ReportCardFinalStatusStrategyValue,
): string => reportCardFinalStatusStrategyLabels[finalStatusStrategy];

export const translateSchoolClassStatus = (status: SchoolClassStatusValue): string =>
  schoolClassStatusLabels[status];

export const translateSchoolClassShift = (shift: SchoolClassShiftValue): string =>
  schoolClassShiftLabels[shift];

export const translateAttendanceStatus = (status: AttendanceStatusValue): string =>
  attendanceStatusLabels[status];

export const translateStudentStatus = (status: StudentStatusValue): string =>
  studentStatusLabels[status];

export const translateEmployeeJobTitle = (jobTitle: EmployeeJobTitleValue): string =>
  employeeJobTitleLabels[jobTitle];

export const translateEmployeeStatus = (status: EmployeeStatusValue): string =>
  employeeStatusLabels[status];

export const translateDocumentFormat = (format: DocumentFormatValue): string =>
  documentFormatLabels[format];

export const translateDocumentGenerationStatus = (status: DocumentGenerationStatusValue): string =>
  documentGenerationStatusLabels[status];

export const translateFinancialCategoryType = (type: FinancialCategoryTypeValue): string =>
  financialCategoryTypeLabels[type];

export const translateFinancialEntityStatus = (status: FinancialEntityStatusValue): string =>
  financialEntityStatusLabels[status];

export const translateFinancialRecordStatus = (status: FinancialRecordStatusValue): string =>
  financialRecordStatusLabels[status];

export const translateFinancialTransactionType = (type: FinancialTransactionTypeValue): string =>
  financialTransactionTypeLabels[type];

export const translateFinancialOriginType = (type: FinancialOriginTypeValue): string =>
  financialOriginTypeLabels[type];
