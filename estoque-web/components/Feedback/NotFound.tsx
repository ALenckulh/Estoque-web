import React from "react";
import { Box, Card, Container } from "@mui/material";
import { Subtitle2 } from "../ui/Typography";


interface NotFoundProps {
    description: string;
}

export const NotFound = ({ description, ...props }: NotFoundProps) => {
  return (
    <div className="container">
      <Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/notFound.svg"
            alt="Página não encontrada"
            height={400}
            width={400}
            {...props}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "4px",
              alignItems: "center",
              position: "relative",
              top: "-44px",
            }}
          >
            <Subtitle2 sx={{ color: "var(--neutral-70)" }}>
              {description}
            </Subtitle2>
          </Box>
        </Box>
      </Card>
    </div>
  );
};
