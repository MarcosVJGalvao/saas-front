import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import type { FilterField } from '@shared/components/data-display/data/listFilters.types';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import {
  buildReportCardCatalogColumns,
  buildReportCardCatalogMobileConfig,
} from '@features/client/report-cards/components/reportCardCatalogPresentation';
import { useReportCardCatalogList } from '@features/client/report-cards/hooks/useReportCardCatalogList';
import type {
  ReportCardCatalogEntity,
  ReportCardPayload,
  ReportCardQueryParams,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogMode = 'periods' | 'gradeSubjects';

type ReportCardCatalogListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type ReportCardCatalogListPageProps = {
  mode: ReportCardCatalogMode;
  title: string;
  subtitle: string;
  routeBase: string;
  service: (
    params: ReportCardQueryParams,
  ) => Promise<{ data: ReportCardCatalogEntity[]; meta: ReportCardCatalogListMeta }>;
  createService: (payload: ReportCardPayload) => Promise<ReportCardCatalogEntity>;
  errorMessageFallback: string;
  emptyTitle: string;
  emptyDescription: string;
};

type CatalogFormValues = Record<string, unknown>;

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const getNumberValue = (value: unknown): number | undefined => {
  const stringValue = getStringValue(value);
  return stringValue ? Number(stringValue.replace(',', '.')) : undefined;
};
const getBooleanValue = (value: unknown): boolean | undefined => {
  const stringValue = getStringValue(value).toLowerCase();
  if (stringValue === 'true' || stringValue === 'sim') return true;
  if (stringValue === 'false' || stringValue === 'não' || stringValue === 'nao') return false;
  return undefined;
};

const initialValues: CatalogFormValues = {
  academicYearId: '',
  name: '',
  code: '',
  sequence: '',
  startDate: '',
  endDate: '',
  weight: '',
  isFinalPeriod: '',
  gradeId: '',
  subjectId: '',
  workloadHours: '',
  displayOrder: '',
  isMandatory: '',
};

const periodFields: FilterField[] = [
  {
    type: 'text',
    name: 'academicYearId',
    label: 'Ano letivo',
    placeholder: 'ID do ano',
    mobileOrder: 1,
  },
  { type: 'text', name: 'name', label: 'Nome', placeholder: '1º bimestre', mobileOrder: 2 },
  { type: 'text', name: 'code', label: 'Código', placeholder: 'B1', mobileOrder: 3 },
  { type: 'text', name: 'sequence', label: 'Sequência', placeholder: '1', mobileOrder: 4 },
  {
    type: 'dateRange',
    name: 'period',
    label: 'Período',
    startName: 'startDate',
    endName: 'endDate',
    mobileOrder: 5,
  },
  { type: 'text', name: 'weight', label: 'Peso', placeholder: '1', mobileOrder: 6 },
  {
    type: 'text',
    name: 'isFinalPeriod',
    label: 'Período final',
    placeholder: 'true ou false',
    mobileOrder: 7,
  },
];

const gradeSubjectFields: FilterField[] = [
  {
    type: 'text',
    name: 'academicYearId',
    label: 'Ano letivo',
    placeholder: 'ID do ano',
    mobileOrder: 1,
  },
  { type: 'text', name: 'gradeId', label: 'Série', placeholder: 'ID da série', mobileOrder: 2 },
  {
    type: 'text',
    name: 'subjectId',
    label: 'Disciplina',
    placeholder: 'ID da disciplina',
    mobileOrder: 3,
  },
  {
    type: 'text',
    name: 'workloadHours',
    label: 'Carga horária',
    placeholder: '80',
    mobileOrder: 4,
  },
  { type: 'text', name: 'displayOrder', label: 'Ordem', placeholder: '1', mobileOrder: 5 },
  {
    type: 'text',
    name: 'isMandatory',
    label: 'Obrigatória',
    placeholder: 'true ou false',
    mobileOrder: 6,
  },
];

const buildPeriodPayload = (values: CatalogFormValues): ReportCardPayload => ({
  academicYearId: getStringValue(values.academicYearId),
  name: getStringValue(values.name),
  code: getStringValue(values.code),
  sequence: getNumberValue(values.sequence),
  startDate: getStringValue(values.startDate),
  endDate: getStringValue(values.endDate),
  weight: getNumberValue(values.weight),
  isFinalPeriod: getBooleanValue(values.isFinalPeriod),
});

const buildGradeSubjectPayload = (values: CatalogFormValues): ReportCardPayload => ({
  academicYearId: getStringValue(values.academicYearId),
  gradeId: getStringValue(values.gradeId),
  subjectId: getStringValue(values.subjectId),
  workloadHours: getNumberValue(values.workloadHours),
  displayOrder: getNumberValue(values.displayOrder),
  isMandatory: getBooleanValue(values.isMandatory),
});

export const ReportCardCatalogListPage = ({
  mode,
  title,
  subtitle,
  routeBase,
  service,
  createService,
  errorMessageFallback,
  emptyTitle,
  emptyDescription,
}: ReportCardCatalogListPageProps) => {
  const navigate = useNavigate();
  const list = useReportCardCatalogList(service, errorMessageFallback, createService);
  const [values, setValues] = useState<CatalogFormValues>(initialValues);

  const buildRowActions = useCallback(
    (row: ReportCardCatalogEntity): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`${routeBase}/${row.id}`),
      },
    ],
    [navigate, routeBase],
  );

  const onChange = (name: string, value: unknown): void => {
    setValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const createRecord = (): void => {
    const payload =
      mode === 'periods' ? buildPeriodPayload(values) : buildGradeSubjectPayload(values);
    const message =
      mode === 'periods'
        ? 'Período acadêmico criado com sucesso.'
        : 'Matriz curricular criada com sucesso.';
    void list.createRecord(payload, message);
  };

  return (
    <AppStack spacing={2}>
      <PageHeader title={title} subtitle={subtitle} />
      {list.errorMessage ? <AppAlert severity="error">{list.errorMessage}</AppAlert> : null}
      {list.successMessage ? <AppAlert severity="success">{list.successMessage}</AppAlert> : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">
            {mode === 'periods' ? 'Novo período acadêmico' : 'Nova matriz curricular'}
          </AppText>
          <ListFilters
            fields={mode === 'periods' ? periodFields : gradeSubjectFields}
            values={values}
            onChange={onChange}
            onApply={createRecord}
            onClear={() => setValues(initialValues)}
            loading={list.loading}
            applyLabel="Cadastrar"
          />
        </AppStack>
      </AppPaper>
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: mode === 'periods' ? 'Período' : 'Disciplina',
            mobileOrder: 1,
          },
        ]}
        values={{ query: list.query.search ?? '' }}
        onChange={(_, value) => list.updateQuery({ search: getStringValue(value), page: 1 })}
        onApply={() => list.updateQuery({ page: 1 })}
        onClear={() => list.updateQuery({ search: undefined, page: 1 })}
        loading={list.loading}
      />
      <QueryDataTable
        rows={list.rows}
        columns={buildReportCardCatalogColumns({ mode, buildRowActions })}
        mobileConfig={buildReportCardCatalogMobileConfig({ mode, buildRowActions })}
        meta={list.meta}
        loading={list.loading}
        errorMessage={list.errorMessage}
        onRetry={() => {
          void list.reload();
        }}
        query={list.query.search ?? ''}
        onQueryChange={(search) => list.updateQuery({ search, page: 1 })}
        onPageChange={(page) => list.updateQuery({ page })}
        onRowsPerPageChange={(limit) => list.updateQuery({ limit, page: 1 })}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        toolbarContent={
          <AppText color="text.secondary">Use a busca geral para localizar registros.</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};
