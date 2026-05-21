import { describe, expect, it } from 'vitest';
import {
  translateAcademicYearStatus,
  translateAttendanceStatus,
  translateContactType,
  translateDocumentType,
  translateFinancialCategoryType,
  translateFinancialEntityStatus,
  translateFinancialOriginType,
  translateFinancialRecordStatus,
  translateFinancialTransactionType,
  translateGuardianRelationshipType,
  translateReportCardCalculationType,
  translateReportCardFinalStatusStrategy,
  translateReportCardRecoveryStrategy,
  translateSchoolClassShift,
  translateSchoolClassStatus,
  translateStudentStatus,
} from '@shared/i18n/pt-BR/enums';

describe('tradução de enums compartilhados', () => {
  it('traduz status de aluno sem expor valor técnico', () => {
    expect(translateStudentStatus('active')).toBe('Ativo');
    expect(translateStudentStatus('cancelled')).toBe('Cancelado');
  });

  it('traduz tipos de documento', () => {
    expect(translateDocumentType('CPF')).toBe('CPF');
    expect(translateDocumentType('PASSPORT')).toBe('Passaporte');
  });

  it('traduz status de ano letivo', () => {
    expect(translateAcademicYearStatus('scheduled')).toBe('Agendado');
    expect(translateAcademicYearStatus('closed')).toBe('Encerrado');
  });

  it('traduz política de boletim', () => {
    expect(translateReportCardCalculationType('arithmetic')).toBe('Média aritmética');
    expect(translateReportCardRecoveryStrategy('replace_average')).toBe('Substitui a média');
    expect(translateReportCardFinalStatusStrategy('approval_recovery_or_failure')).toBe(
      'Aprovação, recuperação ou reprovação',
    );
  });

  it('traduz status e turno de turma', () => {
    expect(translateSchoolClassStatus('active')).toBe('Ativa');
    expect(translateSchoolClassShift('full_time')).toBe('Integral');
  });

  it('traduz vínculo de responsável e tipo de contato', () => {
    expect(translateGuardianRelationshipType('legal_guardian')).toBe('Responsável legal');
    expect(translateContactType('whatsapp')).toBe('WhatsApp');
  });

  it('traduz status de frequência', () => {
    expect(translateAttendanceStatus('present')).toBe('Presente');
    expect(translateAttendanceStatus('justified')).toBe('Justificada');
  });

  it('traduz enums financeiros sem expor valor técnico', () => {
    expect(translateFinancialCategoryType('expense')).toBe('Despesa');
    expect(translateFinancialEntityStatus('active')).toBe('Ativo');
    expect(translateFinancialRecordStatus('overdue')).toBe('Em atraso');
    expect(translateFinancialTransactionType('reversal_expense')).toBe('Estorno de saída');
    expect(translateFinancialOriginType('accounts_receivable')).toBe('Contas a receber');
  });
});
