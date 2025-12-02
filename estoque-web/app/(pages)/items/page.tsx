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
import React, { useEffect, useState } from "react";
import { api } from "@/utils/axios";
import { useUser } from "@/hooks/userHook";
import { useToast } from "@/hooks/toastHook";
import { validateProductName } from "@/utils/validations";

type Option = {
  label: string;
  value: string | number;
};

export default function Page() {
  const router = useRouter();
  const { myUserEnterpriseId } = useUser();
  const { showToast } = useToast();
  const [selectedTab, setSelectedTab] = useState("itens");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorPopover, setAnchorPopover] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMeasureUnity, setSelectedMeasureUnity] =
    useState<Option | null>(null); // Autocomplete
  const [manufacturer, setManufacturer] = useState<string>(""); // TextField simples
  const [selectedSegment, setSelectedSegment] = useState<Option | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  const [productName, setProductName] = useState("");
  const [productErrors, setProductErrors] = useState<{ name?: string }>({});
  const [quantityAlert, setQuantityAlert] = useState<number>(5);
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // Filtro - estados controlados
  const [filterGroup, setFilterGroup] = useState<Option | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterUnit, setFilterUnit] = useState<Option | null>(null);
  const [filterStatus, setFilterStatus] = useState<Option | null>(null);
  const [filterQuantityLevel, setFilterQuantityLevel] = useState<Option | null>(null);

  // Carrega filtros do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem("itemFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.group) setFilterGroup(parsed.group);
        if (parsed.date) setFilterDate(parsed.date);
        if (parsed.unit) setFilterUnit(parsed.unit);
        if (parsed.status) setFilterStatus(parsed.status);
        if (parsed.quantity) setFilterQuantityLevel(parsed.quantity);
      } catch {}
    }
  }, []);
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
    localStorage.removeItem("itemFilters");
    setAnchorPopover(null);
  };

  // Salva filtros no localStorage
  const handleApplyFilters = () => {
    const filtersToSave = {
      group: filterGroup,
      date: filterDate,
      unit: filterUnit,
      status: filterStatus,
      quantity: filterQuantityLevel,
    };
    localStorage.setItem("itemFilters", JSON.stringify(filtersToSave));
    setAnchorPopover(null);
    // A tabela já recarrega pois o estado dos filtros muda
  };
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateProductName(productName);
    setProductErrors({ name: nameError });
    if (nameError) return;

    if (!myUserEnterpriseId) {
      showToast("Empresa não identificada.", "error", "X");
      return;
    }

    try {
      const payload = {
        name: productName,
        description: description || undefined,
        quantity_alert: quantityAlert,
        unit_id: selectedMeasureUnity?.value ?? undefined,
        segment_id: selectedSegment?.value ?? undefined,
        manufacturer: manufacturer || undefined,
        position: position || undefined,
        group_id: selectedGroup?.value ?? undefined,
        enterprise_id: Number(myUserEnterpriseId),
      };
      const resp = await api.post("/item", payload);
      const created = resp?.data;
      const newId = Number(created?.id);
      console.log("Item criado:", newId);
      if (newId ) {
        showToast("Item criado com sucesso.", "success", "Check");
        setOpenDrawer(false);
        router.push(`/items/${newId}`);
      } else {
        showToast("Falha ao criar item.", "error", "X");
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.error || "Erro ao criar item.";
      showToast(msg, "error", "X");
    }
  };

  const [measurementUnits, setMeasurementUnits] = useState<Option[]>([]);

  const [segmentOptions, setSegmentOptions] = useState<Option[]>([]);

  const [groupOptions, setGroupOptions] = useState<Option[]>([]);

  const statusOptions: Option[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const quantityLevelOptions: Option[] = [
    { label: "Negativo", value: "negativo" },
    { label: "Baixo", value: "baixo" },
    { label: "Normal", value: "normal" },
  ];

  useEffect(() => {
    let cancelled = false;
    const loadOptions = async () => {
      if (!myUserEnterpriseId) return;
      try {
        const [segResp, grpResp, unitResp] = await Promise.all([
          api.get("/segment/listSegment", {
            headers: { "x-enterprise-id": String(myUserEnterpriseId) },
            params: { enterprise_id: myUserEnterpriseId },
          }),
          api.get("/group/listGroup", {
            headers: { "x-enterprise-id": String(myUserEnterpriseId) },
            params: { enterprise_id: myUserEnterpriseId },
          }),
          api.get("/unit/listUnit", {
            headers: { "x-enterprise-id": String(myUserEnterpriseId) },
            params: { enterprise_id: myUserEnterpriseId },
          }),
        ]);
        console.log(segResp, grpResp, unitResp);
        const segments = segResp?.data?.segments || [];
        const groups = grpResp?.data?.groups || [];
        const units = unitResp?.data?.units || [];
        const segOpts: Option[] = segments.map((s: any) => ({
          label: s.name ?? `Segmento (${s.id})`,
          value: Number(s.id),
        }));
        const grpOpts: Option[] = groups.map((g: any) => ({
          label: g.name ?? `Grupo (${g.id})`,
          value: Number(g.id),
        }));
        const unitOpts: Option[] = units.map((u: any) => ({
          label: u.name ?? `Unidade (${u.id})`,
          value: Number(u.id),
        }));
        if (!cancelled) {
          setSegmentOptions(segOpts);
          setGroupOptions(grpOpts);
          setMeasurementUnits(unitOpts);
        }
      } catch (err: any) {
        if (!cancelled) {
          showToast(
            err?.message || "Erro ao carregar opções de segmento/grupo/unidade",
            "error",
            "X"
          );
        }
      }
    };
    loadOptions();
    return () => {
      cancelled = true;
    };
  }, [myUserEnterpriseId]);

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
          <Body4 sx={{ color: "var(--neutral-60)" }}>Itens listados</Body4>
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
                  Filtrar Itens
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
                      onClick={handleClearFilters}
                      fullWidth
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Icon name="Check" />}
                      onClick={handleApplyFilters}
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
                Movimentar itens
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
                <MenuItem onClick={() => router.push("/input-items")} icon="Plus">
                  Entrada
                </MenuItem>
                <MenuItem onClick={() => router.push("/output-items")} icon="Minus">
                  Saída
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
        <TableListItem
          filters={{
            group_id: filterGroup?.value ? Number(filterGroup.value) : undefined,
            created_at: filterDate || undefined,
            unit_id: filterUnit?.value ? Number(filterUnit.value) : undefined,
            safe_delete:
              filterStatus?.value === "ativo"
                ? false
                : filterStatus?.value === "inativo"
                ? true
                : undefined,
            quantity:
              filterQuantityLevel?.value === "negativo"
                ? "negativo"
                : filterQuantityLevel?.value === "baixo"
                ? "baixo"
                : filterQuantityLevel?.value === "normal"
                ? "normal"
                : undefined,
          }}
        />
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
            <Body1 sx={{ color: "var(--neutral-80)" }}>Cadastrar Item</Body1>
            <form
              onSubmit={handleCreateProduct}
              className="formContainer"
              style={{ gap: "32px" }}
            >
              <Box
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Detail1>Item</Detail1>
                <TextField
                  label={
                    <span>
                      Nome do item{" "}
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
                  type="number"
                  value={quantityAlert}
                  onChange={(e) => setQuantityAlert(Number(e.target.value) || 0)}
                  label={
                    <span>
                      Quantidade de alerta{" "}
                      <span style={{ color: "var(--danger-0)" }}>*</span>
                    </span>
                  }
                  fullWidth
                />
                <TextField
                  label="Posição"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  fullWidth
                />
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
                <TextField
                  label="Fabricante"
                  placeholder="Digite o fabricante..."
                  variant="outlined"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  fullWidth
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
                  placeholder="Digite a descrição do item aqui..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
