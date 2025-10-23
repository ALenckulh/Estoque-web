"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { PasswordField } from "@/components/ui/PasswordField";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { Body1, Body4, Subtitle2 } from "@/components/ui/Typography";
import { useToast } from "@/hooks/toastHook";
import { useUser } from "@/hooks/userHook";
import { usersList } from "@/utils/dataBaseExample";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TableListUsers, {
  type DataUser,
} from "@/components/Users/Tables/TableListUsers";

const DRAWER_CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "40px",
};

const FORM_FIELDS_CONTAINER_STYLE = {
  display: "flex",
  gap: "20px",
  flexDirection: "column" as const,
};

const PASSWORD_SECTION_STYLE = {
  border: "1px solid var(--primary-0)",
  borderRadius: "4px",
  padding: "20px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "20px",
};

const PASSWORD_SECTION_HEADER_STYLE = {
  display: "flex",
  flexDirection: "row" as const,
  gap: "8px",
  alignItems: "center",
  justifyContent: "space-between",
};

const ADMIN_CHECKBOX_CONTAINER_STYLE = {
  display: "flex",
  gap: "10px",
  flexDirection: "row" as const,
  alignItems: "center",
  justifyContent: "space-between",
};

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] =
    useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [userEdit, setUserEdit] = useState<DataUser | null>(null);

  const { toasts, showToast } = useToast();
  const {
    findUserId,
    setFindUserId,
    myUserId,
    setMyUserId,
    setOpenModalActive,
    setOpenModalInactive,
    OpenModalActive,
    OpenModalInactive,
  } = useUser();

  useEffect(() => {
    if (findUserId) {
      const foundUser = usersList.find((user) => user.id === findUserId);
      if (foundUser) {
        setUserEdit(foundUser);
      }
      setIsEditDrawerOpen(true);
    }
  }, [findUserId]);

  useEffect(() => {
    if (typeof setMyUserId === "function") {
      setMyUserId("8");
    }
  }, [myUserId, setMyUserId]);

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setFindUserId(null);
    setIsPasswordSectionVisible(false);
  };

  const handleConfirmCreateUser = () => {
    setIsCreateDrawerOpen(false);
    showToast(`Usuário ${newUsername} criado com sucesso!`, "success");
  };

  const handleConfirmUpdateUser = () => {
    setIsEditDrawerOpen(false);
    showToast(`Usuário ${updatedUsername} editado com sucesso!`, "success");
    setFindUserId(null);
    setIsPasswordSectionVisible(false);
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Body4 sx={{ color: "var(--neutral-60)" }}>Meus usuários</Body4>
          <Button
            variant="contained"
            startIcon={<Icon name="Plus" />}
            onClick={() => setIsCreateDrawerOpen(true)}
          >
            Criar usuário
          </Button>
        </Box>

        <TableListUsers />

        <ToastContainer toasts={toasts} />

        <Dialog
          open={OpenModalInactive}
          onClose={() => setOpenModalInactive(false)}
        >
          <DialogTitle>Tem certeza que deseja desativar o usuário?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Após desativar o usuário não haverá como acessar o sistema, sendo
              necessário reativá-lo
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
              Desativar usuário
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={OpenModalActive}
          onClose={() => setOpenModalActive(false)}
        >
          <DialogTitle>Tem certeza que deseja ativar o usuário?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Após ativar este usuário poderá voltar a acessar o sistema
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
              Ativar usuário
            </Button>
          </DialogActions>
        </Dialog>

        {/* Drawer para criar usuário */}
        <Drawer
          anchor="right"
          open={isCreateDrawerOpen}
          onClose={() => setIsCreateDrawerOpen(false)}
        >
          <Container style={DRAWER_CONTAINER_STYLE}>
            <Body1>Criar usuário</Body1>
            <FormGroup sx={FORM_FIELDS_CONTAINER_STYLE}>
              <TextField
                label="Usuário"
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <TextField label="E-mail" />
              <PasswordField value={""} onChange={() => {}} />
              <PasswordField
                label="Confirmar senha"
                value={""}
                onChange={() => {}}
              />
              <Button variant="contained" onClick={handleConfirmCreateUser}>
                Confirmar
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Divider
                  sx={{ flexGrow: 1, borderColor: "var(--neutral-30)" }}
                />
                <Subtitle2
                  sx={{
                    marginX: 1,
                    color: "var(--neutral-70)",
                  }}
                >
                  ou
                </Subtitle2>
                <Divider
                  sx={{ flexGrow: 1, borderColor: "var(--neutral-30)" }}
                />
              </Box>

              <Button
                color="secondary"
                sx={{
                  "& .MuiButton-startIcon": {
                    marginRight: "12px", // ajuste a distância aqui
                  },
                }}
                variant="outlined"
                startIcon={
                  <img
                    src="/icons/googleIcon.svg"
                    alt="Google Icon"
                    height={20}
                    width={20}
                  />
                }
                onClick={handleConfirmCreateUser}
              >
                Criar com o Google
              </Button>
            </FormGroup>
          </Container>
        </Drawer>

        {/* Drawer para editar usuário */}
        <Drawer
          anchor="right"
          open={isEditDrawerOpen}
          onClose={handleCloseEditDrawer}
        >
          <Container style={DRAWER_CONTAINER_STYLE}>
            <Body1>
              {myUserId === userEdit?.id
                ? "Editar usuário atual"
                : "Editar usuário"}
            </Body1>

            <FormGroup sx={FORM_FIELDS_CONTAINER_STYLE}>
              <TextField
                label="Usuário"
                onChange={(e) => setUpdatedUsername(e.target.value)}
                defaultValue={userEdit?.user}
              />

              <Box sx={ADMIN_CHECKBOX_CONTAINER_STYLE}>
                <FormControlLabel
                  label="Permitir ações de administrador"
                  control={
                    <Checkbox defaultChecked={userEdit?.is_admin || false} />
                  }
                />
                <Tooltip
                  arrow
                  title="Permite gerenciar adicionar, editar e deletar todos os usuários, exceto a conta criadora do estoque."
                >
                  <Icon name="Info" color="var(--neutral-50)" />
                </Tooltip>
              </Box>

              {!isPasswordSectionVisible && (
                <motion.div
                  key="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    startIcon={<Icon name="Lock" />}
                    variant="outlined"
                    onClick={() => setIsPasswordSectionVisible(true)}
                    sx={{ width: "100%" }}
                  >
                    Mudar senha
                  </Button>
                </motion.div>
              )}

              {isPasswordSectionVisible && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ overflow: "hidden" }}
                >
                  <Box sx={PASSWORD_SECTION_STYLE}>
                    <Box sx={PASSWORD_SECTION_HEADER_STYLE}>
                      <Body4 sx={{ color: "var(--neutral-70)" }}>
                        Mudar senha
                      </Body4>
                      <IconButton
                        buttonProps={{ variant: "text" }}
                        onClick={() => setIsPasswordSectionVisible(false)}
                        tooltip="Fechar"
                        icon="X"
                      />
                    </Box>

                    <Box sx={FORM_FIELDS_CONTAINER_STYLE}>
                      <PasswordField
                        label="Senha anterior"
                        value={""}
                        onChange={() => {}}
                      />
                      <PasswordField
                        label="Senha nova"
                        value={""}
                        onChange={() => {}}
                      />
                      <PasswordField
                        label="Confirmar senha nova"
                        value={""}
                        onChange={() => {}}
                      />
                      <Link
                        style={{
                          fontSize: "16px",
                          color: "var(--primary-10)",
                        }}
                        href="#"
                      >
                        Esqueci minha senha?
                      </Link>
                    </Box>
                  </Box>
                </motion.div>
              )}
              <Button variant="contained" onClick={handleConfirmUpdateUser}>
                Atualizar
              </Button>
            </FormGroup>
          </Container>
        </Drawer>
      </div>
    </div>
  );
}
