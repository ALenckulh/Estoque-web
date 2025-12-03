"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableHistoryItems from "@/components/Items/Tables/TableHistoryItems";
import { RowDataItem } from "@/components/Items/Tables/TableListItems";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { itemList } from "@/utils/dataBaseExample";
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useItemQuery, useUpdateItemMutation, useToggleSafeDeleteMutation } from "@/hooks/useItemQuery";
import CopyTooltip from "@/components/ui/CopyTooltip";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { Body1, Detail1, Detail4, Subtitle2 } from "@/components/ui/Typography";
import { NotFound } from "@/components/Feedback/NotFound";
import { useToast } from "@/hooks/toastHook";
import { validateProductName } from "@/utils/validations";

type Option = {
  label: string;
  value: string | number;
};

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("itens");
  const params = useParams();
  const id = params.id;
  const itemId = typeof id === "string" || typeof id === "number" ? id : undefined;
  const { data: item, isLoading, isError } = useItemQuery(itemId ?? "");
  const updateItemMutation = useUpdateItemMutation(itemId ?? "");
  const toggleSafeDeleteMutation = useToggleSafeDeleteMutation(itemId ?? "");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [openModalInactive, setOpenModalInactive] = useState(false);
  const [openModalActive, setOpenModalActive] = useState(false);
  const { toasts, showToast } = useToast();
  const [productName, setProductName] = useState<string>("");
  const [productErrors, setProductErrors] = useState<{ name?: string }>({});
  const [selectedMeasureUnity, setSelectedMeasureUnity] = useState<Option | null>(null);
  const [manufacturer, setManufacturer] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<Option | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  const [alertQuantity, setAlertQuantity] = useState<number | "">("");
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [initialProductName, setInitialProductName] = useState<string>("");
  const [initialMeasureUnity, setInitialMeasureUnity] = useState<Option | null>(null);
  const [initialManufacturer, setInitialManufacturer] = useState<string>("");
  const [initialSegment, setInitialSegment] = useState<Option | null>(null);
  const [initialGroup, setInitialGroup] = useState<Option | null>(null);
  const [initialAlertQuantity, setInitialAlertQuantity] = useState<number | "">("");
  const [initialPosition, setInitialPosition] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");

  const isDirty = 
    productName !== initialProductName ||
    selectedMeasureUnity?.value !== initialMeasureUnity?.value ||
    manufacturer !== initialManufacturer ||
    selectedSegment?.value !== initialSegment?.value ||
    selectedGroup?.value !== initialGroup?.value ||
    alertQuantity !== initialAlertQuantity ||
    position !== initialPosition ||
    description !== initialDescription;

  const [manufacturerOptions, setManufacturerOptions] = useState<Option[]>([
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
  ]);

  const [segmentOptions, setSegmentOptions] = useState<Option[]>([]);
  const [groupOptions, setGroupOptions] = useState<Option[]>([]);
  const [measurementUnits, setMeasurementUnits] = useState<Option[]>([]);

  // Busca opções dinâmicas de segmento, grupo e unidade
  const { myUserEnterpriseId } = (typeof window !== "undefined" ? require("@/hooks/userHook") : { useUser: () => ({}) }).useUser?.() || {};
  
  useEffect(() => {
    let cancelled = false;
    const loadOptions = async () => {
      if (!myUserEnterpriseId) return;
      try {
        const { api } = require("@/utils/axios");
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
        const segments = segResp?.data?.segments || [];
        const groups = grpResp?.data?.groups || [];
        const units = unitResp?.data?.units || [];
        
        const segOpts = segments.map((s: any) => ({ 
          label: s.name ?? `Segmento (${s.id})`, 
          value: Number(s.id) 
        }));
        const grpOpts = groups.map((g: any) => ({ 
          label: g.name ?? `Grupo (${g.id})`, 
          value: Number(g.id) 
        }));
        const unitOpts = units.map((u: any) => ({ 
          label: u.name ?? `Unidade (${u.id})`, 
          value: Number(u.id) 
        }));
        
        if (!cancelled) {
          setSegmentOptions(segOpts);
          setGroupOptions(grpOpts);
          setMeasurementUnits(unitOpts);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = (err && typeof err === "object" && "message" in err) ? (err as any).message : "Erro ao carregar opções de segmento/grupo/unidade";
        }
      }
    };
    loadOptions();
    return () => {
      cancelled = true;
    };
  }, [myUserEnterpriseId]);

  // Função auxiliar para adicionar opção única
  const addUniqueOption = (
    options: Option[],
    setOptions: React.Dispatch<React.SetStateAction<Option[]>>,
    value: string | number,
    label?: string
  ) => {
    const optionLabel = label || String(value);
    const optionValue = typeof value === 'number' ? value : value;
    
    // Verifica se a opção já existe
    const exists = options.some(opt => {
      if (typeof opt.value === 'number' && typeof value === 'number') {
        return opt.value === value;
      }
      return String(opt.value).toLowerCase() === String(value).toLowerCase();
    });
    
    if (!exists) {
      const newOption: Option = { label: optionLabel, value: optionValue };
      setOptions(prev => [...prev, newOption]);
      return newOption;
    }
    
    // Retorna a opção existente
    return options.find(opt => {
      if (typeof opt.value === 'number' && typeof value === 'number') {
        return opt.value === value;
      }
      return String(opt.value).toLowerCase() === String(value).toLowerCase();
    }) || null;
  };

  // Utilitário para buscar o label da unidade de medida
  function getUnitLabel() {
    if (!item) return "";
    // Tenta pelo id
    let value = item.unit_id ?? item.unit;
    if (value && measurementUnits.length > 0) {
      const found = measurementUnits.find((opt) => String(opt.value) === String(value));
      if (found) return found.label;
    }
    // Tenta pelo nome
    if (item.unit_name) return item.unit_name;
    // Fallback
    return value ? String(value) : "Não informado";
  }

  const itemDetails = [
    { label: "Quantidade", value: item?.quantity?.toString() },
    { label: "Quantidade de alerta", value: item?.quantity_alert ?? item?.alertQuantity },
    { label: "Unidade de medida", value: getUnitLabel() },
    { label: "Posição", value: item?.position },
    { label: "Grupo", value: item?.group_name ?? item?.group },
    { label: "Segmento", value: item?.segment_name ?? item?.segment },
    { label: "Fabricante", value: item?.manufacturer },
    { label: "Data de criação", value: item?.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : "Não informado" },
  ];

  const topRowItems = itemDetails.slice(0, 4);
  const bottomRowItems = itemDetails.slice(4, 7);

  useEffect(() => {
    if (!isLoading && !item) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
  }, [isLoading, item]);

  // Sincroniza os campos quando o item é carregado
  useEffect(() => {
    if (item) {
      // Nome do produto
      if (item.name) {
        setProductName(item.name);
        setInitialProductName(item.name);
      }
      
      // Quantidade de alerta
      const alertQ = item.quantity_alert ?? item.alertQuantity;
      if (alertQ !== undefined) {
        setAlertQuantity(alertQ);
        setInitialAlertQuantity(alertQ);
      }
      
      // Posição
      if (item.position) {
        setPosition(item.position);
        setInitialPosition(item.position);
      }
      
      // Descrição
      if (item.description) {
        setDescription(item.description);
        setInitialDescription(item.description);
      }
      
      // Fabricante (campo simples)
      if (item.manufacturer) {
        setManufacturer(String(item.manufacturer));
        setInitialManufacturer(String(item.manufacturer));
      }
    }
  }, [item]);

  // Sincroniza os Autocompletes quando o item ou measurementUnits mudam
  useEffect(() => {
    if (!item) return;
    
    // Unidade de medida
    let unitValue = item.unit_id ?? item.unit;
    if (unitValue && measurementUnits.length > 0) {
      const unitOption = measurementUnits.find((opt: Option) => String(opt.value) === String(unitValue));
      setSelectedMeasureUnity(unitOption || null);
      setInitialMeasureUnity(unitOption || null);
    } else {
      setSelectedMeasureUnity(null);
      setInitialMeasureUnity(null);
    }
    
    // Segmento - usa função auxiliar para garantir unicidade
    if (item.segment_id || item.segment_name) {
      const segmentValue = item.segment_id ?? item.segment;
      const segmentLabel = item.segment_name || String(item.segment || item.segment_id);
      
      const segmentOption = addUniqueOption(
        segmentOptions,
        setSegmentOptions,
        segmentValue as number,
        segmentLabel
      );
      
      if (segmentOption) {
        setSelectedSegment(segmentOption);
        setInitialSegment(segmentOption);
      }
    } else {
      setSelectedSegment(null);
      setInitialSegment(null);
    }
    
    // Grupo - garantir que o grupo do item apareça nas opções e seja selecionado
    if (item.group_id || item.group_name) {
      const groupValue = item.group_id ?? item.group;
      const groupLabel = item.group_name || String(item.group || item.group_id);
      // Garante que o grupo do item está nas opções
      const groupOption = addUniqueOption(
        groupOptions,
        setGroupOptions,
        groupValue as number,
        groupLabel
      );
      if (groupOption) {
        setSelectedGroup(groupOption);
        setInitialGroup(groupOption);
      } else {
        setSelectedGroup(null);
        setInitialGroup(null);
      }
    } else {
      setSelectedGroup(null);
      setInitialGroup(null);
    }
  }, [item, measurementUnits, segmentOptions, groupOptions]);

  const handleUpdateItem = async () => {
    const nameError = validateProductName(productName);
    setProductErrors({ name: nameError });
    if (nameError) return;
    
    // CORREÇÃO: Usar os nomes de campo corretos que o backend espera
    const body = {
      name: productName,
      description: description,
      quantity_alert: alertQuantity === "" ? undefined : alertQuantity,
      position: position,
      unit_id: selectedMeasureUnity?.value,
      manufacturer: manufacturer,
      segment_id: selectedSegment?.value,
      group_id: selectedGroup?.value,
    };
    
    // Remove campos undefined ou null
    Object.keys(body).forEach(key => {
      if ((body as any)[key] === undefined || (body as any)[key] === null) {
        delete (body as any)[key];
      }
    });
    
    try {
      await updateItemMutation.mutateAsync(body);
      setOpenDrawer(false);
      showToast(`Item editado com sucesso`, "success", "Pencil");
      
      // Atualiza os valores iniciais
      setInitialProductName(productName);
      setInitialMeasureUnity(selectedMeasureUnity);
      setInitialManufacturer(manufacturer);
      setInitialSegment(selectedSegment);
      setInitialGroup(selectedGroup);
      setInitialAlertQuantity(alertQuantity);
      setInitialPosition(position);
      setInitialDescription(description);
    } catch (err: any) {
      showToast(`Erro ao editar item: ${err.message}`, "error", "TriangleAlert");
    }
  };

  const handleCloseDrawer = () => {
    // Reseta todos os campos para os valores originais do item
    if (item?.name) {
      setProductName(item.name);
    }
    setProductErrors({});
    
    // Reseta os Autocompletes para os valores originais
    if (item) {
      // Unidade de medida
      let unitValue = item.unit_id ?? item.unit;
      if (unitValue && measurementUnits.length > 0) {
        const unitOption = measurementUnits.find((opt: Option) => String(opt.value) === String(unitValue));
        setSelectedMeasureUnity(unitOption || null);
      } else {
        setSelectedMeasureUnity(null);
      }
      
      // Fabricante
      if (item.manufacturer) {
        setManufacturer(String(item.manufacturer));
      } else {
        setManufacturer("");
      }
      
      // Segmento
      if (item.segment_id || item.segment_name) {
        const segmentValue = item.segment_id ?? item.segment;
        const segmentOption = segmentOptions.find(opt => 
          String(opt.value) === String(segmentValue)
        ) || addUniqueOption(
          segmentOptions,
          setSegmentOptions,
          segmentValue as number,
          item.segment_name || String(item.segment || item.segment_id)
        );
        setSelectedSegment(segmentOption);
      } else {
        setSelectedSegment(null);
      }
      
      // Grupo
      if (item.group_id || item.group_name) {
        const groupValue = item.group_id ?? item.group;
        const groupOption = groupOptions.find(opt => 
          String(opt.value) === String(groupValue)
        ) || addUniqueOption(
          groupOptions,
          setGroupOptions,
          groupValue as number,
          item.group_name || String(item.group || item.group_id)
        );
        setSelectedGroup(groupOption);
      } else {
        setSelectedGroup(null);
      }
      
      // Reseta campos adicionais
      const alertQ = item.quantity_alert ?? item.alertQuantity;
      setAlertQuantity(alertQ !== undefined ? alertQ : "");
      setPosition(item.position ?? "");
      setDescription(item.description ?? "");
    }
    
    setOpenDrawer(false);
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
        {notFound ? (
          <NotFound description={`Nenhum item encontrado com o ID (${id})`} />
        ) : (
          <>
            <Card className="card" sx={{ overflow: "auto" }}>
              <Container className="header">
                <Box>
                  <Detail1 style={{ paddingBottom: "4px" }}>
                    Cód: {item?.id}
                  </Detail1>
                  <Body1 className="ellipsis">{item?.name}</Body1>
                </Box>
                <Container className="actions">
                  <Box className="dateInfo">
                    <Detail1 style={{ paddingBottom: "8px" }}>
                      Criado em
                    </Detail1>
                    <Subtitle2>
                      {item?.created_at
                        ? new Date(item.created_at).toLocaleDateString("pt-BR")
                        : "Data não disponível"}
                    </Subtitle2>
                  </Box>
                  <Container className="actionButtons">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Icon name="Pencil" />}
                      onClick={() => setOpenDrawer(true)}
                      disabled={item?.safe_delete}
                    >
                      Editar
                    </Button>
                    {item ? (item.safe_delete ? (
                      <IconButton
                        onClick={() => setOpenModalActive(true)}
                        tooltip="Ativar"
                        buttonProps={{ color: "success", variant: "outlined" }}
                        icon="SquareCheck"
                      />
                    ) : (
                      <IconButton
                        onClick={() => setOpenModalInactive(true)}
                        tooltip="Desativar"
                        buttonProps={{ color: "error", variant: "outlined" }}
                        icon="Trash"
                      />
                    )) : null}
                    <Dialog
                      open={openModalInactive}
                      onClose={() => setOpenModalInactive(false)}
                    >
                      <DialogTitle>
                        Tem certeza que deseja desativar o item?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Após desativar não será possível usar este item em
                          novas movimentações
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => setOpenModalInactive(false)}
                        >
                          Fechar
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              await toggleSafeDeleteMutation.mutateAsync(true);
                              setOpenModalInactive(false);
                              showToast("Item desativado com sucesso", "success", "Trash");
                            } catch (err: any) {
                              showToast(`Erro ao desativar item: ${err.message}`, "error", "TriangleAlert");
                            }
                          }}
                          startIcon={<Icon name="Trash" />}
                          variant="contained"
                          color="error"
                        >
                          Desativar item
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog
                      open={openModalActive}
                      onClose={() => setOpenModalActive(false)}
                    >
                      <DialogTitle>
                        Tem certeza que deseja ativar o item?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Após ativar será possível usar este item em novas
                          movimentações
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => setOpenModalActive(false)}
                        >
                          Fechar
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              await toggleSafeDeleteMutation.mutateAsync(false);
                              setOpenModalActive(false);
                              showToast("Item ativado com sucesso", "success", "Check");
                            } catch (err: any) {
                              showToast(`Erro ao ativar item: ${err.message}`, "error", "TriangleAlert");
                            }
                          }}
                          startIcon={<Icon name="Check" />}
                          variant="contained"
                          color="primary"
                        >
                          Ativar item
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Container>
                </Container>
              </Container>
              {item && (
                <Box className="status">
                  <Icon
                    name="Circle"
                    size={10}
                    color={
                      item.safe_delete ? "var(--neutral-50)" : "var(--success-10)"
                    }
                    fill={
                      item.safe_delete ? "var(--neutral-50)" : "var(--success-10)"
                    }
                  />
                  <Subtitle2>{item.safe_delete ? "Inativo" : "Ativo"}</Subtitle2>
                </Box>
              )}

              <Box
                className="mainContainer"
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                <Container className="contactInfo">
                  {topRowItems.map(({ label, value }) => (
                    <Box key={label} className="productField">
                      <Detail1>{label}</Detail1>
                      <CopyTooltip
                        title={
                          value !== undefined && value !== null
                            ? (typeof value === "object" && value !== null
                                ? (typeof value.name === "string" ? value.name : JSON.stringify(value))
                                : String(value))
                            : "Não informado"
                        }
                        placement={"bottom-start"}
                        arrow={false}
                      >
                        <Subtitle2
                          sx={{
                            color: value ? "inherit" : "var(--neutral-60)",
                          }}
                          className="ellipsis"
                        >
                          {typeof value === "object" && value !== null ? (typeof value.name === "string" ? value.name : JSON.stringify(value)) : value || "Não informado"}
                        </Subtitle2>
                      </CopyTooltip>
                    </Box>
                  ))}
                </Container>

                <Container className="contactInfo">
                  {bottomRowItems.map(({ label, value }) => (
                    <Box key={label} className="classificationField">
                      <Detail1>{label}</Detail1>
                      <CopyTooltip
                        title={
                          value !== undefined && value !== null
                            ? (typeof value === "object" && value !== null
                                ? (typeof value.name === "string" ? value.name : JSON.stringify(value))
                                : String(value))
                            : "Não informado"
                        }
                        placement={"bottom-start"}
                        arrow={false}
                      >
                        <Subtitle2
                          sx={{
                            color: value ? "inherit" : "var(--neutral-60)",
                          }}
                          className="ellipsis"
                        >
                          {typeof value === "object" && value !== null ? (typeof value.name === "string" ? value.name : JSON.stringify(value)) : value || "Não informado"}
                        </Subtitle2>
                      </CopyTooltip>
                    </Box>
                  ))}
                </Container>

                <Box className="description">
                  <Detail1>Descrição</Detail1>
                  <Subtitle2
                    sx={{
                      color: item?.description
                        ? "inherit"
                        : "var(--neutral-60)",
                    }}
                  >
                    {item?.description
                      ? item?.description
                      : "Não possui descrição"}
                  </Subtitle2>
                </Box>
              </Box>
            </Card>
            <Box className="historyContainer">
              <Box className="historyHeader">
                <Icon name="History" size={14} color="var(--neutral-60)" />
                <Detail4>Histórico de Movimentação</Detail4>
              </Box>
              <TableHistoryItems />
            </Box>
            <Box sx={{ height: "12px" }}>
              <p></p>
            </Box>
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={handleCloseDrawer}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "40px",
                }}
              >
                <Body1 sx={{ color: "var(--neutral-80)" }}>
                  Editar Produto
                </Body1>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateItem();
                  }}
                  className="formContainer"
                  style={{ gap: "32px" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "20px",
                      flexDirection: "column",
                    }}
                  >
                    <Detail1>Informações do Produto</Detail1>

                    <TextField
                      label="Nome do produto"
                      fullWidth
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      error={!!productErrors.name}
                      helperText={productErrors.name}
                      disabled={item?.safe_delete}
                      required
                    />
                    <TextField
                      value={alertQuantity}
                      onChange={(e) => setAlertQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                      label="Quantidade de alerta"
                      type="number"
                      fullWidth
                      disabled={item?.safe_delete}
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      label="Posição"
                      fullWidth
                      disabled={item?.safe_delete}
                    />
                    <Autocomplete
                      options={measurementUnits}
                      getOptionLabel={(option) => option.label}
                      value={selectedMeasureUnity}
                      onChange={(_, newValue) => setSelectedMeasureUnity(newValue)}
                      isOptionEqualToValue={(option, val) => option.value === val?.value}
                      disabled={item?.safe_delete}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Unidade de medida"
                          placeholder="Selecione..."
                          disabled={item?.safe_delete}
                        />
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "20px",
                      flexDirection: "column",
                    }}
                  >
                    <Detail1>Classificação</Detail1>

                    <TextField
                      label="Fabricante"
                      placeholder="Digite o fabricante..."
                      variant="outlined"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      fullWidth
                      disabled={item?.safe_delete}
                    />
                    <Autocomplete
                      options={segmentOptions}
                      getOptionLabel={(option) => option.label}
                      value={selectedSegment}
                      onChange={(_, newValue) => setSelectedSegment(newValue)}
                      isOptionEqualToValue={(option, val) => option.value === val?.value}
                      disabled={item?.safe_delete}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Segmento"
                          placeholder="Selecione..."
                          disabled={item?.safe_delete}
                        />
                      )}
                    />
                    <Autocomplete
                      options={groupOptions}
                      getOptionLabel={(option) => option.label}
                      value={selectedGroup}
                      onChange={(_, newValue) => setSelectedGroup(newValue)}
                      isOptionEqualToValue={(option, val) => option.value === val?.value}
                      disabled={item?.safe_delete}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Grupo"
                          placeholder="Selecione..."
                          disabled={item?.safe_delete}
                        />
                      )}
                    />
                    <TextField
                      multiline
                      rows={4}
                      label="Descrição"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Digite a descrição do produto aqui..."
                      disabled={item?.safe_delete}
                    />
                  </Box>
                  <Button 
                    variant="contained" 
                    type="submit" 
                    sx={{ mt: "8px" }}
                    disabled={!isDirty}
                  >
                    Confirmar
                  </Button>
                </form>
              </Box>
            </Drawer>
            <ToastContainer toasts={toasts} />
          </>
        )}
      </div>
    </div>
  );
}