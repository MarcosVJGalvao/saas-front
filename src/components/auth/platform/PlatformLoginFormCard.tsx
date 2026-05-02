import { memo, useCallback, useMemo, useState } from 'react';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Controller } from 'react-hook-form';
import { AppForm } from '@/components/common/form/AppForm';
import type { LoginSchema } from '@/forms/validators';
import type { UseFormReturn } from 'react-hook-form';

interface PlatformLoginFormCardProps {
  form: UseFormReturn<LoginSchema>;
  loading: boolean;
  onSubmit: (data: LoginSchema) => Promise<void>;
  header: {
    title: string;
    subtitle: string;
  };
  labels: {
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    submit: string;
  };
  placeholders: {
    email: string;
    password: string;
  };
  styles?: {
    fieldLabelSx?: object;
  };
}

export const PlatformLoginFormCard = memo(
  ({
    form,
    loading,
    onSubmit,
    header,
    labels,
    placeholders,
    styles,
  }: PlatformLoginFormCardProps) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const fieldLabelSx = useMemo(
      () =>
        styles?.fieldLabelSx ?? {
          fontSize: 18,
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: -1,
        },
      [styles?.fieldLabelSx, theme.palette.text.primary],
    );
    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((currentState) => !currentState);
    }, []);
    const preventMouseDown = useCallback((event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
    }, []);

    return (
      <Paper
        elevation={0}
        sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 620, borderRadius: 2.5 }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8, mb: 2.2 }}
        >
          <Box
            sx={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              bgcolor: theme.palette.action.hover,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 36 }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: { xs: 34, md: 42, lg: 48 },
            }}
          >
            {header.title}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 15 }}>
            {header.subtitle}
          </Typography>
        </Box>

        <AppForm form={form} onSubmit={onSubmit}>
          <Typography sx={fieldLabelSx}>{labels.email}</Typography>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                placeholder={placeholders.email}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                  '& .MuiInputBase-input': { py: 1.55 },
                }}
              />
            )}
          />

          <Typography sx={fieldLabelSx}>{labels.password}</Typography>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholders.password}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                autoComplete="new-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={togglePasswordVisibility}
                          onMouseDown={preventMouseDown}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon
                              sx={{ color: theme.palette.text.secondary }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon sx={{ color: theme.palette.text.secondary }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                  '& .MuiInputBase-input': { py: 1.55 },
                  '& input::-ms-reveal': { display: 'none' },
                  '& input::-ms-clear': { display: 'none' },
                }}
              />
            )}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: -0.3,
            }}
          >
            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={field.value}
                      onChange={(_event, checked) => field.onChange(checked)}
                    />
                  }
                  label={labels.rememberMe}
                  sx={{ color: theme.palette.text.secondary, ml: -0.2 }}
                />
              )}
            />
            <Link href="#" underline="none" sx={{ fontSize: 15 }}>
              {labels.forgotPassword}
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.6,
              borderRadius: 2,
              fontSize: 18,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : labels.submit}
          </Button>
        </AppForm>
      </Paper>
    );
  },
);
