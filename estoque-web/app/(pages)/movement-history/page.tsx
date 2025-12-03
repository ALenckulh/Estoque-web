"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Icon } from "@/components/ui/Icon";
import { Body4, Subtitle2 } from "@/components/ui/Typography";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useToast } from "@/hooks/toastHook";
import TableMovimentHistory from "@/components/MovimentHistory/Tables/TableMovimentHistory";
import { Box, Button, Popover, Autocomplete, TextField, Menu } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MenuItem from "@/components/ui/MenuItem";

export default function Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("historico");
  const { toasts } = useToast();

  // Filtros: apenas Estado (ativo/inativo) e Tipo (entrada/saída)
  type Option = { label: string; value: string };
  const [filterStatus, setFilterStatus] = useState<Option | null>(null);
  const [filterType, setFilterType] = useState<Option | null>(null);
  const isFilterEmpty = !filterStatus && !filterType;
  const hasActiveFilters = !isFilterEmpty;

  const statusOptions: Option[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];
  const typeOptions: Option[] = [
    { label: "Entrada", value: "entrada" },
    { label: "Saída", value: "saida" },
  ];

  const handleClearFilters = () => {
    setFilterStatus(null);
    setFilterType(null);
  };

  const [anchorPopover, setAnchorPopover] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

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
          }}
        >
          <Body4 sx={{ color: "var(--neutral-60)" }}>Histórico de Movimentação</Body4>
          <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
                aria-label={hasActiveFilters ? "Filtros ativos" : "Abrir filtros"}
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
                slotProps={{ paper: { sx: { width: 320, p: 3 } } }}
              >
                <Subtitle2 sx={{ mb: "32px", color: "var(--neutral-80)" }}>
                  Filtrar Movimentações
                </Subtitle2>
                <form className="formContainer" style={{ width: "100%", gap: "20px" }}>
                  <Autocomplete
                    options={statusOptions}
                    getOptionLabel={(o) => o.label}
                    value={filterStatus}
                    onChange={(_, v) => setFilterStatus(v)}
                    isOptionEqualToValue={(o, v) => o.value === v?.value}
                    renderInput={(params) => (
                      <TextField {...params} label="Estado" placeholder="Selecione..." />
                    )}
                  />
                  <Autocomplete
                    options={typeOptions}
                    getOptionLabel={(o) => o.label}
                    value={filterType}
                    onChange={(_, v) => setFilterType(v)}
                    isOptionEqualToValue={(o, v) => o.value === v?.value}
                    renderInput={(params) => (
                      <TextField {...params} label="Tipo" placeholder="Selecione..." />
                    )}
                  />
                  <Box sx={{ display: "flex", gap: "12px", mt: "24px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Icon name="FilterX" />}
                      disabled={isFilterEmpty}
                      onClick={handleClearFilters}
                      fullWidth
                    >
                      Limpar
                    </Button>
                  </Box>
                </form>
              </Popover>
            </Box>
            <Box sx={{ position: "relative" }}>
              <Button
                variant="contained"
                startIcon={<Icon name="Truck" />}
                onClick={handleOpenMenu}
              >
                Movimentar itens
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: { sx: { width: anchorEl ? anchorEl.clientWidth : "auto" } },
                }}
              >
                <MenuItem onClick={() => { router.push("/input-items"); handleCloseMenu(); }} icon="Plus">
                  Entrada
                </MenuItem>
                <MenuItem onClick={() => { router.push("/output-items"); handleCloseMenu(); }} icon="Minus">
                  Saída
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
        <TableMovimentHistory
          filters={{
            // Map UI status to safe_delete boolean
            // Ativo -> safe_delete=false; Inativo -> safe_delete=true
            safe_delete:
              filterStatus?.value === "ativo"
                ? false
                : filterStatus?.value === "inativo"
                  ? true
                  : undefined,
            // Map UI type to entrada/saida
            type:
              filterType?.value === "entrada"
                ? "entrada"
                : filterType?.value === "saida"
                  ? "saida"
                  : undefined,
          }}
        />
        <Box sx={{ height: "12px" }} />
        <ToastContainer toasts={toasts} />
      </div>
    </div>
  );
}