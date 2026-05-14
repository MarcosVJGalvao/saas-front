import Avatar from '@mui/material/Avatar';
import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';
import { FileUpload } from '@shared/components/upload/FileUpload';

interface AvatarUploaderProps {
  imageUrl?: string;
  onFileSelected: (file: File | null) => void;
}

export const AvatarUploader = ({ imageUrl, onFileSelected }: AvatarUploaderProps) => (
  <AppStack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
    <Avatar src={imageUrl} sx={{ width: 72, height: 72 }} />
    <FileUpload accept="image/*" onFileSelected={onFileSelected} />
    <AppText variant="caption" color="text.secondary">
      PNG/JPG até 5MB
    </AppText>
  </AppStack>
);
