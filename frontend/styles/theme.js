import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2465d8"
    },
    secondary: {
      main: "#2465d8"
    },
    background: {
      default: "#eef3fb",
      paper: "#ffffff"
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
    borderRadius: 16
  }
});
