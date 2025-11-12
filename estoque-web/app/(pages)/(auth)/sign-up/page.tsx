"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { PasswordField } from "@/components/ui/PasswordField";
import { H4, Subtitle2, Body2 } from "@/components/ui/Typography";
import { Box, Button, Card, CircularProgress, Divider, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validations";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
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
      // Cria usuário owner com admin = true via API (servidor)
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: username,
          is_admin: true,
          is_owner: true,
          // myUserEnterpriseId não é necessário para owner
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta.');
      }

      router.push("/");
    } catch (error: any) {
      setFormError(error?.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError("");
    setLoading(true);

    try {
      // Chama API para iniciar OAuth com Google (owner + admin)
      const response = await fetch('/api/user/google-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_admin: true,
          is_owner: true,
          redirectTo: process.env.NEXT_PUBLIC_SIGN_IN_WITH_GOOGLE,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao iniciar cadastro com Google.');
      }

    } catch (error: any) {
      setFormError(error?.message || "Erro ao iniciar cadastro com Google.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Appbar showTabs={false} showAvatar={false} />
      <div
        className="container"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Card
          sx={{
            padding: "40px",
            width: "fit-content",
          }}
        >
          <H4
            sx={{ paddingBottom: "40px", width: "100%", textAlign: "center" }}
          >
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

            {formError && (
              <Body2 sx={{ color: "error.main", textAlign: "center", mt: 1 }}>
                {formError}
              </Body2>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "20px" }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {loading ? "Criando..." : "Confirmar"}
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Divider sx={{ flexGrow: 1, borderColor: "var(--neutral-30)" }} />
              <Subtitle2
                sx={{
                  marginX: 1,
                  color: "var(--neutral-70)",
                }}
              >
                ou
              </Subtitle2>
              <Divider sx={{ flexGrow: 1, borderColor: "var(--neutral-30)" }} />
            </Box>

            <Button
              color="secondary"
              sx={{
                "& .MuiButton-startIcon": {
                  marginRight: "12px",
                },
              }}
              variant="outlined"
              disabled={loading}
              onClick={handleGoogleSignUp}
              startIcon={
                <img
                  src="/icons/googleIcon.svg"
                  alt="Google Icon"
                  height={20}
                  width={20}
                />
              }
            >
              Criar com o Google
            </Button>
          </form>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "4px",
              width: "100%",
              justifyContent: "center",
              paddingTop: "40px",
            }}
          >
            <Subtitle2 sx={{ color: "var(--neutral-60)" }}>
              Já possui conta?
            </Subtitle2>
            <Link
              style={{
                fontSize: "16px",
                color: "var(--primary-10)",
              }}
              href="/sign-in"
            >
              Entrar
            </Link>
          </Box>
        </Card>
      </div>
    </div>
  );
}
