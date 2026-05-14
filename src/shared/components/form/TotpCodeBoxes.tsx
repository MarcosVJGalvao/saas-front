import { useRef } from 'react';
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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
                if (nextDigit) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Backspace' && digit.length === 0 && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              onFocus={(event) => {
                event.target.select();
              }}
              slotProps={{
                htmlInput: {
                  'aria-label': `Dígito ${index + 1} do código de autenticação`,
                  ref: (el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  },
                  maxLength: 1,
                  inputMode: 'numeric',
                  style: { textAlign: 'center', fontSize: 22, fontWeight: 600, width: 36 },
                },
              }}
              sx={{ '& .MuiInputBase-root': { height: 54, width: 50, borderRadius: 2 } }}
            />
          ))}
          <input
            type="hidden"
            name={field.name}
            value={String(field.value ?? '')}
            readOnly
            aria-hidden="true"
          />
        </Box>
      )}
    />
  );
};
