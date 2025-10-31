"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Icon } from "../ui/Icon";

export const Loading = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(var(--neutral-0-rgb), 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          mb: 2,
          // Definindo a animação diretamente no sx
          "@keyframes spin": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg)",
            },
          },
          animation: "spin 1s linear infinite",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--primary-20)",
        }}
      >
        <Icon name={"LoaderCircle"} size={40} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: "var(--neutral-80)",
          fontWeight: 500,
        }}
      >
        Carregando a página...
      </Typography>
    </Box>
  );
};