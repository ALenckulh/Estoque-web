"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableListEntity from "@/components/Entity/Tables/TableListEntity";
import { Icon } from "@/components/ui/Icon";
import { Body1, Body4 } from "@/components/ui/Typograph";
import { Box, Button, Container, Drawer, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("entidade");
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleCreatedEntity = (id: number) => {
    router.push(`/entity/${id}`);
  };

  return (
    <div>
      <Appbar
        showTabs={true}
        showAvatar={true}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="container">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Body4 sx={{ color: "var(--neutral-60)" }}>Entidades listadas</Body4>
          <Button
            variant="contained"
            startIcon={<Icon name="Plus"></Icon>}
            onClick={() => setOpenDrawer(true)}
          >
            Cadastrar Entidade
          </Button>
        </Box>
        <TableListEntity />
        <Box sx={{ height: "12px" }}>
          <p></p>
        </Box>
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Container
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            <Body1>Cadastrar Entidade</Body1>
            <Box sx={{ display: "flex", gap: "20px", flexDirection: "column" }}>
              <TextField placeholder="Nome da entidade" />
              <TextField placeholder="E-mail" />
              <TextField placeholder="Telefone" />
              <TextField placeholder="Endereço" />
              <TextField
                multiline
                rows={8}
                placeholder="Digite a nova descrição..."
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDrawer(false);
                handleCreatedEntity(5);
              }}
            >
              {" "}
              Confirmar{" "}
            </Button>
          </Container>
        </Drawer>
      </div>
    </div>
  );
}
