"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableListItem from "@/components/Items/Tables/TableListItems";
import { Icon } from "@/components/ui/Icon";
import MenuItem from "@/components/ui/MenuItem";
import {
  Body1,
  Body4,
  Detail1,
  Detail2,
  Subtitle2,
} from "@/components/ui/Typography";
import {
  Box,
  Button,
  Container,
  Drawer,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Popover,
  Menu,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

export default function Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("itens");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorPopover, setAnchorPopover] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMeasureUnity, setSelectedMeasureUnity] = useState<Option | null>(null); // Autocomplete

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCreatedItem = (id: number) => router.push(`/item/${id}`);

  const measurementUnits: Option[] = [
  { label: "Unidade", value: "unidade" },
  { label: "Caixa", value: "caixa" },
  { label: "Pacote", value: "pacote" },
  { label: "Peça", value: "peca" },
  { label: "Metro", value: "metro" },
  { label: "Centímetro", value: "centimetro" },
  { label: "Milímetro", value: "milimetro" },
  { label: "Litro", value: "litro" },
  { label: "Mililitro", value: "mililitro" },
  { label: "Quilograma", value: "kg" },
  { label: "Grama", value: "g" },
  { label: "Par", value: "par" },
  { label: "Conjunto", value: "conjunto" },
];

  return (
    <div>
      <Appbar
        showTabs
        showAvatar
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
            mb: "20px",
          }}
        >
          <Body4 sx={{ color: "var(--neutral-60)" }}>Produtos listados</Body4>
          <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#FF0000",
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
                    backgroundColor: "#FFD700",
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
                backgroundColor: "var(--neutral-30)",
              }}
            />
            <Box sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                startIcon={<Icon name="ListFilter" />}
                onClick={(e) => setAnchorPopover(e.currentTarget)}
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  p: "8px",
                  "& .MuiButton-startIcon": { m: 0 },
                }}
              />
              <Popover
                open={Boolean(anchorPopover)}
                anchorEl={anchorPopover}
                onClose={() => setAnchorPopover(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                slotProps={{ paper: { sx: { width: 300, p: 3 } } }}
              >
                <Subtitle2 sx={{ mb: "24px" }}>Filtrar Produtos</Subtitle2>
                <form
                  className="formContainer"
                  style={{ width: "100%", gap: "12px" }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="grupo-label">Grupos</InputLabel>
                    <Select labelId="grupo-label" label="Grupos">
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
                  <FormControl>
                    <InputLabel id="unidade-label">Unidade</InputLabel>
                    <Select labelId="unidade-label" label="Unidade">
                      <MenuItem value="unidade">Unidade</MenuItem>
                      <MenuItem value="kg">Kilograma</MenuItem>
                      <MenuItem value="litro">Litro</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="estado-label">Estado</InputLabel>
                    <Select labelId="estado-label" label="Estado">
                      <MenuItem value="ativo">Ativo</MenuItem>
                      <MenuItem value="inativo">Inativo</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="quantidade-label">Quantidade</InputLabel>
                    <Select labelId="quantidade-label" label="Quantidade">
                      <MenuItem value="negativo">Negativo</MenuItem>
                      <MenuItem value="baixa">Baixa</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: "flex", gap: "12px", mt: "24px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Icon name="FilterX" />}
                      onClick={() => setAnchorPopover(null)}
                      fullWidth
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Icon name="Check" />}
                      onClick={() => setAnchorPopover(null)}
                      fullWidth
                    >
                      Aplicar
                    </Button>
                  </Box>
                </form>
              </Popover>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Icon name="Plus" />}
              onClick={() => setOpenDrawer(true)}
            >
              Cadastrar
            </Button>
            <Box sx={{ position: "relative" }}>
              <Button
                variant="contained"
                startIcon={<Icon name="Truck" />}
                onClick={handleOpenMenu}
              >
                Movimentar produtos
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                slotProps={{
                  paper: {
                    sx: {
                      width: anchorEl ? anchorEl.clientWidth : "auto",
                    },
                  },
                }}
              >
                <MenuItem onClick={handleCloseMenu} icon="Users">
                  Entrada
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} icon="LogOut" error={true}>
                  Saída
                </MenuItem>
              </Menu>
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
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            <Body1 sx={{ color: "var(--neutral-80)" }}>Cadastrar Produto</Body1>
            <Box sx={{ display: "flex", gap: "24px", flexDirection: "column" }}>
              <Box
                sx={{ display: "flex", gap: "12px", flexDirection: "column" }}
              >
                <Detail1>Produto</Detail1>
                <TextField
                  label={
                    <span>
                      Nome do produto
                      <span style={{ color: "var(--danger-0)" }}>*</span>
                    </span>
                  }
                  fullWidth
                />
                <TextField
                defaultValue={5}
                  label={
                    <span>
                      Quantidade de alerta
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  fullWidth
                />
                <TextField label="Posição" fullWidth />
                <Autocomplete
                  options={measurementUnits}
                  getOptionLabel={(option) => option.label}
                  value={selectedMeasureUnity}
                  onChange={(_, newValue) => setSelectedMeasureUnity(newValue)}
                  isOptionEqualToValue={(option, val) =>
                    option.value === val?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unidade de medida"
                      placeholder="Selecione..."
                      variant="outlined"
                    />
                  )}
                />
              </Box>
              <Box
                sx={{ display: "flex", gap: "12px", flexDirection: "column" }}
              >
                <Detail1>Classificação</Detail1>
                <Autocomplete
                  options={measurementUnits}
                  getOptionLabel={(option) => option.label}
                  value={selectedMeasureUnity}
                  onChange={(_, newValue) => setSelectedMeasureUnity(newValue)}
                  isOptionEqualToValue={(option, val) =>
                    option.value === val?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Fabricante"
                      placeholder="Selecione..."
                      variant="outlined"
                    />
                  )}
                />
                <FormControl fullWidth>
                  <InputLabel id="fabricante-label">Fabricante</InputLabel>
                  <Select labelId="fabricante-label" label="Fabricante">
                    <MenuItem value="fabricante1">Fabricante 1</MenuItem>
                    <MenuItem value="fabricante2">Fabricante 2</MenuItem>
                    <MenuItem value="fabricante3">Fabricante 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="segmento-label">Segmento</InputLabel>
                  <Select labelId="segmento-label" label="Segmento">
                    <MenuItem value="segmento1">Segmento 1</MenuItem>
                    <MenuItem value="segmento2">Segmento 2</MenuItem>
                    <MenuItem value="segmento3">Segmento 3</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="grupo-label">Grupo</InputLabel>
                  <Select labelId="grupo-label" label="Grupo">
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
