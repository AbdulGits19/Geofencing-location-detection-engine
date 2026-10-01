import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#FFBB2D', contrastText: '#0f172a' },
    background: { default: '#FAF8F0', paper: '#FFFFFF' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
  shape: { borderRadius: 6 }, // Base unit: 6px (no more giant pills)
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", -apple-system, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.03em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          border: '1px solid #e2e8f0',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
  },
});