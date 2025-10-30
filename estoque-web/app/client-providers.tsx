"use client";
import { ReactNode, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { UserProvider } from "@/providers/user";
import theme from "./theme/muiTheme";
import { Loading } from "@/components/Feedback/Loading";

export function ClientProviders({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        {!isMounted && <Loading />}
      </ThemeProvider>
    </UserProvider>
  );
}
