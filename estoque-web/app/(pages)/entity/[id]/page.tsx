"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableHistoryEntity from "@/components/Entity/Tables/TableHistoryEntity";
import { RowDataEntity } from "@/components/Entity/Tables/TableListEntity";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Body1, Detail1, Detail4, Subtitle2 } from "@/components/ui/Typograph";
import { entityList } from "@/utils/entintyExampleList";
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
  Modal,
  Skeleton,
  TextField,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CopyTooltip from "@/components/ui/CopyTooltip";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("entidade");
  const [entity, setEntity] = useState<RowDataEntity | null>(null);
  const params = useParams();
  const id = params.id;
  const [openDrawer, setOpenDrawer] = useState(Boolean);
  const [notFound, setNotFound] = useState(Boolean);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

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
          <>
            <Card className="card">
              {/* Header */}
              <Container className="header">
                <Box>
                  <Skeleton width={60} height={14} sx={{ mb: 0.5 }} />{" "}
                  {/* Cód */}
                  <Skeleton width={180} height={20} /> {/* Nome */}
                </Box>

                <Container
                  className="actions"
                  sx={{ alignItems: "flex-start" }}
                >
                  <Box className="dateInfo">
                    <Skeleton width={80} height={14} sx={{ mb: 0.5 }} />{" "}
                    {/* "Criado em" */}
                    <Skeleton width={100} height={18} /> {/* Data */}
                  </Box>

                  <Container
                    className="actionButtons"
                    sx={{ display: "flex", gap: 1 }}
                  >
                    <Skeleton width={80} height={36} />
                    <Skeleton width={36} height={36} />
                  </Container>
                </Container>
              </Container>

              {/* Status */}
              <Box
                className="status"
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Skeleton variant="circular" width={10} height={10} />
                <Skeleton width={60} height={16} />
              </Box>

              {/* Contatos */}
              <Container className="contactInfo" sx={{ mt: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Box key={i} className="contactField" sx={{ mb: 1 }}>
                    <Skeleton width={70} height={14} sx={{ mb: 0.5 }} />
                    <Skeleton width="80%" height={18} />
                  </Box>
                ))}
              </Container>

              {/* Descrição */}
              <Box className="description" sx={{ mt: 2 }}>
                <Skeleton width={80} height={14} sx={{ mb: 0.5 }} />
                <Skeleton width="100%" height={60} />
              </Box>
            </Card>

            {/* Histórico de movimentação */}
            <Box className="historyContainer">
              <Box
                className="historyHeader"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Skeleton width={180} height={16} />
              </Box>

              {/* Skeleton para tabela */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  borderRadius: "8px",
                  p: 1.5,
                  maxHeight: "100%",
                  minHeight: "500px",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Skeleton width="30%" height={48} />
                    <Skeleton width="20%" height={48} />
                    <Skeleton width="25%" height={48} />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        ) : notFound ? (
          <Container>
            <Card>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/notFound.svg"
                  alt="Página não encontrada"
                  height={400}
                  width={400}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4px",
                    alignItems: "center",
                    position: "relative",
                    top: "-44px",
                  }}
                >
                  <Subtitle2 sx={{ color: "var(--neutral-70)" }}>
                    Nenhuma entidade encontrada com o ID ({id})
                  </Subtitle2>
                </Box>
              </Box>
            </Card>
          </Container>
        ) : (
          <>
            <Card className="card">
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
                    <Subtitle2>{entity?.createdAt}</Subtitle2>
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
                    <IconButton
                      onClick={() => setOpenModal(true)}
                      tooltip="Desativar"
                      buttonProps={{ color: "error", variant: "outlined" }}
                      icon="Trash"
                    />
                    <Dialog
                      open={openModal}
                      onClose={() => setOpenModal(false)}
                    >
                      <DialogTitle>
                        Tem certeza que deseja desativar a entidade?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Após desativar não haverá como selecionar a entidade
                          para novas movimentações, sendo necessário reativa-lá
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => setOpenModal(false)}
                        >
                          Fechar
                        </Button>
                        <Button
                          onClick={() => setOpenModal(false)}
                          startIcon={<Icon name="Trash" />}
                          variant="contained"
                          color="error"
                        >
                          Desativar entidade
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
                <Box
                  sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
                >
                  <TextField placeholder="Nome da entidade" />
                  <TextField placeholder="E-mail" />
                  <TextField placeholder="Telefone" />
                  <TextField placeholder="Endereço" />
                  <TextField
                    multiline
                    rows={8}
                    placeholder="Digite a nova descrição..."
                  />
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setOpenDrawer(false)}
                >
                  {" "}
                  Confirmar{" "}
                </Button>
              </Container>
            </Drawer>
          </>
        )}
      </div>
    </div>
  );
}
