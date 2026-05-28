import CloseIcon from '@mui/icons-material/Close';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppText } from '@shared/components/data-display/AppText';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppTable } from '@shared/components/data-display/AppTable';
import { AppTableHead } from '@shared/components/data-display/AppTableHead';
import { AppTableBody } from '@shared/components/data-display/AppTableBody';
import { AppTableRow } from '@shared/components/data-display/AppTableRow';
import { AppTableCell } from '@shared/components/data-display/AppTableCell';
import { AppTableContainer } from '@shared/components/data-display/AppTableContainer';
import { AppIconButton } from '@shared/components/inputs/AppIconButton';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppIframe } from '@shared/components/layout/AppIframe';
import { AppDialog } from '@shared/components/modal/AppDialog';
import { AppDialogTitle } from '@shared/components/modal/AppDialogTitle';
import { AppDialogContent } from '@shared/components/modal/AppDialogContent';
import { AppDialogActions } from '@shared/components/modal/AppDialogActions';
import type { SpreadsheetData } from '@features/client/documents/hooks/useDocumentPreview';

interface DocumentPreviewModalProps {
  open: boolean;
  previewState:
    | { type: 'idle' }
    | { type: 'loading' }
    | { type: 'pdf'; objectUrl: string; fileName: string }
    | { type: 'spreadsheet'; data: SpreadsheetData; fileName: string }
    | { type: 'error'; message: string };
  downloadLoading: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const SpreadsheetPreview = ({ data }: { data: SpreadsheetData }) => {
  if (data.headers.length === 0) {
    return (
      <AppBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <AppText color="text.secondary">Planilha sem dados.</AppText>
      </AppBox>
    );
  }

  return (
    <AppTableContainer sx={{ maxHeight: 480, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <AppTable stickyHeader size="small">
        <AppTableHead>
          <AppTableRow>
            {data.headers.map((header, index) => (
              <AppTableCell
                key={index}
                sx={{ fontWeight: 600, whiteSpace: 'nowrap', bgcolor: 'background.default' }}
              >
                {header || `Coluna ${index + 1}`}
              </AppTableCell>
            ))}
          </AppTableRow>
        </AppTableHead>
        <AppTableBody>
          {data.rows.slice(0, 200).map((row, rowIndex) => (
            <AppTableRow key={rowIndex} hover>
              {row.map((cell, cellIndex) => (
                <AppTableCell key={cellIndex} sx={{ whiteSpace: 'nowrap', maxWidth: 240 }}>
                  <AppBox
                    component="span"
                    sx={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 240,
                    }}
                    title={cell}
                  >
                    {cell}
                  </AppBox>
                </AppTableCell>
              ))}
            </AppTableRow>
          ))}
        </AppTableBody>
      </AppTable>
      {data.rows.length > 200 ? (
        <AppBox sx={{ p: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <AppText variant="caption" color="text.secondary">
            Exibindo 200 de {data.rows.length} linhas. Baixe o arquivo para ver todos os dados.
          </AppText>
        </AppBox>
      ) : null}
    </AppTableContainer>
  );
};

export const DocumentPreviewModal = ({
  open,
  previewState,
  downloadLoading,
  onClose,
  onDownload,
}: DocumentPreviewModalProps) => {
  const title =
    previewState.type === 'pdf' || previewState.type === 'spreadsheet'
      ? previewState.fileName
      : 'Pré-visualização';

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{ paper: { sx: { height: '90vh' } } }}
    >
      <AppDialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          pr: 1,
        }}
      >
        <AppText
          variant="h6"
          noWrap
          sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
          title={title}
        >
          {title}
        </AppText>
        <AppIconButton onClick={onClose} size="small" aria-label="Fechar pré-visualização">
          <CloseIcon />
        </AppIconButton>
      </AppDialogTitle>

      <AppDialogContent
        dividers
        sx={{
          p: previewState.type === 'pdf' ? 0 : 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {previewState.type === 'loading' ? (
          <AppCircularProgress sx={{ flex: 1 }} ariaLabel="Carregando documento" />
        ) : previewState.type === 'pdf' ? (
          <AppIframe
            src={previewState.objectUrl}
            sx={{ width: '100%', flex: 1, border: 'none', display: 'block' }}
            title="Pré-visualização do PDF"
          />
        ) : previewState.type === 'spreadsheet' ? (
          <SpreadsheetPreview data={previewState.data} />
        ) : previewState.type === 'error' ? (
          <AppBox
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <AppText color="error">{previewState.message}</AppText>
          </AppBox>
        ) : null}
      </AppDialogContent>

      {previewState.type !== 'loading' && previewState.type !== 'idle' ? (
        <AppDialogActions sx={{ px: 2, py: 1.5 }}>
          <AppButton variant="text" onClick={onClose}>
            Fechar
          </AppButton>
          <AppButton
            variant="contained"
            startIcon={<DownloadOutlinedIcon />}
            onClick={onDownload}
            disabled={downloadLoading || previewState.type === 'error'}
          >
            {downloadLoading ? 'Baixando...' : 'Baixar'}
          </AppButton>
        </AppDialogActions>
      ) : null}
    </AppDialog>
  );
};
