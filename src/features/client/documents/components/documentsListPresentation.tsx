import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { formatIsoDate } from '@shared/formatters';
import {
  translateDocumentFormat,
  translateDocumentGenerationStatus,
} from '@shared/i18n/pt-BR/enums';
import type { GeneratedDocument } from '@features/client/documents/types/document.types';

type DocumentsListPresentationParams = {
  buildRowActions: (row: GeneratedDocument) => RowActionItem[];
};

const getTitle = (row: GeneratedDocument): string => row.title || row.fileName || '-';

const getTemplateKey = (row: GeneratedDocument): string => row.templateKey ?? '-';

const getCreatedAt = (row: GeneratedDocument): string =>
  row.createdAt ? formatIsoDate(row.createdAt) : '-';

const renderStatus = (row: GeneratedDocument) => (
  <LocalizedStatusBadge
    label={translateDocumentGenerationStatus(row.status)}
    tone={row.status === 'completed' ? 'active' : 'neutral'}
  />
);

const renderActions = (
  row: GeneratedDocument,
  buildRowActions: (row: GeneratedDocument) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do documento ${getTitle(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildDocumentsTableColumns = ({
  buildRowActions,
}: DocumentsListPresentationParams): DataTableColumn<GeneratedDocument>[] => [
  {
    key: 'title',
    header: 'Documento',
    render: getTitle,
    mobileRender: getTitle,
  },
  {
    key: 'format',
    header: 'Formato',
    render: (row) => translateDocumentFormat(row.format),
    mobileRender: (row) => translateDocumentFormat(row.format),
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) => translateDocumentGenerationStatus(row.status),
  },
  {
    key: 'template',
    header: 'Template',
    render: getTemplateKey,
    mobileRender: getTemplateKey,
  },
  {
    key: 'createdAt',
    header: 'Criado em',
    render: getCreatedAt,
    mobileRender: getCreatedAt,
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildDocumentsMobileConfig = ({
  buildRowActions,
}: DocumentsListPresentationParams): DataListMobileConfig<GeneratedDocument> => ({
  renderTitle: getTitle,
  renderSubtitle: (row) => translateDocumentFormat(row.format),
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Template
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getTemplateKey(row)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Criado em
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getCreatedAt(row)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
