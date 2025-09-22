import React from "react";
import { MenuItem } from "@mui/material";

interface ErrorMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function ErrorMenuItem({ children, onClick }: ErrorMenuItemProps) {
  return (
    <MenuItem
      onClick={onClick}
      sx={{ color: "error.main", fontWeight: "bold" }}
    >
      {children}
    </MenuItem>
  );
}
