import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { translateGuardianRelationshipType } from '@shared/i18n/pt-BR/enums';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { LegalGuardian } from '../types/student.types';

export interface LegalGuardianListColumnActions {
  onDetails: (guardian: LegalGuardian) => void;
  onEdit: (guardian: LegalGuardian) => void;
}

const getGuardianName = (guardian: LegalGuardian): string => guardian.person?.fullName ?? '-';

const getGuardianDocument = (guardian: LegalGuardian): string => {
  const documentNumber = guardian.person?.documentNumber;
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (guardian.person?.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (guardian.person?.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const getRelationshipType = (guardian: LegalGuardian): string =>
  guardian.relationshipType ? translateGuardianRelationshipType(guardian.relationshipType) : '-';

const getStudentsCount = (guardian: LegalGuardian): string =>
  String(guardian.students?.length ?? 0);

export const buildLegalGuardianListColumns = (
  actions: LegalGuardianListColumnActions,
): DataTableColumn<LegalGuardian>[] => [
  {
    key: 'name',
    header: 'Responsável',
    render: getGuardianName,
    mobileRender: getGuardianName,
  },
  {
    key: 'document',
    header: 'Documento',
    render: getGuardianDocument,
    mobileRender: getGuardianDocument,
  },
  {
    key: 'relationship',
    header: 'Vínculo',
    render: getRelationshipType,
    mobileRender: getRelationshipType,
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
    render: (guardian) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações do responsável ${getGuardianName(guardian)}`}
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(guardian) },
          { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(guardian) },
        ]}
      />
    ),
  },
];

export const buildLegalGuardianMobileConfig = (
  actions: LegalGuardianListColumnActions,
): DataListMobileConfig<LegalGuardian> => ({
  renderTitle: getGuardianName,
  renderSubtitle: getGuardianDocument,
  renderActions: (guardian) => (
    <RowActionsMenu
      triggerAriaLabel={`Abrir ações do responsável ${getGuardianName(guardian)}`}
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(guardian) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(guardian) },
      ]}
    />
  ),
  renderDetails: (guardian) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Vínculo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getRelationshipType(guardian)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Alunos
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getStudentsCount(guardian)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
