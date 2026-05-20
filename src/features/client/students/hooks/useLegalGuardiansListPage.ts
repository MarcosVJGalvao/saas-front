import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildLegalGuardianListColumns,
  buildLegalGuardianMobileConfig,
} from '../components/legalGuardianListColumns';
import { useLegalGuardiansList } from './useLegalGuardiansList';
import type {
  LegalGuardian,
  LegalGuardianQueryParams,
  LegalGuardianRelationshipType,
} from '../types/student.types';

type LegalGuardianFilterValues = {
  query: string;
  relationshipType: string;
};

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

const buildQueryFromFilters = (
  filterValues: LegalGuardianFilterValues,
): Partial<LegalGuardianQueryParams> => ({
  search: filterValues.query.trim() || undefined,
  relationshipType: isRelationshipType(filterValues.relationshipType)
    ? filterValues.relationshipType
    : undefined,
  page: 1,
});

export const useLegalGuardiansListPage = () => {
  const navigate = useNavigate();
  const legalGuardianList = useLegalGuardiansList();
  const [filterValues, setFilterValues] = useState<LegalGuardianFilterValues>(initialFilterValues);

  return {
    legalGuardianList,
    filterValues,
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      setFilterValues((current) => ({
        ...current,
        [filterKey]: typeof filterValue === 'string' ? filterValue : '',
      }));
    },
    applyFilters: () => {
      legalGuardianList.updateQuery(buildQueryFromFilters(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      legalGuardianList.updateQuery({
        page: 1,
        search: undefined,
        relationshipType: undefined,
      });
    },
    onQueryChange: (search: string) => legalGuardianList.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => legalGuardianList.updateQuery({ page }),
    onLimitChange: (limit: number) => legalGuardianList.updateQuery({ limit, page: 1 }),
    columns: buildLegalGuardianListColumns({
      onDetails: (guardian: LegalGuardian) => {
        void navigate(`/client/legal-guardians/${guardian.id}`);
      },
      onEdit: (guardian: LegalGuardian) => {
        void navigate(`/client/legal-guardians/${guardian.id}/edit`, {
          state: { entity: guardian },
        });
      },
    }),
    mobileConfig: buildLegalGuardianMobileConfig({
      onDetails: (guardian: LegalGuardian) => {
        void navigate(`/client/legal-guardians/${guardian.id}`);
      },
      onEdit: (guardian: LegalGuardian) => {
        void navigate(`/client/legal-guardians/${guardian.id}/edit`, {
          state: { entity: guardian },
        });
      },
    }),
  };
};
