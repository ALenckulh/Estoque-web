"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { PasswordField } from "@/components/ui/PasswordField";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { Body1, Body4, Detail1, Subtitle2 } from "@/components/ui/Typography";
import { useToast } from "@/hooks/toastHook";
import { useUser } from "@/hooks/userHook";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/axios";
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
  Drawer,
  FormControlLabel,
  TextField,
  Tooltip,
  CircularProgress,
  Popover,
  Autocomplete,
} from "@mui/material";
import { findMyUserId } from "@/lib/services/user/find-my-user-id";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TableListUsers, {
  type DataUser,
} from "@/components/Users/Tables/TableListUsers";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateSignInPassword,
  validateUsername,
} from "@/utils/validations";
import { Unauthorized } from "@/components/Feedback/Unauthorized";
import { Loading } from "@/components/Feedback/Loading";

type Option = {
  label: string;
  value: string | number;
};

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
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] =
    useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [userEdit, setUserEdit] = useState<DataUser | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [editPastPassword, setEditPastPassword] = useState("");
  const [editFuturePassword, setEditFuturePassword] = useState("");
  const [editConfirmFuturePassword, setEditConfirmFuturePassword] =
    useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [anchorPopover, setAnchorPopover] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState<Option | null>(null);
  // Guardar valores iniciais para detectar alterações (dirty state)
  const [initialUsername, setInitialUsername] = useState("");
  const [initialIsAdmin, setInitialIsAdmin] = useState(false);

  // Carregar filtros do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem("userFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.status) setFilterStatus(parsed.status);
      } catch {}
    }
  }, []);
  const [errors, setErrors] = useState<Record<string, string>>({
    newUsername: "",
    newEmail: "",
    newPassword: "",
    newConfirmPassword: "",
    editUsername: "",
    editPastPassword: "",
    editFuturePassword: "",
    editConfirmFuturePassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const { toasts, showToast } = useToast();
  const queryClient = useQueryClient();
  const {
    foundUserId,
    setFoundUserId,
    myUserId,
    myUserEnterpriseId,
    setOpenDialog,
    OpenDialog,
    foundUserDisable,
    editDrawerOpen,
    setEditDrawerOpen,
    setMyUserId,
    isAdmin,
    setIsAdmin,
  } = useUser();

  useEffect(() => {
    if (!foundUserId) return;

    setUserEdit((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        id: foundUserId,
      };
    });
  }, [foundUserId]);

  // Populate myUserId on mount using findMyUserId
  useEffect(() => {
    (async () => {
      try {
        const id = await findMyUserId();
        setMyUserId?.(id);
      } catch (e) {
        // ignore when no user is logged
      }
    })();
  }, [setMyUserId]);

  // Quando carregar o usuário para edição, sincroniza estados e baseline inicial
  useEffect(() => {
    if (userEdit) {
      setEditUsername(userEdit.name);
      setEditIsAdmin(Boolean(userEdit.is_admin));
      setInitialUsername(userEdit.name);
      setInitialIsAdmin(Boolean(userEdit.is_admin));
      //                                                                                                    a  a  a  a  a  a  a  a aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaqaqaqaqaqaqaqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmqmqmqmqmqmqmq1mmmmmmmmmm,mmm,m,m,m,m,m,m,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,R,e,s,e,t,a,r, campos de senha e seção
      setIsPasswordSectionVisible(false);
      setEditPastPassword("");
      setEditFuturePassword("");
      setEditConfirmFuturePassword("");
    }
  }, [userEdit]);

  // Prefill edit form via axios when drawer opens and an id is selected
  useEffect(() => {
    if (!editDrawerOpen || !foundUserId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/user/${foundUserId}`);
        const usr = res?.data?.user ?? res?.data; // support either { user } or raw user
        if (!usr) return;

        if (cancelled) return;
        setEditUsername(usr.name ?? "");
        setEditIsAdmin(Boolean(usr.is_admin));
        setInitialUsername(usr.name ?? "");
        setInitialIsAdmin(Boolean(usr.is_admin));

        // reset password section on new load
        setIsPasswordSectionVisible(false);
        setEditPastPassword("");
        setEditFuturePassword("");
        setEditConfirmFuturePassword("");
      } catch (err: any) {
        if (cancelled) return;
        showToast(err?.message || "Erro ao carregar usuário", "error", "X");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editDrawerOpen, foundUserId]);

  const handleToggleSafeDelete = async ( ) => {
    try {
      if (!foundUserId) {
        showToast("Nenhum usuário selecionado", "error", "X");
        setOpenDialog(false);
        return;
      }

      const res = (await api.delete(`/user/${foundUserId}`)).data;


      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["users", myUserEnterpriseId] });
        const successMsg =
          res.message ?? (foundUserDisable ? "Usuário ativado com sucesso" : "Usuário desativado com sucesso");
        showToast(successMsg, "success", foundUserDisable ? "Check" : "Trash");
      } else {
        showToast(res?.message || "Erro ao atualizar usuário", "error", "X");
      }
    } catch (err: any) {
      showToast(err?.message || "Erro ao atualizar usuário", "error", "X");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCloseEditDrawer = () => {
    setEditDrawerOpen?.(false);
    setFoundUserId(null);
    setTimeout(() => setIsPasswordSectionVisible(false), 100);
    setErrors({});
    setEditUsername("");
    setEditIsAdmin(false);
    setInitialUsername("");
    setInitialIsAdmin(false);
    setEditPastPassword("");
    setEditFuturePassword("");
    setEditConfirmFuturePassword("");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    const newUsernameError = validateUsername(newUsername);
    const newEmailError = validateEmail(newEmail);
    const newPasswordError = validatePassword(newPassword);
    const newConfirmPasswordError = validateConfirmPassword(
      newPassword,
      newConfirmPassword
    );

    setErrors({
      newUsername: newUsernameError,
      newEmail: newEmailError,
      newPassword: newPasswordError,
      newConfirmPassword: newConfirmPasswordError,
    });

    const hasError = [
      newUsernameError,
      newEmailError,
      newPasswordError,
      newConfirmPasswordError,
    ].some(Boolean);

    if (hasError) return;

    // Call backend to create user (is_owner: false, is_admin from checkbox,
    // enterprise id from provider). On success, persist pending verification
    // and try to send OTP, then advance to OTP section.
    const payload = {
      name: newUsername,
      email: newEmail,
      password: newPassword,
      is_owner: false,
      is_admin: Boolean(newIsAdmin),
      myUserEnterpriseId: myUserEnterpriseId,
    } as any;

    setCreating(true);
    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        // try to parse body like sign-up page to detect server-side reported errors
        let json: any = null;
        try {
          json = await res.json();
        } catch (err) {
          // ignore parse errors
        }

        if (json && (json.error || json.errors)) {
          const serverMessage =
            json.error || json.message || JSON.stringify(json.errors);
          setErrors((prev) => ({ ...prev, newEmail: serverMessage }));
          return;
        }

        if (!res.ok) {
          const message = json?.message || "Erro ao criar usuário";
          setErrors((prev) => ({ ...prev, newEmail: message }));
          return;
        }

        // Success: capture email, clear inputs and show success message similar to sign-up
        const emailToShow = newEmail;
        setNewUsername("");
        setNewEmail("");
        setNewPassword("");
        setNewConfirmPassword("");
        setNewIsAdmin(false);
        setErrors({});
        const msg = `Verifique o e-mail "${emailToShow}" para confirmar sua conta.`;
        setSuccessMessage(msg);

        // Invalidar query para recarregar a tabela
        queryClient.invalidateQueries({
          queryKey: ["users", myUserEnterpriseId],
        });
      })
      .catch(() => {
        setErrors((prev) => ({ ...prev, newEmail: "Erro ao criar usuário" }));
      })
      .finally(() => setCreating(false));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const editUsernameError = validateUsername(editUsername);

    // Validar senhas apenas se a seção estiver visível
    let passwordPastError = "";
    let passwordFutureError = "";
    let confirmFuturePasswordError = "";

    if (isPasswordSectionVisible) {
      passwordPastError = validateSignInPassword(editPastPassword);
      passwordFutureError = validatePassword(editFuturePassword);
      confirmFuturePasswordError = validateConfirmPassword(
        editFuturePassword,
        editConfirmFuturePassword
      );
    }

    setErrors({
      editUsername: editUsernameError,
      editPastPassword: passwordPastError,
      editFuturePassword: passwordFutureError,
      editConfirmFuturePassword: confirmFuturePasswordError,
    });

    const hasValidationError =
      !!editUsernameError ||
      (isPasswordSectionVisible &&
        (!!passwordPastError || !!passwordFutureError || !!confirmFuturePasswordError));

    if (hasValidationError) return;

    const targetUserId = userEdit?.id ?? foundUserId;
    if (!targetUserId) {
      showToast("Nenhum usuário selecionado", "error", "X");
      return;
    }

    const payload: any = {
      name: editUsername,
      admin: Boolean(editIsAdmin),
    };
    if (isPasswordSectionVisible) {
      payload.currentPassword = editPastPassword;
      payload.newPassword = editFuturePassword;
    }

    try {
      const data = (await api.put(`/user/${targetUserId}`, payload)).data as any;

      if (!data?.success) {
        const serverMessage = data?.error || data?.message || "Erro ao atualizar usuário";
        showToast(serverMessage, "error", "X");
        return;
      }

      showToast(`Usuário ${editUsername} editado com sucesso!`, "success", "Pencil");
      queryClient.invalidateQueries({ queryKey: ["users", myUserEnterpriseId] });
      handleCloseEditDrawer();
    } catch (err: any) {
      showToast(err?.message || "Erro ao atualizar usuário", "error", "X");
    }
  };

  const isDirty =
    editUsername !== initialUsername ||
    editIsAdmin !== initialIsAdmin ||
    (isPasswordSectionVisible &&
      [editPastPassword, editFuturePassword, editConfirmFuturePassword].some(
        (f) => f.length > 0
      ));

  const statusOptions: Option[] = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
  ];

  const isFilterEmpty = !filterStatus;
  const hasActiveFilters = !isFilterEmpty;

  const handleClearFilters = () => {
    setFilterStatus(null);
    localStorage.removeItem("userFilters");
  };

  // Salvar filtros automaticamente quando mudam
  useEffect(() => {
    if (filterStatus) {
      const filtersToSave = { status: filterStatus };
      localStorage.setItem("userFilters", JSON.stringify(filtersToSave));
    }
  }, [filterStatus]);

  // Show Unauthorized component if not admin (only after isAdmin is loaded)
  if (isAdmin === false) {
    return <Unauthorized description="Você não tem permissão para acessar esta página." />;
  }

  // Show loading while checking admin status
  if (isAdmin === undefined || isAdmin === null) {
    return <Loading />;
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Body4 sx={{ color: "var(--neutral-60)" }}>Meus usuários</Body4>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                startIcon={<Icon name="ListFilter" />}
                onClick={(e) => setAnchorPopover(e.currentTarget)}
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  p: "8px",
                  "& .MuiButton-startIcon": { m: 0 },
                }}
                aria-label={
                  hasActiveFilters ? "Filtros ativos" : "Abrir filtros"
                }
              />
              {hasActiveFilters && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    boxShadow: "0 0 0 2px #fff",
                  }}
                />
              )}
              <Popover
                open={Boolean(anchorPopover)}
                anchorEl={anchorPopover}
                onClose={() => setAnchorPopover(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                slotProps={{ paper: { sx: { width: 300, p: 3 } } }}
              >
                <Subtitle2 sx={{ mb: "40px", color: "var(--neutral-80)" }}>
                  Filtrar Usuários
                </Subtitle2>
                <form
                  className="formContainer"
                  style={{ width: "100%", gap: "20px" }}
                >
                  <Autocomplete
                    options={statusOptions}
                    getOptionLabel={(option) => option.label}
                    value={filterStatus}
                    onChange={(_, newValue) => setFilterStatus(newValue)}
                    isOptionEqualToValue={(option, val) =>
                      option.value === val?.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Estado"
                        placeholder="Selecione..."
                      />
                    )}
                  />
                  <Box sx={{ display: "flex", gap: "12px", mt: "24px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Icon name="FilterX" />}
                      disabled={isFilterEmpty}
                      onClick={handleClearFilters}
                      fullWidth
                    >
                      Limpar
                    </Button>
                  </Box>
                </form>
              </Popover>
            </Box>
            <Button
              variant="contained"
              startIcon={<Icon name="Plus" />}
              onClick={() => {
                setSuccessMessage("");
                setIsCreateDrawerOpen(true);
              }}
            >
              Criar usuário
            </Button>
          </Box>
        </Box>

        <TableListUsers
          filters={{
            safe_delete:
              filterStatus?.value === "ativo"
                ? false
                : filterStatus?.value === "inativo"
                ? true
                : undefined,
          }}
        />

        <ToastContainer toasts={toasts} />

        <Dialog
          open={Boolean(OpenDialog)}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>
            {foundUserDisable
              ? "Tem certeza que deseja ativar o usuário?"
              : "Tem certeza que deseja desativar o usuário?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
                {foundUserDisable
                  ? "Após ativar este usuário poderá voltar a acessar o sistema"
                  : "Após desativar o usuário não haverá como acessar o sistema, sendo necessário reativá-lo"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setOpenDialog(false)}
            >
              Fechar
            </Button>
            <Button
                startIcon={<Icon name={foundUserDisable ? "Check" : "Trash"} />}
                variant="contained"
                color={foundUserDisable ? "primary" : "error"}
                onClick={() => handleToggleSafeDelete()}
            >
                {foundUserDisable ? "Ativar usuário" : "Desativar usuário"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Drawer para criar usuário */}
        <Drawer
          anchor="right"
          open={isCreateDrawerOpen}
          onClose={() => {
            setErrors({});
            setSuccessMessage("");
            setIsCreateDrawerOpen(false);
          }}
        >
          <Container style={DRAWER_CONTAINER_STYLE}>
            <Body1>Criar usuário</Body1>
            <form className="formContainer" onSubmit={handleCreateUser}>
              <TextField
                label="Usuário"
                onChange={(e) => setNewUsername(e.target.value)}
                error={!!errors.newUsername}
                helperText={errors.newUsername}
              />
              <TextField
                label="E-mail"
                onChange={(e) => setNewEmail(e.target.value)}
                error={!!errors.newEmail}
                helperText={errors.newEmail}
              />
              <PasswordField
                label="Senha"
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
              />
              <PasswordField
                label="Confirmar senha"
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                error={!!errors.newConfirmPassword}
                helperText={errors.newConfirmPassword}
              />
              <Box sx={ADMIN_CHECKBOX_CONTAINER_STYLE}>
                <FormControlLabel
                  label="Permitir ações de administrador"
                  control={
                    <Checkbox
                      checked={newIsAdmin}
                      onChange={(e) => setNewIsAdmin(e.target.checked)}
                    />
                  }
                />
                <Tooltip
                  arrow
                  title="Permite gerenciar adicionar, editar e deletar todos os usuários, exceto a conta criadora do estoque."
                >
                  <Icon name="Info" color="var(--neutral-50)" />
                </Tooltip>
              </Box>

              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: "40px" }}
                startIcon={
                  creating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : undefined
                }
                disabled={creating}
              >
                {creating ? "Criando..." : "Confirmar"}
              </Button>
              {successMessage && (
                <Subtitle2 sx={{ marginTop: 2, color: "var(--success-20)" }}>
                  {successMessage}
                </Subtitle2>
              )}
            </form>
          </Container>
        </Drawer>

        {/* Drawer para editar usuário */}
        <Drawer
          anchor="right"
          open={Boolean(editDrawerOpen)}
          onClose={handleCloseEditDrawer}
        >
          <Container style={DRAWER_CONTAINER_STYLE}>
            <Body1>
              {myUserId === userEdit?.id
                ? "Editar usuário atual"
                : "Editar usuário"}
            </Body1>

            <form className="formContainer" onSubmit={handleUpdateUser}>
              <TextField
                label="Usuário"
                onChange={(e) => setEditUsername(e.target.value)}
                value={editUsername}
                error={!!errors.editUsername}
                helperText={errors.editUsername}
              />

              <Box sx={ADMIN_CHECKBOX_CONTAINER_STYLE}>
                <FormControlLabel
                  label="Permitir ações de administrador"
                  control={
                    <Checkbox
                      checked={editIsAdmin}
                      onChange={(e) => setEditIsAdmin(e.target.checked)}
                    />
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
                    onClick={() => {
                      setIsPasswordSectionVisible(true);
                      errors.editPastPassword = "";
                      errors.editFuturePassword = "";
                      errors.editConfirmFuturePassword = "";
                    }}
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
                        onChange={(e) => setEditPastPassword(e.target.value)}
                        error={!!errors.editPastPassword}
                        helperText={errors.editPastPassword}
                      />
                      <PasswordField
                        label="Senha nova"
                        onChange={(e) => setEditFuturePassword(e.target.value)}
                        error={!!errors.editFuturePassword}
                        helperText={errors.editFuturePassword}
                      />
                      <PasswordField
                        label="Confirmar senha nova"
                        onChange={(e) =>
                          setEditConfirmFuturePassword(e.target.value)
                        }
                        error={!!errors.editConfirmFuturePassword}
                        helperText={errors.editConfirmFuturePassword}
                      />
                      <Link
                        style={{
                          fontSize: "16px",
                          color: "var(--primary-10)",
                        }}
                        href="/forgot-password"
                      >
                        Esqueci minha senha?
                      </Link>
                    </Box>
                  </Box>
                </motion.div>
              )}
              <Button
                variant="contained"
                sx={{ marginTop: "40px" }}
                type="submit"
                disabled={!isDirty}
              >
                Atualizar
              </Button>
            </form>
          </Container>
        </Drawer>
      </div>
    </div>
  );
}
