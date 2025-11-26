"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { PasswordField } from "@/components/ui/PasswordField";
import { H4, Subtitle2 } from "@/components/ui/Typography";
import { Box, Button, Card, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from "@/utils/validations";
import Link from "next/link";

export default function Page() {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const newErrors: Record<string, string> = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) return;

    setLoading(true);

    try {
      // Call the server API to create the user (app + auth as implemented server-side)
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: username, is_owner: true, is_admin: true }),
      });

      // Tenta ler o JSON da resposta (pode lançar se o body não for JSON)
      let json: any = null;
      try {
        json = await res.json();
      } catch (parseErr) {
        // fallback: resposta sem JSON
        console.error("[sign-up] failed to parse response JSON", parseErr);
      }

      // Se o servidor retornou um objeto de erro mesmo com 200, também tratamos
      if (json && (json.error || json.errors)) {
        const serverMessage = json.error || json.message || JSON.stringify(json.errors);
        setFormError(serverMessage);
        return;
      }

      // Sucesso: mostrar mensagem para verificar email
      setPassword("");
      setConfirmPassword("");
      setFormError(""); // limpa erro
      setSuccessMessage("Verifique seu e-mail para confirmar sua conta.");
    } catch (error: any) {
      setFormError(error?.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Appbar showTabs={false} showAvatar={false} />
      <div className="container" style={{ alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ padding: "40px", width: "fit-content" }}>
          <H4 sx={{ paddingBottom: "40px", width: "100%", textAlign: "center" }}>
            Criar conta
          </H4>
          <form onSubmit={handleSubmit} className="formContainer">
            <TextField
              label="Usuário"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({ ...errors, username: "" });
              }}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              error={!!errors.email}
              helperText={errors.email}
            />
            <PasswordField
              label="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
              error={!!errors.password}
              helperText={errors.password}
            />
            <PasswordField
              label="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: "" });
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "20px" }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {loading ? "Criando..." : "Confirmar"}
            </Button>
            {formError && (
              <Subtitle2 sx={{ marginTop: 2, color: "var(--danger-0)" }}>{formError}</Subtitle2>
            )}
            {successMessage && (
              <Subtitle2 sx={{ marginTop: 2, color: "var(--success-20)" }}>{successMessage}</Subtitle2>
            )}
          </form>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px", width: "100%", justifyContent: "center", paddingTop: "40px" }}
          >
            <Subtitle2 sx={{ color: "var(--neutral-60)" }}>Já possui conta?</Subtitle2>
            <Link style={{ fontSize: "16px", color: "var(--primary-10)" }} href="/sign-in">
              Entrar
            </Link>
          </Box>
        </Card>
      </div>
    </div>
  );
}
