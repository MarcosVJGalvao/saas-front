import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

export type AppTextFieldProps = TextFieldProps;

export const AppTextField = ({ fullWidth = true, ...props }: AppTextFieldProps) => (
  <TextField fullWidth={fullWidth} {...props} />
);
