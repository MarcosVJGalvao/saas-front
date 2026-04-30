import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FileUpload } from './FileUpload';

interface AvatarUploaderProps {
  imageUrl?: string;
  onFileSelected: (file: File | null) => void;
}

export const AvatarUploader = ({ imageUrl, onFileSelected }: AvatarUploaderProps) => (
  <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
    <Avatar src={imageUrl} sx={{ width: 72, height: 72 }} />
    <FileUpload accept="image/*" onFileSelected={onFileSelected} />
    <Typography variant="caption" color="text.secondary">
      PNG/JPG ate 5MB
    </Typography>
  </Stack>
);
