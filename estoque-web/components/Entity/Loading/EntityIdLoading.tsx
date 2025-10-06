import React from "react";
import { Box, Card, Container, Skeleton } from "@mui/material";

export const EntityIdLoading = () => {
  return (
    <>
      <Card className="card">
        {/* Header */}
        <Container className="header">
          <Box>
            <Skeleton width={60} height={14} sx={{ mb: 0.5 }} /> {/* Cód */}
            <Skeleton width={180} height={20} /> {/* Nome */}
          </Box>

          <Container className="actions" sx={{ alignItems: "flex-start" }}>
            <Box className="dateInfo">
              <Skeleton width={80} height={14} sx={{ mb: 0.5 }} /> {/* "Criado em" */}
              <Skeleton width={100} height={18} /> {/* Data */}
            </Box>

            <Container
              className="actionButtons"
              sx={{ display: "flex", gap: 1 }}
            >
              <Skeleton width={80} height={36} />
              <Skeleton width={36} height={36} />
            </Container>
          </Container>
        </Container>

        {/* Status */}
        <Box
          className="status"
          sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
        >
          <Skeleton variant="circular" width={10} height={10} />
          <Skeleton width={60} height={16} />
        </Box>

        {/* Contatos */}
        <Container className="contactInfo" sx={{ mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} className="contactField" sx={{ mb: 1 }}>
              <Skeleton width={70} height={14} sx={{ mb: 0.5 }} />
              <Skeleton width="80%" height={18} />
            </Box>
          ))}
        </Container>

        {/* Descrição */}
        <Box className="description" sx={{ mt: 2 }}>
          <Skeleton width={80} height={14} sx={{ mb: 0.5 }} />
          <Skeleton width="100%" height={60} />
        </Box>
      </Card>

      {/* Histórico de movimentação */}
      <Box className="historyContainer">
        <Box
          className="historyHeader"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Skeleton width={180} height={16} />
        </Box>

        {/* Skeleton da tabela */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            borderRadius: "8px",
            p: 1.5,
            maxHeight: "100%",
            minHeight: "500px",
          }}
        >
          {[...Array(9)].map((_, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Skeleton width="30%" height={48} />
              <Skeleton width="20%" height={48} />
              <Skeleton width="25%" height={48} />
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ height: "12px" }}>
        <p></p>
      </Box>
    </>
  );
};
