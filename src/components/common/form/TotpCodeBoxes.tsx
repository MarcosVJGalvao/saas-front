import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface TotpCodeBoxesProps {
  name: string;
}

export const TotpCodeBoxes = ({ name }: TotpCodeBoxesProps) => {
  const { control, setValue, watch } = useFormContext();
  const currentValue = String(watch(name) ?? '');
  const digits = Array.from({ length: 6 }, (_, index) => currentValue[index] ?? '');
  const focusPreviousInput = (target: HTMLInputElement, index: number) => {
    const maybeContainer = target.parentElement?.parentElement;
    if (maybeContainer === null || maybeContainer === undefined) {
      return;
    }
    const inputElements = Array.from(maybeContainer.querySelectorAll('input'));
    const previousInput = inputElements[index - 1];
    if (previousInput instanceof HTMLInputElement) {
      previousInput.focus();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
          {digits.map((digit, index) => (
            <TextField
              key={`totp-${index}`}
              value={digit}
              onChange={(event) => {
                const nextDigit = event.target.value.replace(/\D/g, '').slice(-1);
                const baseDigits = currentValue.padEnd(6, ' ').split('');
                baseDigits[index] = nextDigit || ' ';
                const nextValue = baseDigits.join('').replace(/\s/g, '');
                setValue(name, nextValue, { shouldValidate: true, shouldDirty: true });
              }}
              onKeyDown={(event) => {
                if (!(event.target instanceof HTMLInputElement)) {
                  return;
                }
                if (event.key === 'Backspace' && digit.length === 0 && index > 0) {
                  focusPreviousInput(event.target, index);
                }
              }}
              onFocus={(event) => {
                event.target.select();
              }}
              slotProps={{
                htmlInput: {
                  maxLength: 1,
                  inputMode: 'numeric',
                  style: { textAlign: 'center', fontSize: 28, fontWeight: 600, width: 42 },
                },
              }}
              sx={{ '& .MuiInputBase-root': { height: 64, width: 58, borderRadius: 2 } }}
            />
          ))}
          <input type="hidden" name={field.name} value={String(field.value ?? '')} readOnly />
        </Box>
      )}
    />
  );
};
