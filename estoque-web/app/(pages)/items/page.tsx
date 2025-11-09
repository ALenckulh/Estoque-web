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
  Popover,
  Menu,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { validateProductName } from "@/utils/validations";
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
  const [selectedMeasureUnity, setSelectedMeasureUnity] =
    useState<Option | null>(null); // Autocomplete
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<Option | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<Option | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  const [productName, setProductName] = useState("");
  const [productErrors, setProductErrors] = useState<{ name?: string }>({});
  // Filtro - estados controlados
  const [filterGroup, setFilterGroup] = useState<Option | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterUnit, setFilterUnit] = useState<Option | null>(null);
  const [filterStatus, setFilterStatus] = useState<Option | null>(null);
  const [filterQuantityLevel, setFilterQuantityLevel] = useState<Option | null>(
    null
  );
  const isFilterEmpty =
    !filterGroup &&
    !filterDate &&
    !filterUnit &&
    !filterStatus &&
    !filterQuantityLevel;
  const hasActiveFilters = !isFilterEmpty;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClearFilters = () => {
    setFilterGroup(null);
    setFilterDate("");
    setFilterUnit(null);
    setFilterStatus(null);
    setFilterQuantityLevel(null);
  };
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateProductName(productName);
    setProductErrors({ name: nameError });
    if (nameError) return;
    setOpenDrawer(false);
    router.push(`/items/${5}`);
  };

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

  const manufacturerOptions: Option[] = [
    { label: "Samsung", value: "samsung" },
    { label: "LG", value: "lg" },
    { label: "Dell", value: "dell" },
    { label: "Apple", value: "apple" },
    { label: "Bosch", value: "bosch" },
    { label: "Natura", value: "natura" },
    { label: "Ambev", value: "ambev" },
    { label: "3M", value: "3m" },
    { label: "Sony", value: "sony" },
    { label: "Embraer", value: "embraer" },
  ];

  const segmentOptions: Option[] = [
    { label: "Eletrônicos", value: "eletronicos" },
    { label: "Informática", value: "informatica" },
    { label: "Automotivo", value: "automotivo" },
    { label: "Alimentos e Bebidas", value: "alimentos_bebidas" },
    { label: "Higiene Pessoal", value: "higiene_pessoal" },
    { label: "Limpeza", value: "limpeza" },
    { label: "Moda", value: "moda" },
    { label: "Escritório", value: "escritorio" },
    { label: "Farmacêutico", value: "farmaceutico" },
    { label: "Construção", value: "construcao" },
  ];

  const groupOptions: Option[] = [
    { label: "Smartphones", value: "smartphones" },
    { label: "Notebooks", value: "notebooks" },
    { label: "Monitores", value: "monitores" },
    { label: "Peças Automotivas", value: "pecas_automotivas" },
    { label: "Bebidas", value: "bebidas" },
    { label: "Snacks", value: "snacks" },
    { label: "Detergentes", value: "detergentes" },
    { label: "Shampoos", value: "shampoos" },
    { label: "Parafusos", value: "parafusos" },
    { label: "Calçados", value: "calcados" },
  ];

  const statusOptions: Option[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const quantityLevelOptions: Option[] = [
    { label: "Negativo", value: "negativo" },
    { label: "Baixa", value: "baixa" },
    { label: "Normal", value: "normal" },
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
                aria-label={
                  hasActiveFilters ? "Filtros ativos" : "Abrir filtros"
                }
              />
              {hasActiveFilters && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    boxShadow: "0 0 0 2px #fff",
                  }}
                />
              )}
              <Popover
                open={Boolean(anchorPopover)}
                anchorEl={anchorPopover}
                onClose={() => setAnchorPopover(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                slotProps={{ paper: { sx: { width: 300, p: 3 } } }}
              >
                <Subtitle2 sx={{ mb: "40px", color: "var(--neutral-80)" }}>
                  Filtrar Produtos
                </Subtitle2>
                <form
                  className="formContainer"
                  style={{ width: "100%", gap: "20px" }}
                >
                  <Autocomplete
                    options={groupOptions}
                    getOptionLabel={(option) => option.label}
                    value={filterGroup}
                    onChange={(_, newValue) => setFilterGroup(newValue)}
                    isOptionEqualToValue={(option, val) =>
                      option.value === val?.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Grupos"
                        placeholder="Selecione..."
                      />
                    )}
                  />
                  <TextField
                    label="Data de criação"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={filterDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFilterDate(e.target.value)
                    }
                    fullWidth
                  />
                  <Autocomplete
                    options={measurementUnits}
                    getOptionLabel={(option) => option.label}
                    value={filterUnit}
                    onChange={(_, newValue) => setFilterUnit(newValue)}
                    isOptionEqualToValue={(option, val) =>
                      option.value === val?.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Unidade"
                        placeholder="Selecione..."
                      />
                    )}
                  />
                  <Autocomplete
                    options={statusOptions}
                    getOptionLabel={(option) => option.label}
                    value={filterStatus}
                    onChange={(_, newValue) => setFilterStatus(newValue)}
                    isOptionEqualToValue={(option, val) =>
                      option.value === val?.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Estado"
                        placeholder="Selecione..."
                      />
                    )}
                  />
                  <Autocomplete
                    options={quantityLevelOptions}
                    getOptionLabel={(option) => option.label}
                    value={filterQuantityLevel}
                    onChange={(_, newValue) => setFilterQuantityLevel(newValue)}
                    isOptionEqualToValue={(option, val) =>
                      option.value === val?.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Quantidade"
                        placeholder="Selecione..."
                      />
                    )}
                  />
                  <Box sx={{ display: "flex", gap: "12px", mt: "24px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Icon name="FilterX" />}
                      disabled={isFilterEmpty}
                      onClick={() => {
                        handleClearFilters();
                      }}
                      fullWidth
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Icon name="Check" />}
                      onClick={() => setAnchorPopover(null)}
                      disabled={isFilterEmpty}
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
                <MenuItem onClick={handleCloseMenu} icon="Plus">
                  Entrada
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} icon="Minus">
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
            <form
              onSubmit={handleCreateProduct}
              className="formContainer"
              style={{ gap: "32px" }}
            >
              <Box
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Detail1>Produto</Detail1>
                <TextField
                  label={
                    <span>
                      Nome do produto{" "}
                      <span style={{ color: "var(--danger-0)" }}>*</span>
                    </span>
                  }
                  fullWidth
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  error={!!productErrors.name}
                  helperText={productErrors.name}
                />
                <TextField
                  defaultValue={5}
                  label={
                    <span>
                      Quantidade de alerta{" "}
                      <span style={{ color: "var(--danger-0)" }}>*</span>
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
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Detail1>Classificação</Detail1>
                <Autocomplete
                  options={manufacturerOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedManufacturer}
                  onChange={(_, newValue) => setSelectedManufacturer(newValue)}
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
                <Autocomplete
                  options={segmentOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedSegment}
                  onChange={(_, newValue) => setSelectedSegment(newValue)}
                  isOptionEqualToValue={(option, val) =>
                    option.value === val?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Segmento"
                      placeholder="Selecione..."
                      variant="outlined"
                    />
                  )}
                />
                <Autocomplete
                  options={groupOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedGroup}
                  onChange={(_, newValue) => setSelectedGroup(newValue)}
                  isOptionEqualToValue={(option, val) =>
                    option.value === val?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Grupo"
                      placeholder="Selecione..."
                      variant="outlined"
                    />
                  )}
                />
                <TextField
                  multiline
                  rows={4}
                  label="Descrição"
                  placeholder="Digite a descrição do produto aqui..."
                />
              </Box>
              <Button variant="contained" type="submit" sx={{ mt: "8px" }}>
                Confirmar
              </Button>
            </form>
          </Container>
        </Drawer>
      </div>
    </div>
  );
}
