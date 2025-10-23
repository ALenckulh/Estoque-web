"use client";
import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { UserProvider } from "@/providers/user";
import theme from "./theme/muiTheme";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}
