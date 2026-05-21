import { describe, expect, it } from 'vitest';
import { commonLabels } from '@shared/i18n/pt-BR/labels';
import {
  academicYearStatusOptions,
  attendanceStatusOptions,
  attendanceWeekdayOptions,
  createOptionsWithPlaceholder,
  documentTypeOptions,
  financialCategoryTypeOptions,
  financialEntityStatusOptions,
  financialRecordStatusOptions,
  genderOptions,
  genderOptionsWithPlaceholder,
  guardianRelationshipTypeOptions,
  maritalStatusOptions,
  maritalStatusOptionsWithPlaceholder,
  nationalityOptions,
  reportCardCalculationTypeOptions,
  reportCardFinalStatusStrategyOptions,
  reportCardRecoveryStrategyOptions,
  schoolClassShiftOptions,
  schoolClassStatusOptions,
  studentStatusOptions,
  yesNoOptions,
} from '@shared/constants/selectOptions';

describe('selectOptions', () => {
  it('keeps the expected gender options order and labels', () => {
    expect(genderOptions).toEqual([
      { value: 'male', label: 'Masculino' },
      { value: 'female', label: 'Feminino' },
      { value: 'other', label: 'Outro' },
      { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
    ]);
  });

  it('adds the default placeholder before the provided options', () => {
    expect(genderOptionsWithPlaceholder[0]).toEqual({
      value: '',
      label: commonLabels.select,
    });
    expect(genderOptionsWithPlaceholder.slice(1)).toEqual(genderOptions);
  });

  it('keeps the expected marital status options order and labels', () => {
    expect(maritalStatusOptions).toEqual([
      { value: 'single', label: 'Solteiro(a)' },
      { value: 'married', label: 'Casado(a)' },
      { value: 'divorced', label: 'Divorciado(a)' },
      { value: 'widowed', label: 'Viúvo(a)' },
      { value: 'other', label: 'Outro' },
    ]);
  });

  it('keeps the expected document type options order and labels', () => {
    expect(documentTypeOptions).toEqual([
      { value: 'CPF', label: 'CPF' },
      { value: 'CNPJ', label: 'CNPJ' },
      { value: 'RG', label: 'RG' },
      { value: 'PASSPORT', label: 'Passaporte' },
      { value: 'OTHER', label: 'Outro' },
    ]);
  });

  it('keeps the expected nationality options order and labels', () => {
    expect(nationalityOptions).toEqual([
      { value: 'brazilian', label: 'Brasileira' },
      { value: 'foreign', label: 'Estrangeira' },
      { value: 'other', label: 'Outra' },
    ]);
  });

  it('keeps the expected guardian relationship options order and labels', () => {
    expect(guardianRelationshipTypeOptions).toEqual([
      { value: 'mother', label: 'Mãe' },
      { value: 'father', label: 'Pai' },
      { value: 'legal_guardian', label: 'Responsável legal' },
      { value: 'grandparent', label: 'Avô/avó' },
      { value: 'other', label: 'Outro' },
    ]);
  });

  it('keeps the expected student status options order and labels', () => {
    expect(studentStatusOptions).toEqual([
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
      { value: 'cancelled', label: 'Cancelado' },
    ]);
  });

  it('keeps the expected attendance and academic year options', () => {
    expect(attendanceStatusOptions).toEqual([
      { value: 'present', label: 'Presente' },
      { value: 'absent', label: 'Ausente' },
      { value: 'justified', label: 'Justificada' },
    ]);
    expect(attendanceWeekdayOptions).toEqual([
      { value: 'Segunda-feira', label: 'Segunda-feira' },
      { value: 'Terça-feira', label: 'Terça-feira' },
      { value: 'Quarta-feira', label: 'Quarta-feira' },
      { value: 'Quinta-feira', label: 'Quinta-feira' },
      { value: 'Sexta-feira', label: 'Sexta-feira' },
      { value: 'Sábado', label: 'Sábado' },
      { value: 'Domingo', label: 'Domingo' },
    ]);
    expect(academicYearStatusOptions).toEqual([
      { value: 'scheduled', label: 'Agendado' },
      { value: 'active', label: 'Ativo' },
      { value: 'closed', label: 'Encerrado' },
    ]);
  });

  it('keeps the expected school class options', () => {
    expect(schoolClassStatusOptions).toEqual([
      { value: 'active', label: 'Ativa' },
      { value: 'inactive', label: 'Inativa' },
      { value: 'cancelled', label: 'Cancelada' },
    ]);
    expect(schoolClassShiftOptions).toEqual([
      { value: 'morning', label: 'Manhã' },
      { value: 'afternoon', label: 'Tarde' },
      { value: 'evening', label: 'Noite' },
      { value: 'full_time', label: 'Integral' },
    ]);
  });

  it('keeps the expected financial options', () => {
    expect(financialCategoryTypeOptions).toEqual([
      { value: 'revenue', label: 'Receita' },
      { value: 'expense', label: 'Despesa' },
    ]);
    expect(financialEntityStatusOptions).toEqual([
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
    ]);
    expect(financialRecordStatusOptions).toEqual([
      { value: 'open', label: 'Aberto' },
      { value: 'partially_paid', label: 'Parcialmente pago' },
      { value: 'paid', label: 'Pago' },
      { value: 'received', label: 'Recebido' },
      { value: 'overdue', label: 'Em atraso' },
      { value: 'cancelled', label: 'Cancelado' },
      { value: 'reversed', label: 'Estornado' },
    ]);
  });

  it('keeps the expected report card options', () => {
    expect(reportCardCalculationTypeOptions).toEqual([
      { value: 'arithmetic', label: 'Média aritmética' },
      { value: 'weighted', label: 'Média ponderada' },
    ]);
    expect(reportCardRecoveryStrategyOptions).toEqual([
      { value: 'none', label: 'Sem recuperação' },
      { value: 'replace_lowest', label: 'Substitui a menor nota' },
      { value: 'replace_average', label: 'Substitui a média' },
    ]);
    expect(reportCardFinalStatusStrategyOptions).toEqual([
      { value: 'approval_or_recovery', label: 'Aprovação ou recuperação' },
      {
        value: 'approval_recovery_or_failure',
        label: 'Aprovação, recuperação ou reprovação',
      },
    ]);
    expect(yesNoOptions).toEqual([
      { value: '', label: 'Não informar' },
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' },
    ]);
  });

  it('reuses the placeholder builder for other select lists', () => {
    expect(createOptionsWithPlaceholder(maritalStatusOptions)).toEqual(
      maritalStatusOptionsWithPlaceholder,
    );
  });
});
