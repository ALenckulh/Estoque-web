"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { PasswordField } from "@/components/ui/PasswordField";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { Body1, Body4 } from "@/components/ui/Typography";
import TableListUsers, {
  DataUSer,
} from "@/components/Users/Tables/TableListUsers";
import { useToast } from "@/hooks/toastHook";
import { useUser } from "@/hooks/userHook";
import { usersList } from "@/utils/dataBaseExample";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Drawer,
  FormControlLabel,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("");
  const [changeSection, setChangeSection] = useState(1);
  const [showSection, setShowSection] = useState(false);
  const [openDrawerCreate, setOpenDrawerCreate] = useState(false);
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
  const [createdUsername, setCreatedUsername] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const [userEdit, setUserEdit] = useState<DataUSer | null>(null);
  const { toasts, showToast } = useToast();
  const { findUserId, setFindUserId } = useUser();

  useEffect(() => {
    if (findUserId) {
      const foundUser = usersList.find((user) => user.id === findUserId);
      if (foundUser) {
        setUserEdit(foundUser);
      }
      setOpenDrawerEdit(true);
    }
    console.log("findUserId changed: " + findUserId);
  }, [findUserId]);

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
            startIcon={<Icon name="Plus"></Icon>}
            onClick={() => setOpenDrawerCreate(true)}
          >
            Criar usuário
          </Button>
        </Box>
        <TableListUsers />
        <Box sx={{ height: "12px" }}>
          <p></p>
        </Box>
        <ToastContainer toasts={toasts} />
        {/* Drawer for creating a user */}
        <Drawer
          anchor="right"
          open={openDrawerCreate}
          onClose={() => setOpenDrawerCreate(false)}
        >
          <Container
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            <Body1>Criar usuário</Body1>
            <Box sx={{ display: "flex", gap: "20px", flexDirection: "column" }}>
              <TextField
                label="Usuário"
                onChange={(e) => setCreatedUsername(e.target.value)}
              />
              <TextField label="E-mail" />
              <PasswordField value={""} onChange={() => {}} />
              <PasswordField
                label="Confirmar senha"
                value={""}
                onChange={() => {}}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDrawerCreate(false);
                showToast(
                  `Usuário ${createdUsername} criado com sucesso!`,
                  "success"
                );
              }}
            >
              Confirmar
            </Button>
          </Container>
        </Drawer>
        {/* Drawer for editing a user */}
        <Drawer
          anchor="right"
          open={openDrawerEdit}
          onClose={() => {
            setOpenDrawerEdit(false);
            setFindUserId(null);
          }}
        >
          {changeSection === 1 && (
            <Container
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              <Body1>Editar usuário</Body1>
              <FormGroup
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <TextField
                  label="Usuário"
                  onChange={(e) => setEditedUsername(e.target.value)}
                  defaultValue={userEdit?.user}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FormControlLabel
                    label="Permitir ações de administrador"
                    control={
                      <Checkbox defaultChecked={userEdit?.is_admin || false} />
                    }
                  ></FormControlLabel>
                  <Tooltip
                    arrow
                    title="Permite gerenciar adicionar, editar e deletar todos os usuários, exceto a conta criadora do estoque."
                  >
                    <Icon name={"Info"} color={"var(--neutral-50)"} />
                  </Tooltip>
                </Box>
                {!showSection && (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      startIcon={<Icon name="Lock" />}
                      variant="outlined"
                      onClick={() => setShowSection(true)}
                      sx={{ width: "100%" }}
                    >
                      Mudar senha
                    </Button>
                  </motion.div>
                )}

                {showSection && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ overflow: "hidden" }}
                  >
                    <Box
                      sx={{
                        border: "1px solid var(--primary-0)",
                        borderRadius: "4px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "8px",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Body4 sx={{ color: "var(--neutral-70)" }}>
                          Mudar senha
                        </Body4>
                        <IconButton
                          buttonProps={{ variant: "text" }}
                          onClick={() => setShowSection(false)}
                          tooltip="Fechar"
                          icon={"X"}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "20px",
                          flexDirection: "column",
                        }}
                      >
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
              </FormGroup>

              <Button
                variant="contained"
                onClick={() => {
                  setOpenDrawerEdit(false);
                  showToast(
                    `Usuário ${editedUsername} editado com sucesso!`,
                    "success"
                  );
                  setFindUserId(null);
                }}
              >
                Atualizar
              </Button>
            </Container>
          )}
        </Drawer>
      </div>
    </div>
  );
}
