"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { PasswordField } from "@/components/ui/PasswordField";
import { H4, Subtitle2 } from "@/components/ui/Typography";
import { Box, Button, Card, CircularProgress, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import userContext from "@/contexts/userContext";
import { useRouter } from "next/navigation";
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from "@/utils/validations";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const uctx = useContext(userContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

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
      // 1) Cria usuário no Auth (ou verifica se já existe)
      const authRes = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: username, email_confirm: false }),
      });
      const authJson = await authRes.json();
      if (!authRes.ok) {
        throw new Error(authJson.error || "Erro ao criar usuário no Auth.");
      }

      // Se já existe e não está confirmado, redireciona para verificação
      if (authJson.alreadyExists && !authJson.emailConfirmed) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("pending_verify_email", email);
          window.localStorage.setItem("pending_signup_name", username);
        }
        router.push(`/verify-email`);
        return;
      }

      // Guarda authUserId no contexto
      uctx?.setMyUserId?.(authJson.user.id as string);

      // 2) Envia OTP e redireciona para verificação
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("pending_verify_email", email);
          window.localStorage.setItem("pending_signup_name", username);
        }
        const otpRes = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!otpRes.ok) {
          const j = await otpRes.json();
          throw new Error(j.error || "Falha ao enviar código de verificação");
        }
      } catch (otpErr: any) {
        console.error("Erro ao enviar OTP:", otpErr);
      }
      router.push(`/verify-email`);
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
