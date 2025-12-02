"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableHistoryEntity from "@/components/Entity/Tables/TableHistoryEntity";
import { RowDataEntity } from "@/components/Entity/Tables/TableListEntity";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Body1, Detail1, Detail4, Subtitle2 } from "@/components/ui/Typography";
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
import { NotFound } from "@/components/Feedback/NotFound";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useToast } from "@/hooks/toastHook";
import { validateEntityName } from "@/utils/validations";
import { api } from "@/utils/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("entidade");
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalInactive, setOpenModalInactive] = useState(false);
  const [openModalActive, setOpenModalActive] = useState(false);
  const { toasts, showToast } = useToast();

  // Buscar entidade via API
  const { data: entity, isLoading, isError } = useQuery({
    queryKey: ["entity", id],
    queryFn: async () => {
      const resp = await api.get(`/entity/${id}`);
      return resp?.data?.entity;
    },
    enabled: !!id,
  });
  const [editEntityName, setEditEntityName] = useState("");
  const [editErrors, setEditErrors] = useState<{ name?: string }>({});
  const [editEmail, setEditEmail] = useState("");
  const [editTelephone, setEditTelephone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [initialName, setInitialName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [initialTelephone, setInitialTelephone] = useState("");
  const [initialAddress, setInitialAddress] = useState("");
  const [initialDescription, setInitialDescription] = useState("");

  const handleToggleSafeDelete = async () => {
    try {
      if (!id) {
        showToast("Nenhuma entidade selecionada", "error", "X");
        setOpenModalInactive(false);
        setOpenModalActive(false);
        return;
      }

      const res = await api.patch(`/entity/${id}`);

      if (res?.data?.success) {
        queryClient.invalidateQueries({ queryKey: ["entity", id] });
        queryClient.invalidateQueries({ queryKey: ["entities"] });
        const successMsg = entity?.safe_delete
          ? "Entidade ativada com sucesso"
          : "Entidade desativada com sucesso";
        showToast(successMsg, "success", entity?.safe_delete ? "Check" : "Trash");
      } else {
        showToast(res?.data?.message || "Erro ao atualizar entidade", "error", "X");
      }
    } catch (err: any) {
      showToast(err?.message || "Erro ao atualizar entidade", "error", "X");
    } finally {
      setOpenModalInactive(false);
      setOpenModalActive(false);
    }
  };

  const handleSubmitEditEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateEntityName(editEntityName);
    setEditErrors({ name: nameError });
    if (nameError) return;

    if (!id) {
      showToast("Nenhuma entidade selecionada", "error", "X");
      return;
    }

    try {
      const payload: any = {
        name: editEntityName,
        email: editEmail || undefined,
        phone: editTelephone || undefined,
        address: editAddress || undefined,
        description: editDescription || undefined,
      };

      const res = await api.put(`/entity/${id}`, payload);

      if (res?.data?.success) {
        showToast(`Entidade ${editEntityName} editada com sucesso!`, "success", "Pencil");
        queryClient.invalidateQueries({ queryKey: ["entity", id] });
        queryClient.invalidateQueries({ queryKey: ["entities"] });
        setOpenDrawer(false);
      } else {
        showToast(res?.data?.message || "Erro ao atualizar entidade", "error", "X");
      }
    } catch (err: any) {
      showToast(err?.message || "Erro ao atualizar entidade", "error", "X");
    }
  };

  const handleCloseDrawer = () => {
    setEditEntityName(initialName);
    setEditEmail(initialEmail);
    setEditTelephone(initialTelephone);
    setEditAddress(initialAddress);
    setEditDescription(initialDescription);
    setEditErrors({});
    setOpenDrawer(false);
  };

  const contactList = [
    { label: "Telefone", value: entity?.phone },
    { label: "E-mail", value: entity?.email },
    { label: "Endereço", value: entity?.address },
  ];

  useEffect(() => {
    if (entity) {
      // sincroniza campos controlados
      const name = entity.name || "";
      const email = entity.email || "";
      const telephone = entity.phone || "";
      const address = entity.address || "";
      const description = entity.description || "";

      setEditEntityName(name);
      setEditEmail(email);
      setEditTelephone(telephone);
      setEditAddress(address);
      setEditDescription(description);

      // define baseline inicial
      setInitialName(name);
      setInitialEmail(email);
      setInitialTelephone(telephone);
      setInitialAddress(address);
      setInitialDescription(description);
    }
  }, [entity]);

  const isDirty =
    editEntityName !== initialName ||
    editEmail !== initialEmail ||
    editTelephone !== initialTelephone ||
    editAddress !== initialAddress ||
    editDescription !== initialDescription;

  return (
    <div>
      <Appbar
        showTabs={true}
        showAvatar={true}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="container">
        {isError ? (
          <NotFound
            description={`Nenhuma entidade encontrada com o ID (${id})`}
          />
        ) : (
          <>
            <Card className="card" sx={{ overflow: "auto" }}>
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
                    {entity ? (entity.safe_delete ? (
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
                      open={openModalInactive || openModalActive}
                      onClose={() => {
                        setOpenModalInactive(false);
                        setOpenModalActive(false);
                      }}
                    >
                      <DialogTitle>
                        {entity?.safe_delete
                          ? "Tem certeza que deseja ativar a entidade?"
                          : "Tem certeza que deseja desativar a entidade?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {entity?.safe_delete
                            ? "Após ativar será possível selecionar a entidade para novas movimentações"
                            : "Após desativar não haverá como selecionar a entidade para novas movimentações, sendo necessário reativá-la"}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => {
                            setOpenModalInactive(false);
                            setOpenModalActive(false);
                          }}
                        >
                          Fechar
                        </Button>
                        <Button
                          startIcon={<Icon name={entity?.safe_delete ? "Check" : "Trash"} />}
                          variant="contained"
                          color={entity?.safe_delete ? "primary" : "error"}
                          onClick={handleToggleSafeDelete}
                        >
                          {entity?.safe_delete ? "Ativar entidade" : "Desativar entidade"}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Container>
                </Container>
              </Container>
              {entity && (
                <Box className="status">
                  <Icon
                    name="Circle"
                    size={10}
                    color={
                      entity.disabled ? "var(--neutral-50)" : "var(--success-10)"
                    }
                    fill={
                      entity.disabled ? "var(--neutral-50)" : "var(--success-10)"
                    }
                  />
                  <Subtitle2>{entity.disabled ? "Inativo" : "Ativo"}</Subtitle2>
                </Box>
              )}
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
              onClose={handleCloseDrawer}
            >
              <Container
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "40px",
                }}
              >
                <Body1>Editar Entidade</Body1>
                <form className="formContainer" onSubmit={handleSubmitEditEntity}>
                  <TextField
                    label="Nome da entidade"
                    value={editEntityName}
                    onChange={(e) => {
                      setEditEntityName(e.target.value);
                    }}
                    error={!!editErrors.name}
                    helperText={editErrors.name}
                    placeholder="Nome da entidade"
                  />
                  <TextField
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="E-mail"
                  />
                  <TextField
                    value={editTelephone}
                    onChange={(e) => setEditTelephone(e.target.value)}
                    placeholder="Telefone"
                  />
                  <TextField
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Endereço"
                  />
                  <TextField
                    multiline
                    rows={8}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Digite a nova descrição..."
                  />
                  <Button
                    variant="contained"
                    sx={{ marginTop: "20px" }}
                    type="submit"
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
