import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2465d8"
    },
    secondary: {
      main: "#2465d8"
    },
    text: {
      primary: "#e8f1ff",
      secondary: "#c1cfe5"
    },
    background: {
      default: "#0f172a",
      paper: "#15203a"
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: "var(--text)",
          backgroundColor: "var(--bg)"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "var(--text)",
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600
        },
        contained: {
          color: "#ffffff"
        },
        outlined: {
          borderColor: "var(--line)",
          color: "var(--text)"
        },
        text: {
          color: "var(--text)"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "var(--text)"
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--chip-bg)",
          borderRadius: 8
        },
        bar: {
          backgroundColor: "var(--accent)"
        }
      }
    }
  }
});
