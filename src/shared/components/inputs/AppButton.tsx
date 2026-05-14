import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

export type AppButtonProps = ButtonProps;

export const AppButton = ({ variant = 'contained', ...props }: AppButtonProps) => (
  <Button variant={variant} {...props} />
);
