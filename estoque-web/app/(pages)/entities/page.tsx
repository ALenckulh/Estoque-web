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
import React, { useEffect, useState } from "react";
import { validateEntityName } from "@/utils/validations";
import { api } from "@/utils/axios";
import { useUser } from "@/hooks/userHook";
import { useToast } from "@/hooks/toastHook";

type Option = {
  label: string;
  value: string | number;
};

export default function Page() {
  const router = useRouter();
  const { myUserEnterpriseId } = useUser();
  const { showToast } = useToast();
  const [selectedTab, setSelectedTab] = useState("entidade");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [entityName, setEntityName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [anchorPopover, setAnchorPopover] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState<Option | null>(null);
  const [errors, setErrors] = useState<{ entityName?: string }>({});

  // Carregar filtros do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem("entityFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.status) setFilterStatus(parsed.status);
      } catch {}
    }
  }, []);

  const isFilterEmpty = !filterStatus;
  const hasActiveFilters = !isFilterEmpty;

  const statusOptions: Option[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateEntityName(entityName);
    setErrors({ entityName: nameError });
    if (nameError) return;

    if (!myUserEnterpriseId) {
      showToast("Empresa não identificada.", "error", "X");
      return;
    }

    try {
      const payload = {
        name: entityName,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined,
        description: description || undefined,
        enterprise_id: String(myUserEnterpriseId),
      };
      const resp = await api.post("/entity", payload);
      const created = resp?.data?.entity;
      const newId = Number(created?.id);
      console.log("Entidade criada:", newId);
      if (newId) {
        showToast("Entidade criada com sucesso.", "success", "Check");
        setOpenDrawer(false);
        router.push(`/entities/${newId}`);
      } else {
        showToast("Falha ao criar entidade.", "error", "X");
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.error || "Erro ao criar entidade.";
      showToast(msg, "error", "X");
    }
  };

  const handleClearFilters = () => {
    setFilterStatus(null);
    localStorage.removeItem("entityFilters");
  };

  // Salvar filtros automaticamente quando mudam
  useEffect(() => {
    if (filterStatus) {
      const filtersToSave = { status: filterStatus };
      localStorage.setItem("entityFilters", JSON.stringify(filtersToSave));
    }
  }, [filterStatus]);

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
                      onClick={handleClearFilters}
                      fullWidth
                    >
                      Limpar
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
        <TableListEntity
          filters={{
            safe_delete:
              filterStatus?.value === "ativo"
                ? false
                : filterStatus?.value === "inativo"
                ? true
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
            <Body1>Cadastrar Entidade</Body1>
            <form
              className="formContainer"
              onSubmit={handleCreateEntity}
            >
              <TextField
                label={
                  <span>
                    Nome da entidade{" "}
                    <span style={{ color: "var(--danger-0)" }}>*</span>
                  </span>
                }
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                error={!!errors.entityName}
                helperText={errors.entityName}
              />
              <TextField
                label="E-mail"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Telefone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                label="Endereço"
                placeholder="Rua, número, bairro..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                multiline
                rows={8}
                label="Descrição"
                placeholder="Digite a descrição..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
