"use client";
import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/muiTheme";
import { UserProvider } from "@/providers/userProvider";
import { EntityProvider } from "@/providers/entityProvider";
import { ItemProvider } from "@/providers/itemProvider";
import { Loading } from "@/components/Feedback/Loading";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <UserProvider>
        <EntityProvider>
          <ItemProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {!mounted && <Loading />}
              {children}
            </ThemeProvider>
          </ItemProvider>
        </EntityProvider>
      </UserProvider>
    </LocalizationProvider>
  );
}
