import { ThemeOptions } from "@mui/material/styles";

export const typography: ThemeOptions["typography"] = {
  fontFamily: "Montserrat, sans-serif",
  h1: { fontSize: "96px", fontWeight: 400 },
  h2: { fontSize: "60px", fontWeight: 400 },
  h3: { fontSize: "48px", fontWeight: 400 },
  h4: { fontSize: "34px", fontWeight: 500 },
  body1: { fontSize: "24px", fontWeight: 500 },
  body2: { fontSize: "20px", fontWeight: 600 },
  subtitle1: { fontSize: "16px", fontWeight: 600 },
  subtitle2: { fontSize: "16px", fontWeight: 500 },
  button: {
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "0.0625rem",
    textTransform: "none",
  },
  caption: { fontSize: "14px", fontWeight: 500 },
  overline: { fontSize: "12px", fontWeight: 500 },
};
