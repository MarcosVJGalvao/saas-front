import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildLegalGuardiansMobileConfig,
  buildLegalGuardiansTableColumns,
} from '@features/client/students/components/legalGuardiansListPresentation';
import { useLegalGuardiansList } from '@features/client/students/hooks/useLegalGuardiansList';
import type {
  LegalGuardian,
  LegalGuardianQueryParams,
  LegalGuardianRelationshipType,
} from '@features/client/students/types/student.types';

type LegalGuardianFilterValues = Record<string, unknown>;

const initialFilterValues: LegalGuardianFilterValues = {
  query: '',
  relationshipType: '',
};

const isRelationshipType = (value: string): value is LegalGuardianRelationshipType =>
  value === 'mother' ||
  value === 'father' ||
  value === 'legal_guardian' ||
  value === 'grandparent' ||
  value === 'other';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalRelationshipType = (value: unknown): LegalGuardianRelationshipType | undefined => {
  const stringValue = getStringValue(value);
  return isRelationshipType(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: LegalGuardianFilterValues,
): Partial<LegalGuardianQueryParams> => ({
  search: getOptionalString(filterValues.query),
  relationshipType: getOptionalRelationshipType(filterValues.relationshipType),
  page: 1,
});

export const useLegalGuardiansListPageViewModel = () => {
  const navigate = useNavigate();
  const list = useLegalGuardiansList();
  const [filterValues, setFilterValues] = useState<LegalGuardianFilterValues>(initialFilterValues);

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({
      page: 1,
      search: undefined,
      relationshipType: undefined,
    });
  };

  const buildRowActions = useCallback(
    (row: LegalGuardian): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/legal-guardians/${row.id}`),
      },
    ],
    [navigate],
  );

  return {
    list,
    query: list.query.search ?? '',
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    onQueryChange: (search: string) => list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    columns: buildLegalGuardiansTableColumns({ buildRowActions }),
    mobileConfig: buildLegalGuardiansMobileConfig({ buildRowActions }),
  };
};
