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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CopyTooltip from "@/components/ui/CopyTooltip";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { Body1, Detail1, Detail4, Subtitle2 } from "@/components/ui/Typography";
import { NotFound } from "@/components/Feedback/NotFound";
import { useToast } from "@/hooks/toastHook";

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
          <NotFound
            description={`Nenhum item encontrado com o ID (${id})`}
          />
        ) : (
          <>
            <Card className="card" sx={{ overflowY: "auto" }}>
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
                          Após desativar não será possível usar este item em novas movimentações
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
                          Após ativar será possível usar este item em novas movimentações
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

              <Box className="mainContainer" sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: "0 16px" }}>
                
                <Container className="contactInfo" sx={{ display: 'flex', gap: 2, padding: "0 !important" }}>
                  {topRowItems.map(({ label, value }) => (
                    <Box 
                      key={label} 
                      className="contactField"
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        minWidth: '150px',
                        flex: '1'
                      }}
                    >
                      <Detail1>{label}</Detail1>
                      <CopyTooltip
                        title={value !== undefined && value !== null ? String(value) : "Não informado"}
                        placement={"bottom-start"}
                        arrow={false}
                      >
                        <Subtitle2
                          sx={{ color: value ? "inherit" : "var(--neutral-60)" }}
                          className="ellipsis"
                        >
                          {value || "Não informado"}
                        </Subtitle2>
                      </CopyTooltip>
                    </Box>
                  ))}
                </Container>

                <Container className="contactInfo" sx={{ display: 'flex', gap: 2, padding: "0 !important" }}>
                  {bottomRowItems.map(({ label, value }) => (
                    <Box 
                      key={label} 
                      className="contactField"
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        minWidth: '150px',
                        flex: '1'
                      }}
                    >
                      <Detail1>{label}</Detail1>
                      <CopyTooltip
                        title={value !== undefined && value !== null ? String(value) : "Não informado"}
                        placement={"bottom-start"}
                        arrow={false}
                      >
                        <Subtitle2
                          sx={{ color: value ? "inherit" : "var(--neutral-60)" }}
                          className="ellipsis"
                        >
                          {value || "Não informado"}
                        </Subtitle2>
                      </CopyTooltip>
                    </Box>
                  ))}
                  <Box sx={{ flex: '1' }}></Box>
                </Container>

              </Box>

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
              onClose={() => setOpenDrawer(false)}
            >
              <Container
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "40px",
                  padding: "20px",
                  width: "400px"
                }}
              >
                <Body1>Editar Produto</Body1>
                <Box sx={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                  <Box>
                    <Detail1 sx={{ fontWeight: "bold", marginBottom: "8px" }}>Produto</Detail1>
                    <Box sx={{ display: "flex", gap: "16px", flexDirection: "column" }}>
                      <TextField
                        defaultValue={item?.name}
                        label="Nome do produto"
                        fullWidth
                      />
                      <TextField
                        defaultValue={item?.alertQuantity}
                        label="Quantidade de alerta"
                        type="number"
                        fullWidth
                      />
                      <TextField
                        defaultValue={item?.position}
                        label="Posição"
                        fullWidth
                      />
                      <FormControl fullWidth>
                        <InputLabel>Unidade de medida</InputLabel>
                        <Select
                          label="Unidade de medida"
                          defaultValue={item?.unit || "unidade"}
                        >
                          <MenuItem value="unidade">Unidade</MenuItem>
                          <MenuItem value="kg">Kilograma</MenuItem>
                          <MenuItem value="g">Grama</MenuItem>
                          <MenuItem value="litro">Litro</MenuItem>
                          <MenuItem value="ml">Mililitro</MenuItem>
                          <MenuItem value="caixa">Caixa</MenuItem>
                          <MenuItem value="pacote">Pacote</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  <Box>
                    <Detail1 sx={{ fontWeight: "bold", marginBottom: "8px" }}>Classificação</Detail1>
                    <Box sx={{ display: "flex", gap: "16px", flexDirection: "column" }}>
                      <FormControl fullWidth>
                        <InputLabel>Fabricante</InputLabel>
                        <Select
                          label="Fabricante"
                          defaultValue={item?.manufacturer || ""}
                        >
                          <MenuItem value="fabricante1">Fabricante 1</MenuItem>
                          <MenuItem value="fabricante2">Fabricante 2</MenuItem>
                          <MenuItem value="fabricante3">Fabricante 3</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Segmento</InputLabel>
                        <Select
                          label="Segmento"
                          defaultValue={item?.segment || ""}
                        >
                          <MenuItem value="segmento1">Segmento 1</MenuItem>
                          <MenuItem value="segmento2">Segmento 2</MenuItem>
                          <MenuItem value="segmento3">Segmento 3</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Grupo</InputLabel>
                        <Select
                          label="Grupo"
                          defaultValue={item?.group|| ""}
                        >
                          <MenuItem value="grupo1">Grupo 1</MenuItem>
                          <MenuItem value="grupo2">Grupo 2</MenuItem>
                          <MenuItem value="grupo3">Grupo 3</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        multiline
                        rows={4}
                        label="Descrição"
                        defaultValue={item?.description}
                        placeholder="Digite a descrição do produto aqui..."
                      />
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenDrawer(false);
                    showToast(`Item editado com sucesso`, "success", "Pencil");
                  }}
                >
                  Confirmar
                </Button>
              </Container>
            </Drawer>
            <ToastContainer toasts={toasts} />
          </>
        )}
      </div>
    </div>
  );
}