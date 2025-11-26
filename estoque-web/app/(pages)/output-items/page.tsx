"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Icon } from "@/components/ui/Icon";
import { Subtitle2, Subtitle1 } from "@/components/ui/Typography";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useToast } from "@/hooks/toastHook";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateNF,
  validateClienteSelected,
  validateProductRowsNegative,
} from "@/utils/validations";
import { IconButton } from "@/components/ui/IconButton";

type Option = {
  label: string;
  value: string | number;
};

export default function Page() {
  // retorna data local no formato YYYY-MM-DD (evita deslocamento por UTC)
  function todayLocalISO() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedEntityOption, setSelectedEntityOption] =
    useState<Option | null>(null);
  const { toasts, showToast } = useToast();
  const [nfError, setNfError] = useState("");
  const [entityError, setEntityError] = useState("");
  const [productErrors, setProductErrors] = useState<
    Array<{ produto?: string; quantidade?: string }>
  >([]);
  const [nf, setNf] = useState("");
  const [movementDate, setMovementDate] = useState(() => todayLocalISO());

  const [productItems, setProductItems] = useState([
    { produto: null, quantidade: null },
  ]);
  const router = useRouter();

  const produtoOptions: Option[] = [
    { label: "Produto A", value: "A" },
    { label: "Produto B", value: "B" },
    { label: "Produto C", value: "C" },
  ];

  const entitiesOptions: Option[] = [
    { label: "Entidade (1)", value: "Entidade (1)" },
    { label: "Entidade (2)", value: "Entidade (2)" },
    { label: "Entidade (3)", value: "Entidade (3)" },
    { label: "Entidade (4)", value: "Entidade (4)" },
    { label: "Entidade (5)", value: "Entidade (5)" },
    { label: "Entidade (6)", value: "Entidade (6)" },
    { label: "Entidade (7)", value: "Entidade (7)" },
    { label: "Entidade (8)", value: "Entidade (8)" },
  ];

  const handleAddItem = () => {
    setProductItems([...productItems, { produto: null, quantidade: null }]);
  };

  const handleRemoveItem = (index: number) => {
    if (productItems.length > 1) {
      const newItems = productItems.filter((_, i) => i !== index);
      setProductItems(newItems);
    }
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...productItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setProductItems(newItems);
  };

  function parseQuantityString(q: string | null): number {
    if (!q) return 0;
    const normalized = q.replace(".", "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  function handleConfirm() {
    // reset errors
    setNfError("");
    setEntityError("");
    setProductErrors([]);

    // validate NF only if provided (NF is optional)
    const nfErr = nf ? validateNF(nf) : null;
    if (nfErr) {
      setNfError(nfErr);
    }

    const entErr = validateClienteSelected(selectedEntityOption);
    if (entErr) {
      setEntityError(entErr);
    }

    const rowsResult = validateProductRowsNegative(productItems as any);
    if (!rowsResult.valid) {
      setProductErrors(rowsResult.errors || []);
    }

    if (nfErr || entErr || !rowsResult.valid) return;

    showToast("Movimentação registrada com sucesso.", "success");
    // limpar campos após submissão bem sucedida
    setNf("");
    setSelectedEntityOption(null);
    setProductItems([{ produto: null, quantidade: null }]);
    setMovementDate(todayLocalISO());
    setNfError("");
    setEntityError("");
    setProductErrors([]);
    // proceed with submission
  }

  return (
    <div>
      <Appbar
        showTabs={true}
        showAvatar={true}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="container">
        <>
          <Card
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 1,
              minHeight: 115,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Subtitle1 sx={{ color: "var(--neutral-60)" }}>
                Informações de{" "}
                <span style={{ color: "var(--danger-10" }}>Saida</span>
              </Subtitle1>
              <Tooltip arrow title="Informe os dados da saída de itens">
                <Icon name="Info" color="var(--neutral-50)" />
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                label={"NF"}
                error={!!nfError}
                helperText={nfError || undefined}
                sx={{ flex: 1 }}
                value={nf}
                onChange={(e) => {
                  // permitir somente números e limitar a 9 caracteres
                  const digitsOnly = e.target.value.replace(/\D/g, "");
                  setNf(digitsOnly.slice(0, 9));
                }}
                type="tel"
              />
              <TextField multiline rows={1} label="Lote" sx={{ flex: 1 }} />
              <TextField
                label={
                  <>
                    <span>Data de Movimentação</span>
                    <span style={{ color: "var(--danger-10)", marginLeft: 4 }}>
                      *
                    </span>
                  </>
                }
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ flex: 1 }}
                value={movementDate}
                onChange={(e) => setMovementDate(e.target.value)}
              />
              <Autocomplete
                sx={{ flex: 2 }}
                options={entitiesOptions}
                getOptionLabel={(option) => option.label}
                value={selectedEntityOption}
                onChange={(_, newValue) => setSelectedEntityOption(newValue)}
                isOptionEqualToValue={(option, val) =>
                  option.value === val?.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <>
                        <span>Cliente</span>
                        <span
                          style={{ color: "var(--danger-10)", marginLeft: 4 }}
                        >
                          *
                        </span>
                      </>
                    }
                    placeholder="Selecione..."
                    variant="outlined"
                    error={!!entityError}
                    helperText={entityError || undefined}
                  />
                )}
              />
            </Box>
          </Card>

          <Card
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 2,
              height: "70vh",
              overflow: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Subtitle1 sx={{ color: "var(--neutral-60)" }}>
                Itens
              </Subtitle1>
              <Tooltip
                arrow
                title="Informe os itens e quantidades que serão adicionados ao estoque"
              >
                <Icon name="Info" color="var(--neutral-50)" />
              </Tooltip>
            </Box>
            {productItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  padding: 1,
                  backgroundColor: "var(--neutral-10)",
                  borderRadius: 2,
                  border: "1px solid var(--neutral-30)",
                }}
              >
                <Autocomplete
                  options={produtoOptions}
                  getOptionLabel={(option) => option.label}
                  value={item.produto}
                  onChange={(_, newValue) =>
                    handleUpdateItem(index, "produto", newValue)
                  }
                  isOptionEqualToValue={(option, val) =>
                    option.value === val?.value
                  }
                  sx={{ flex: 1 }}
                  renderInput={(params) => {
                    const rowErr = productErrors[index] || {};
                    const tf = (
                      <TextField
                        {...params}
                        label={
                          index === 0 ? (
                            <>
                              <span>Item</span>
                              <span
                                style={{
                                  color: "var(--danger-10)",
                                  marginLeft: 4,
                                }}
                              >
                                *
                              </span>
                            </>
                          ) : (
                            "Item"
                          )
                        }
                        placeholder="Item"
                        sx={{ backgroundColor: "var(--neutral-0)" }}
                        error={!!rowErr.produto}
                        helperText={rowErr.produto || undefined}
                      />
                    );

                    return tf;
                  }}
                />
                {(() => {
                  const rowErr = productErrors[index] || {};
                  const label =
                    index === 0 ? (
                      <>
                        <span>Quantidade</span>
                        <span
                          style={{ color: "var(--danger-10)", marginLeft: 4 }}
                        >
                          *
                        </span>
                      </>
                    ) : (
                      "Quantidade"
                    );

                  const tf = (
                    <TextField
                      label={label}
                      placeholder="Quantidade"
                      variant="outlined"
                      size="small"
                      value={
                        item.quantidade
                          ? String(item.quantidade).replace("-", "")
                          : ""
                      }
                      onChange={(e) => {
                        // permitir números e vírgula como separador decimal (apenas uma vírgula)
                        // remover sinal negativo do input pois será adicionado automaticamente
                        const cleaned = e.target.value.replace(/[^0-9,]/g, "");
                        const parts = cleaned.split(",");
                        const value =
                          parts.length > 1
                            ? parts[0] + "," + parts.slice(1).join("")
                            : cleaned;
                        // armazenar com sinal negativo se houver valor
                        handleUpdateItem(index, "quantidade", value ? `-${value}` : null);
                      }}
                      type="tel"
                      sx={{ flex: 1, backgroundColor: "var(--neutral-0)" }}
                      error={!!rowErr.quantidade}
                      helperText={rowErr.quantidade || undefined}
                      slotProps={{
                        input: {
                          startAdornment: item.quantidade ? <span style={{ marginRight: 4 }}>-</span> : null,
                        }
                      }}
                    />
                  );

                  return tf;
                })()}

                {productItems.length > 1 && (
                  <IconButton
                    icon={"X"}
                    onClick={() => handleRemoveItem(index)}
                    tooltip="Remover Item"
                    buttonProps={{
                      variant: "text",
                      color: "error",
                    }}
                  />
                )}
              </Box>
            ))}

            <Button
              startIcon={<Icon name="Plus" />}
              onClick={handleAddItem}
              variant="contained"
              color="success"
              sx={{ alignSelf: "flex-start", mt: 1 }}
            >
              Adicionar item
            </Button>
          </Card>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" color="secondary" onClick={() => router.push('/items')}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => handleConfirm()}>
              Confirmar
            </Button>
          </Box>

          <ToastContainer toasts={toasts} />
        </>
        <Box height={10}></Box>
      </div>
    </div>
  );
}
