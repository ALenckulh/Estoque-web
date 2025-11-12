"use client";
import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/muiTheme";
import { UserProvider } from "@/providers/userProvider";
import { Loading } from "@/components/Feedback/Loading";



export function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!mounted && <Loading />}
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}
