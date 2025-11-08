import React from "react";
import { Box, Card, Container } from "@mui/material";
import { Subtitle1, H4, H3 } from "../ui/Typography";

interface NotFoundProps {
  description: string;
}

export const NotFound = ({ description, ...props }: NotFoundProps) => {
  return (
    <div className="container" style={{ height: "calc(100vh - 64px)", }}>
      <Card sx={{height: "100%",}}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: 8,
          }}
        >
          <img
            src="/illustrations/notFound.svg"
            alt="Página não encontrada"
            style={{ maxHeight: "80%", width: "auto" }}
            {...props}
          />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, marginTop: 8 }}>
            <H3>404</H3>
            <Subtitle1 sx={{ color: "var(--neutral-70)" }}>{description}</Subtitle1>
          </Box>
          
        </Box>
      </Card>
      <Box sx={{ height: 16 }} />
    </div>
  );
};
