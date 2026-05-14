import UploadFileIcon from '@mui/icons-material/UploadFile';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';

interface FileUploadProps {
  accept?: string;
  onFileSelected: (file: File | null) => void;
  selectedFileName?: string;
}

export const FileUpload = ({ accept, onFileSelected, selectedFileName }: FileUploadProps) => (
  <AppStack spacing={1}>
    <AppButton component="label" variant="outlined" startIcon={<UploadFileIcon />}>
      Selecionar arquivo
      <input
        hidden
        type="file"
        accept={accept}
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          onFileSelected(file);
        }}
      />
    </AppButton>
    {selectedFileName !== undefined ? (
      <AppText variant="caption">{selectedFileName}</AppText>
    ) : null}
  </AppStack>
);
