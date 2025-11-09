"use client";
import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/muiTheme";
import { UserProvider } from "@/providers/userProvider";
import { AppReadyProvider } from "@/providers/appReadyProviderProps";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppReadyProvider>{children}</AppReadyProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
