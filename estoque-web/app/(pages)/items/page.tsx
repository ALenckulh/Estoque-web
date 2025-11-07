"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableListItem from "@/components/Items/Tables/TableListItems";
import { Icon } from "@/components/ui/Icon";
import { Body1, Body4, Detail1, Detail2 } from "@/components/ui/Typograph";
import { Box, Button, Container, Drawer, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("itens");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openMovementDrawer, setOpenMovementDrawer] = useState(false);


  const handleCreatedItem = (id: number) => {
    router.push(`/items/${id}`);
  };

  return (
    <div>
      <Appbar
        showTabs={true}
        showAvatar={true}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="container" style={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "20px"
          }}
        >
          <Body4 sx={{ color: "var(--neutral-60)" }}>Produtos listados</Body4>

          <Box
            sx={{
              display: "flex",
              gap: "16px",
              alignItems: "center"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#FF0000"
                  }}
                />
                <Detail2 sx={{ color: "var(--neutral-60)", fontSize: "12px" }}>
                  4 itens no negativo
                </Detail2>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#FFD700"
                  }}
                />
                <Detail2 sx={{ color: "var(--neutral-60)", fontSize: "12px" }}>
                  4 itens em baixa
                </Detail2>
              </Box>
            </Box>
            <Box
              sx={{
                width: "1px",
                height: "16px",
                backgroundColor: "var(--neutral-30)"
              }}
            />
            <Box sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                startIcon={<Icon name="ListFilter"></Icon>}
                onClick={() => setOpenFilterDrawer(!openFilterDrawer)}
                sx={{
                  minWidth: "40px",
                  width: "40px",
                  height: "40px",
                  padding: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0
                  }
                }}
              >
              </Button>

              {openFilterDrawer && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    width: "320px",
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "20px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginTop: "8px"
                  }}
                >
                  <Detail2 sx={{ fontWeight: "bold", marginBottom: "8px" }}>Filtrar Produtos</Detail2>

                  <FormControl fullWidth size="small">
                    <InputLabel id="grupo-label">Grupos</InputLabel>
                    <Select
                      labelId="grupo-label"
                      label="Grupos"
                    >
                      <MenuItem value="grupo1">Grupo 1</MenuItem>
                      <MenuItem value="grupo2">Grupo 2</MenuItem>
                      <MenuItem value="grupo3">Grupo 3</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Data de criação"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel id="unidade-label">Unidade</InputLabel>
                    <Select
                      labelId="unidade-label"
                      label="Unidade"
                    >
                      <MenuItem value="unidade">Unidade</MenuItem>
                      <MenuItem value="kg">Kilograma</MenuItem>
                      <MenuItem value="litro">Litro</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id="estado-label">Estado</InputLabel>
                    <Select
                      labelId="estado-label"
                      label="Estado"
                    >
                      <MenuItem value="ativo">Ativo</MenuItem>
                      <MenuItem value="inativo">Inativo</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id="quantidade-label">Quantidade</InputLabel>
                    <Select
                      labelId="quantidade-label"
                      label="Quantidade"
                    >
                      <MenuItem value="negativo">Negativo</MenuItem>
                      <MenuItem value="baixa">Baixa</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Icon name="FilterX"></Icon>}
                      onClick={() => setOpenFilterDrawer(false)}
                      fullWidth
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Icon name="Check"></Icon>}
                      onClick={() => setOpenFilterDrawer(false)}
                      fullWidth
                    >
                      Aplicar
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            <Button
              variant="outlined"
              startIcon={<Icon name="Plus"></Icon>}
              onClick={() => setOpenDrawer(true)}
            >
              Cadastrar
            </Button>

            <Box sx={{ position: "relative" }}>
              <Button
                variant="contained"
                startIcon={<Icon name="Truck"></Icon>}
                onClick={() => setOpenMovementDrawer(!openMovementDrawer)}
              >
                Movimentar produtos
              </Button>

              {openMovementDrawer && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    width: "200px",
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "8px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginTop: "8px"
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      color: "var(--neutral-90)",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "var(--neutral-10)"
                      }
                    }}
                    onClick={() => {
                      setOpenMovementDrawer(false);
                    }}
                  >
                    <Detail2>Entrada</Detail2>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "var(--neutral-90)",
                      "&:hover": {
                        backgroundColor: "var(--neutral-10)"
                      }
                    }}
                    onClick={() => {
                      setOpenMovementDrawer(false);
                    }}
                  >
                    <Detail2>Saída</Detail2>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <TableListItem />
        <Box sx={{ height: "12px" }}>
          <p></p>
        </Box>
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Container
            style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "20px", width: "400px" }}
          >
            <Body1 sx={{ color: "var(--neutral-60)" }}>Cadastrar Produto</Body1>
            <Box sx={{ display: "flex", gap: "20px", flexDirection: "column" }}>
              <Box>
                <Detail1 sx={{ fontWeight: "bold", marginBottom: "8px" }}>Produto</Detail1>
                <Box sx={{ display: "flex", gap: "16px", flexDirection: "column" }}>
                  <TextField
                    label={
                      <span>
                        Nome do produto
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    fullWidth
                  />
                  <TextField
                    label={
                      <span>
                        Quantidade de alerta
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    fullWidth
                  />
                  <TextField
                    label="Posição"
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel id="unidade-medida-label">Unidade de medida</InputLabel>
                    <Select
                      labelId="unidade-medida-label"
                      label="Unidade de medida"
                    >
                      <MenuItem value="unidade">Unidade</MenuItem>
                      <MenuItem value="kg">Kilograma</MenuItem>
                      <MenuItem value="g">Grama</MenuItem>
                      <MenuItem value="litro">Litro</MenuItem>
                      <MenuItem value="ml">Mililitro</MenuItem>
                      <MenuItem value="caixa">Caixa</MenuItem>
                      <MenuItem value="pacote">Pacote</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box>
                <Detail1 sx={{ fontWeight: "bold", marginBottom: "8px" }}>Classificação</Detail1>
                <Box sx={{ display: "flex", gap: "16px", flexDirection: "column" }}>
                  <FormControl fullWidth>
                    <InputLabel id="fabricante-label">Fabricante</InputLabel>
                    <Select
                      labelId="fabricante-label"
                      label="Fabricante"
                    >
                      <MenuItem value="fabricante1">Fabricante 1</MenuItem>
                      <MenuItem value="fabricante2">Fabricante 2</MenuItem>
                      <MenuItem value="fabricante3">Fabricante 3</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="segmento-label">Segmento</InputLabel>
                    <Select
                      labelId="segmento-label"
                      label="Segmento"
                    >
                      <MenuItem value="segmento1">Segmento 1</MenuItem>
                      <MenuItem value="segmento2">Segmento 2</MenuItem>
                      <MenuItem value="segmento3">Segmento 3</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="grupo-label">Grupo</InputLabel>
                    <Select
                      labelId="grupo-label"
                      label="Grupo"
                    >
                      <MenuItem value="grupo1">Grupo 1</MenuItem>
                      <MenuItem value="grupo2">Grupo 2</MenuItem>
                      <MenuItem value="grupo3">Grupo 3</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    multiline
                    rows={4}
                    label="Descrição"
                    placeholder="Digite a descrição do produto aqui..."
                  />
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDrawer(false);
                handleCreatedItem(5);
              }}
            >
              Confirmar
            </Button>
          </Container>
        </Drawer>
      </div>
    </div>
  );
}