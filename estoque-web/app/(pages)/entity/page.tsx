"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableListEntity from "@/components/Entity/Tables/TableListEntity";
import { Icon } from "@/components/ui/Icon";
import { Body1 } from "@/components/ui/Typograph";
import { Box, Button, Container, Drawer, TextField } from "@mui/material";
import React, { useState } from "react";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("entidade");
  const [openDrawer, setOpenDrawer] = useState(Boolean);

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
          <Body1 sx={{ color: "var(--neutral-70)" }}>Entidades Listadas</Body1>
          <Button
            variant="contained"
            startIcon={<Icon name="Plus"></Icon>}
            onClick={() => setOpenDrawer(true)}
          >
            Cadastrar Entidade
          </Button>
        </Box>
        <TableListEntity />
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Container style={{display:"flex", flexDirection:"column", gap:"40px"}}>
          <Body1>Cadastrar Entidade</Body1>
          <Box sx={{display: "flex", gap:"20px", flexDirection:"column"}}>
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
          <Button variant="contained" onClick={() => setOpenDrawer(false)}> Confirmar </Button>
          </Container>
        </Drawer>
      </div>
    </div>
  );
}
