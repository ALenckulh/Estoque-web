"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableHistoryEntity from "@/components/Entity/Tables/TableHistoryEntity";
import { RowDataEntity } from "@/components/Entity/Tables/TableListEntity";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Body1, Detail1, Detail4, Subtitle2 } from "@/components/ui/Typography";
import { entityList } from "@/utils/dataBaseExample";
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
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CopyTooltip from "@/components/ui/CopyTooltip";
import { NotFound } from "@/components/NotFound";
import { EntityIdLoading } from "@/components/Entity/Loading/EntityIdLoading";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useToast } from "@/hooks/toastHook";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("entidade");
  const [entity, setEntity] = useState<RowDataEntity | null>(null);
  const params = useParams();
  const id = params.id;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModalInactive, setOpenModalInactive] = useState(false);
  const [openModalActive, setOpenModalActive] = useState(false);
  const { toasts, showToast } = useToast();

  const contactList = [
    { label: "Telefone", value: entity?.telephone },
    { label: "E-mail", value: entity?.email },
    { label: "Endereço", value: entity?.address },
  ];

  useEffect(() => {
    if (id) {
      const found = entityList.find((entity) => {
        return String(entity.id) === String(id);
      });
      if (found) {
        setEntity(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
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
        {loading ? (
          <EntityIdLoading />
        ) : notFound ? (
          <NotFound
            description={`Nenhuma entidade encontrada com o ID (${id})`}
          />
        ) : (
          <>
            <Card className="card" sx={{ overflowY: "auto" }}>
              <Container className="header">
                <Box>
                  <Detail1 style={{ paddingBottom: "4px" }}>
                    Cód: {entity?.id}
                  </Detail1>
                  <Body1 className="ellipsis">{entity?.name}</Body1>
                </Box>
                <Container className="actions">
                  <Box className="dateInfo">
                    <Detail1 style={{ paddingBottom: "8px" }}>
                      Criado em
                    </Detail1>
                    <Subtitle2>
                      {entity?.createdAt
                        ? new Date(entity.createdAt).toLocaleDateString("pt-BR")
                        : ""}
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
                    {entity?.disabled ? (
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
                        Tem certeza que deseja desativar a entidade?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Após desativar não haverá como selecionar a entidade
                          para novas movimentações, sendo necessário reativá-la
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
                          Desativar entidade
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog
                      open={openModalActive}
                      onClose={() => setOpenModalActive(false)}
                    >
                      <DialogTitle>
                        Tem certeza que deseja ativar a entidade?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Após ativar será possível selecionar a entidade para
                          novas movimentações
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
                          Ativar entidade
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
                    entity?.disabled ? "var(--neutral-50)" : "var(--success-10)"
                  }
                  fill={
                    entity?.disabled ? "var(--neutral-50)" : "var(--success-10)"
                  }
                />
                <Subtitle2>{entity?.disabled ? "Inativo" : "Ativo"}</Subtitle2>
              </Box>
              <Container className="contactInfo">
                {contactList.map(({ label, value }) => (
                  <Box key={label} className="contactField">
                    <Detail1>{label}</Detail1>
                    <CopyTooltip
                      title={value || "Ausente"}
                      placement={"bottom-start"}
                      arrow={false}
                    >
                      <Subtitle2
                        sx={{
                          color: value ? "inherit" : "var(--neutral-60)",
                        }}
                        className="ellipsis"
                      >
                        {value || "Ausente"}
                      </Subtitle2>
                    </CopyTooltip>
                  </Box>
                ))}
              </Container>

              <Box className="description">
                <Detail1>Descrição</Detail1>
                <Subtitle2
                  sx={{
                    color: entity?.description
                      ? "inherit"
                      : "var(--neutral-60)",
                  }}
                >
                  {entity?.description
                    ? entity?.description
                    : "Não possui descrição"}
                </Subtitle2>
              </Box>
            </Card>
            <Box className="historyContainer">
              <Box className="historyHeader">
                <Icon name="History" size={14} color="var(--neutral-60)" />
                <Detail4>Histórico de Movimentação</Detail4>
              </Box>
              <TableHistoryEntity />
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
                }}
              >
                <Body1>Editar Entidade</Body1>
                <form className="formContainer">
                  <TextField
                    defaultValue={entity?.name}
                    placeholder="Nome da entidade"
                  />
                  <TextField
                    defaultValue={entity?.email}
                    placeholder="E-mail"
                  />
                  <TextField
                    defaultValue={entity?.telephone}
                    placeholder="Telefone"
                  />
                  <TextField
                    defaultValue={entity?.address}
                    placeholder="Endereço"
                  />
                  <TextField
                    multiline
                    rows={8}
                    defaultValue={entity?.description}
                    placeholder="Digite a nova descrição..."
                  />
                  <Button
                  variant="contained"
                  sx={{marginTop:"20px"}}
                  onClick={() => {
                    setOpenDrawer(false);
                    showToast(`Editado com sucesso`, "success", "Pencil");
                  }}
                >Confirmar</Button>
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
