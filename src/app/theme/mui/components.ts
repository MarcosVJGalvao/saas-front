import type { Components, Theme } from '@mui/material/styles';

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
        background:
          theme.palette.mode === 'dark' ? theme.palette.text.disabled : theme.palette.text.disabled,
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
      }),
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
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
          theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[900],
        fontSize: '0.75rem',
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[900],
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
};
