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
  const [item, setItem] = useState<RowDataItem | null>(null);
  const params = useParams();
  const id = params.id;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [openModalInactive, setOpenModalInactive] = useState(false);
  const [openModalActive, setOpenModalActive] = useState(false);
  const { toasts, showToast } = useToast();
  const [productName, setProductName] = useState<string>("");
  const [productErrors, setProductErrors] = useState<{ name?: string }>({});
  const [selectedMeasureUnity, setSelectedMeasureUnity] = useState<Option | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Option | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<Option | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  const [alertQuantity, setAlertQuantity] = useState<number | "">("");
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [initialProductName, setInitialProductName] = useState<string>("");
  const [initialMeasureUnity, setInitialMeasureUnity] = useState<Option | null>(null);
  const [initialManufacturer, setInitialManufacturer] = useState<Option | null>(null);
  const [initialSegment, setInitialSegment] = useState<Option | null>(null);
  const [initialGroup, setInitialGroup] = useState<Option | null>(null);
  const [initialAlertQuantity, setInitialAlertQuantity] = useState<number | "">("");
  const [initialPosition, setInitialPosition] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");

  const isDirty = 
    productName !== initialProductName ||
    selectedMeasureUnity?.value !== initialMeasureUnity?.value ||
    selectedManufacturer?.value !== initialManufacturer?.value ||
    selectedSegment?.value !== initialSegment?.value ||
    selectedGroup?.value !== initialGroup?.value ||
    alertQuantity !== initialAlertQuantity ||
    position !== initialPosition ||
    description !== initialDescription;
    alertQuantity !== initialAlertQuantity ||
    position !== initialPosition ||
    description !== initialDescription;

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

  const [segmentOptions, setSegmentOptions] = useState<Option[]>([
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
  ]);

  const [groupOptions, setGroupOptions] = useState<Option[]>([
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
  ]);

  // Array de detalhes reordenado para corresponder à imagem
  const itemDetails = [
    { label: "Quantidade", value: item?.quantity?.toString() },
    { label: "Quantidade de alerta", value: item?.alertQuantity },
    { label: "Unidade de medida", value: item?.unit },
    { label: "Posição", value: item?.position },
    { label: "Grupo", value: item?.group },
    { label: "Segmento", value: item?.segment },
    { label: "Fabricante", value: item?.manufacturer },
  ];

  const topRowItems = itemDetails.slice(0, 4);
  const bottomRowItems = itemDetails.slice(4, 7);

  useEffect(() => {
    if (id) {
      const found = itemList.find((item) => {
        return String(item.id) === String(id);
      });
      if (found) {
        setItem(found);
      } else {
        setNotFound(true);
      }
    }
  }, [id]);

  // Sincroniza o nome do produto quando o item é carregado
  useEffect(() => {
    if (item?.name) {
      setProductName(item.name);
      setInitialProductName(item.name);
    }
    if (item?.alertQuantity !== undefined) {
      setAlertQuantity(item.alertQuantity);
      setInitialAlertQuantity(item.alertQuantity);
    }
    if (item?.position) {
      setPosition(item.position);
      setInitialPosition(item.position);
    }
    if (item?.description) {
      setDescription(item.description);
      setInitialDescription(item.description);
    }
  }, [item?.name, item?.alertQuantity, item?.position, item?.description]);

  // Sincroniza os Autocompletes quando o item é carregado
  useEffect(() => {
    if (item) {
      // Unidade de medida
      if (item.unit) {
        const unitOption = measurementUnits.find((opt: Option): boolean => opt.value === item.unit);
        setSelectedMeasureUnity(unitOption || null);
        setInitialMeasureUnity(unitOption || null);
      }
      // Fabricante - adiciona opção se não existir
      if (item.manufacturer) {
        let manuOption = manufacturerOptions.find((opt: Option): boolean => opt.value === item.manufacturer);
        if (!manuOption) {
          manuOption = { label: String(item.manufacturer), value: item.manufacturer };
          setManufacturerOptions(prev => prev.some((opt: Option): boolean => opt.value === manuOption!.value) ? prev : [...prev, manuOption!]);
        }
        setSelectedManufacturer(manuOption || { label: String(item.manufacturer), value: item.manufacturer });
        setInitialManufacturer(manuOption || { label: String(item.manufacturer), value: item.manufacturer });
      }
      // Segmento - adiciona opção se não existir
      if (item.segment) {
        let segOption = segmentOptions.find((opt: Option): boolean => opt.value === item.segment);
        if (!segOption) {
          segOption = { label: String(item.segment), value: item.segment };
          setSegmentOptions(prev => prev.some((opt: Option): boolean => opt.value === segOption!.value) ? prev : [...prev, segOption!]);
        }
        setSelectedSegment(segOption || { label: String(item.segment), value: item.segment });
        setInitialSegment(segOption || { label: String(item.segment), value: item.segment });
      }
      // Grupo - adiciona opção se não existir
      if (item.group) {
        let grpOption = groupOptions.find((opt: Option): boolean => opt.value === item.group);
        if (!grpOption) {
          grpOption = { label: String(item.group), value: item.group };
          setGroupOptions(prev => prev.some((opt: Option): boolean => opt.value === grpOption!.value) ? prev : [...prev, grpOption!]);
        }
        setSelectedGroup(grpOption || { label: String(item.group), value: item.group });
        setInitialGroup(grpOption || { label: String(item.group), value: item.group });
      }
    }
  }, [item]);

  const handleUpdateItem = () => {
    const nameError = validateProductName(productName);
    setProductErrors({ name: nameError });
    if (nameError) return;

    setOpenDrawer(false);
    showToast(`Item editado com sucesso`, "success", "Pencil");
    // TODO: enviar atualização para API quando disponível
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
      if (item.unit) {
        const unitOption = measurementUnits.find(opt => opt.value === item.unit);
        setSelectedMeasureUnity(unitOption || null);
      } else {
        setSelectedMeasureUnity(null);
      }
      
      // Fabricante
      if (item.manufacturer) {
        let manuOption = manufacturerOptions.find(opt => opt.value === item.manufacturer);
        if (!manuOption) {
          const newOpt = { label: String(item.manufacturer), value: item.manufacturer };
          setManufacturerOptions(prev => prev.some(opt => opt.value === newOpt.value) ? prev : [...prev, newOpt]);
          manuOption = newOpt;
        }
        setSelectedManufacturer(manuOption);
      } else {
        setSelectedManufacturer(null);
      }
      
      // Segmento
      if (item.segment) {
        let segOption = segmentOptions.find(opt => opt.value === item.segment);
        if (!segOption) {
          const newOpt = { label: String(item.segment), value: item.segment };
          setSegmentOptions(prev => prev.some(opt => opt.value === newOpt.value) ? prev : [...prev, newOpt]);
          segOption = newOpt;
        }
        setSelectedSegment(segOption);
      } else {
        setSelectedSegment(null);
      }
      
      // Grupo
      if (item.group) {
        let grpOption = groupOptions.find(opt => opt.value === item.group);
        if (!grpOption) {
          const newOpt = { label: String(item.group), value: item.group };
          setGroupOptions(prev => prev.some(opt => opt.value === newOpt.value) ? prev : [...prev, newOpt]);
          grpOption = newOpt;
        }
        setSelectedGroup(grpOption);
      } else {
        setSelectedGroup(null);
      }
      
      // Reseta campos adicionais
      setAlertQuantity(item.alertQuantity ?? "");
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
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("pt-BR")
                        : "Data não disponível"}
                    </Subtitle2>
                  </Box>
                  <Container className="actionButtons">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Icon name="Pencil" />}
                      onClick={() => setOpenDrawer(true)}
                    >
                      Editar
                    </Button>
                    {item?.disabled ? (
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
                    )}
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
                          onClick={() => setOpenModalInactive(false)}
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
                          onClick={() => setOpenModalActive(false)}
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
              <Box className="status">
                <Icon
                  name="Circle"
                  size={10}
                  color={
                    item?.disabled ? "var(--neutral-50)" : "var(--success-10)"
                  }
                  fill={
                    item?.disabled ? "var(--neutral-50)" : "var(--success-10)"
                  }
                />
                <Subtitle2>{item?.disabled ? "Inativo" : "Ativo"}</Subtitle2>
              </Box>

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
                            ? String(value)
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
                          {value || "Não informado"}
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
                            ? String(value)
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
                          {value || "Não informado"}
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
              <Container
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
                    <Detail1>Produto</Detail1>

                    <TextField
                      label="Nome do produto"
                      fullWidth
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      error={!!productErrors.name}
                      helperText={productErrors.name}
                    />
                    <TextField
                      value={alertQuantity}
                      onChange={(e) => setAlertQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                      label="Quantidade de alerta"
                      type="number"
                      fullWidth
                    />
                    <TextField
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      label="Posição"
                      fullWidth
                    />
                    <Autocomplete
                      options={measurementUnits}
                      getOptionLabel={(option) => option.label}
                      value={selectedMeasureUnity}
                      onChange={(_, newValue) => setSelectedMeasureUnity(newValue)}
                      isOptionEqualToValue={(option, val) => option.value === val?.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Unidade de medida"
                          placeholder="Selecione..."
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

                    <Autocomplete
                      options={manufacturerOptions}
                      getOptionLabel={(option) => option.label}
                      value={selectedManufacturer}
                      onChange={(_, newValue) => setSelectedManufacturer(newValue)}
                      isOptionEqualToValue={(option, val) => option.value === val?.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Fabricante"
                          placeholder="Selecione..."
                        />
                      )}
                    />
                    <Autocomplete
                      options={segmentOptions}
                      getOptionLabel={(option) => option.label}
                      value={selectedSegment}
                      onChange={(_, newValue) => setSelectedSegment(newValue)}
                      isOptionEqualToValue={(option, val) => option.value === val?.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Segmento"
                          placeholder="Selecione..."
                        />
                      )}
                    />
                    <Autocomplete
                      options={groupOptions}
                      getOptionLabel={(option) => option.label}
                      value={selectedGroup}
                      onChange={(_, newValue) => setSelectedGroup(newValue)}
                      isOptionEqualToValue={(option, val) => option.value === val?.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Grupo"
                          placeholder="Selecione..."
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
              </Container>
            </Drawer>
            <ToastContainer toasts={toasts} />
          </>
        )}
      </div>
    </div>
  );
}
