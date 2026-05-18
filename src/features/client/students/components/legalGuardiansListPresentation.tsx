import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { translateGuardianRelationshipType } from '@shared/i18n/pt-BR/enums';
import type { LegalGuardian } from '@features/client/students/types/student.types';

type LegalGuardiansListPresentationParams = {
  buildRowActions: (row: LegalGuardian) => RowActionItem[];
};

const getGuardianName = (row: LegalGuardian): string => row.person?.fullName ?? '-';

const getDocumentNumber = (row: LegalGuardian): string => {
  const documentNumber = row.person?.documentNumber;
  if (!documentNumber) return '-';

  const digits = onlyDigits(documentNumber);
  if (row.person?.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (row.person?.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const getRelationship = (row: LegalGuardian): string =>
  row.relationshipType ? translateGuardianRelationshipType(row.relationshipType) : '-';

const getStudentsCount = (row: LegalGuardian): string => String(row.students?.length ?? 0);

const renderActions = (
  row: LegalGuardian,
  buildRowActions: (row: LegalGuardian) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do responsável ${getGuardianName(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildLegalGuardiansTableColumns = ({
  buildRowActions,
}: LegalGuardiansListPresentationParams): DataTableColumn<LegalGuardian>[] => [
  {
    key: 'name',
    header: 'Responsável',
    render: getGuardianName,
    mobileRender: getGuardianName,
  },
  {
    key: 'document',
    header: 'Documento',
    render: getDocumentNumber,
    mobileRender: getDocumentNumber,
  },
  {
    key: 'relationship',
    header: 'Vínculo',
    render: getRelationship,
    mobileRender: getRelationship,
  },
  {
    key: 'students',
    header: 'Alunos',
    render: getStudentsCount,
    mobileRender: getStudentsCount,
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildLegalGuardiansMobileConfig = ({
  buildRowActions,
}: LegalGuardiansListPresentationParams): DataListMobileConfig<LegalGuardian> => ({
  renderTitle: getGuardianName,
  renderSubtitle: getDocumentNumber,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Vínculo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getRelationship(row)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Alunos
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getStudentsCount(row)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
