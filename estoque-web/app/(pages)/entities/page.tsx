"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableListEntity from "@/components/Entity/Tables/TableListEntity";
import { Icon } from "@/components/ui/Icon";
import { Body1, Body4, Subtitle2 } from "@/components/ui/Typography";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Drawer,
  Popover,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { validateEntityName } from "@/utils/validations";

type Option = {
  label: string;
  value: string | number;
};

export default function Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("entidade");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [entityName, setEntityName] = useState("");
  const [anchorPopover, setAnchorPopover] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState<Option | null>(null);
  const [errors, setErrors] = useState<{ entityName?: string }>({});
  const isFilterEmpty = !filterStatus;
  const hasActiveFilters = !isFilterEmpty;

  const statusOptions: Option[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const handleCreatedEntity = (id: number) => {
    const nameError = validateEntityName(entityName);
    setErrors({ entityName: nameError });
    if (nameError) return;
    setOpenDrawer(false);
    router.push(`/entities/${id}`);
  };

  const handleClearFilters = () => {
    setFilterStatus(null);
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
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                  Filtrar Entidades
                </Subtitle2>
                <form
                  className="formContainer"
                  style={{ width: "100%", gap: "20px" }}
                >
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
              variant="contained"
              startIcon={<Icon name="Plus"></Icon>}
              onClick={() => setOpenDrawer(true)}
            >
              Criar Entidade
            </Button>
          </Box>
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
            <form
              className="formContainer"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreatedEntity(5);
              }}
            >
              <TextField
                label="Nome da entidade"
                value={entityName}
                onChange={(e) => {
                  setEntityName(e.target.value);
                }}
                error={!!errors.entityName}
                helperText={errors.entityName}
              />
              <TextField placeholder="E-mail" />
              <TextField placeholder="Telefone" />
              <TextField placeholder="Endereço" />
              <TextField
                multiline
                rows={8}
                placeholder="Digite a nova descrição..."
              />
              <Button
                sx={{ marginTop: "20px" }}
                variant="contained"
                type="submit"
              >
                Confirmar
              </Button>
            </form>
          </Container>
        </Drawer>
      </div>
    </div>
  );
}
