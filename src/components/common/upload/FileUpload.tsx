import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface FileUploadProps {
  accept?: string;
  onFileSelected: (file: File | null) => void;
  selectedFileName?: string;
}

export const FileUpload = ({ accept, onFileSelected, selectedFileName }: FileUploadProps) => (
  <Stack spacing={1}>
    <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
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
    </Button>
    {selectedFileName !== undefined ? (
      <Typography variant="caption">{selectedFileName}</Typography>
    ) : null}
  </Stack>
);
