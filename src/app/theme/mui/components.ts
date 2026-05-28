import type { Components, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      ':root': {
        colorScheme: theme.palette.mode,
      },
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor:
          theme.palette.mode === 'dark'
            ? `${theme.palette.divider} transparent`
            : `${theme.palette.divider} transparent`,
      },
      '*::-webkit-scrollbar': { width: 6, height: 6 },
      '*::-webkit-scrollbar-track': { background: 'transparent' },
      '*::-webkit-scrollbar-thumb': {
        background: theme.palette.divider,
        borderRadius: 3,
      },
      '*::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.text.disabled,
      },
      html: {
        colorScheme: theme.palette.mode,
        backgroundColor: theme.palette.background.default,
      },
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
    }),
  },

  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle1: 'p',
        subtitle2: 'p',
        body1: 'p',
        body2: 'p',
      },
    },
  },

  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 14px 40px ${alpha('#000000', 0.28)}`
            : `0 14px 40px ${alpha('#0F172A', 0.08)}`,
      }),
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
      }),
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
      },
    },
  },

  MuiMenu: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
      },
    },
  },

  MuiPopover: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
      },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },

  MuiTooltip: {
    defaultProps: { arrow: true },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? alpha('#111111', 0.96) : theme.palette.grey[900],
        fontSize: '0.75rem',
        border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : 'transparent'}`,
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.mode === 'dark' ? alpha('#111111', 0.96) : theme.palette.grey[900],
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        textTransform: 'none',
        boxShadow: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        minHeight: 40,
        '&.MuiButton-containedPrimary': {
          background: `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 10px 24px ${alpha(theme.palette.primary.main, 0.28)}`
              : `0 10px 24px ${alpha(theme.palette.primary.main, 0.18)}`,
        },
        '&.MuiButton-containedPrimary:hover': {
          background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 14px 28px ${alpha(theme.palette.primary.main, 0.34)}`
              : `0 12px 26px ${alpha(theme.palette.primary.main, 0.22)}`,
        },
        '&.MuiButton-containedPrimary.Mui-disabled': {
          background: alpha(theme.palette.text.disabled, 0.16),
          color: alpha(theme.palette.text.primary, 0.38),
        },
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.light, 0.8)}`,
          outlineOffset: 2,
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.32 : 0.24),
        color:
          theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
        '&:hover': {
          borderColor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === 'dark' ? 0.48 : 0.36,
          ),
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === 'dark' ? 0.1 : 0.06,
          ),
        },
      }),
      text: ({ theme }) => ({
        color:
          theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === 'dark' ? 0.12 : 0.08,
          ),
        },
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontWeight: 500,
        borderRadius: 8,
        ...(theme.palette.mode === 'dark'
          ? {
              '&.MuiChip-filledDefault': {
                backgroundColor: alpha(theme.palette.text.primary, 0.1),
                color: theme.palette.text.primary,
              },
              '&.MuiChip-outlined': {
                borderColor: alpha(theme.palette.common.white, 0.12),
              },
            }
          : {}),
      }),
    },
  },
};
