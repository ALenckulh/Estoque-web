"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Icon } from "@/components/ui/Icon";
import { Subtitle2, Subtitle1 } from "@/components/ui/Typography";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useToast } from "@/hooks/toastHook";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/userHook";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDisplayOptions } from "@/hooks/useDisplayOptions";
import { useMovementItems } from "@/hooks/useMovementItems";
import { useMovementSubmit } from "@/hooks/useMovementSubmit";
import { useRouter } from "next/navigation";
import {
  validateNF,
  validateClienteSelected,
  validateProductRowsNegative,
} from "@/utils/validations";
import { api } from "@/utils/axios";
import { IconButton } from "@/components/ui/IconButton";
import { findMyUserId } from "@/lib/services/user/find-my-user-id";

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
  const [lote, setLote] = useState("");
  const { myUserEnterpriseId, myUserId, setMyUserId } = useUser();
  
  // isSubmitting vem do hook useMovementSubmit
  const [movementDate, setMovementDate] = useState(() => todayLocalISO());

    useEffect(() => {
    (async () => {
      try {
        const id = await findMyUserId();
        setMyUserId?.(id);
      } catch (e) {
      }
    })();
  }, [setMyUserId]);

  // Hook para itens (saida)
  const {
    productItems,
    setProductItems,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateItem: handleUpdateItem,
    extractNumericId,
    parseQuantity: parseQuantitySaida,
  } = useMovementItems("saida");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { produtoOptions, entitiesOptions, loadingDisplays } = useDisplayOptions(
    myUserEnterpriseId,
    showToast
  );

  

  const { isSubmitting, handleConfirm } = useMovementSubmit({
    type: "saida",
    enterpriseId: myUserEnterpriseId,
    userId: myUserId,
    selectedEntityOption,
    nf,
    lote,
    movementDate,
    productItems,
    parseQuantity: parseQuantitySaida,
    extractNumericId,
    showToast,
    queryClient,
    validateNF,
    validateEntitySelected: validateClienteSelected,
    validateRows: validateProductRowsNegative,
    setNfError,
    setEntityError,
    setProductErrors,
    onReset: () => {
      setNf("");
      setLote("");
      setSelectedEntityOption(null);
      setProductItems([{ produto: null, quantidade: null }]);
      setMovementDate(todayLocalISO());
    },
  });

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
              <TextField
                multiline
                rows={1}
                label="Lote"
                sx={{ flex: 1 }}
                value={lote}
                onChange={(e) => setLote(e.target.value)}
              />
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
              disabled={loadingDisplays}
            >
              {loadingDisplays ? "Carregando..." : "Adicionar item"}
            </Button>
          </Card>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" color="secondary" onClick={() => router.push('/items')}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={() => handleConfirm()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar"}
            </Button>
          </Box>

          <ToastContainer toasts={toasts} />
        </>
        <Box height={10}></Box>
      </div>
    </div>
  );
}
