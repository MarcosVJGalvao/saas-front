import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface AppSwitchProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export const AppSwitch = ({ checked, label, disabled = false, onChange }: AppSwitchProps) => (
  <FormControlLabel
    control={
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    }
    label={label}
  />
);
