// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6AADEB", // Tailwind: tertiary-10
    },
    secondary: {
      main: "#717984", // Tailwind: neutral-60
    },
    success: {
      main: "#61BB29", // Tailwind: success-20
    },
    error: {
      main: "#E42D2D", // Tailwind: danger-30
    },
    warning: {
      main: "#DE7514", // Tailwind: alert-30
    },
    background: {
      default: "#F8FBFF", // Tailwind: neutral-10
      paper: "#FFFFFF",   // Tailwind: neutral-0
    },
    text: {
      primary: "#1B1D20", // Tailwind: neutral-90
      secondary: "#484D52", // Tailwind: neutral-70
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;