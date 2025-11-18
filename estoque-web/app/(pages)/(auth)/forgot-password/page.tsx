"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Detail1, H4, Subtitle2 } from "@/components/ui/Typography";
import { Button, Card, TextField, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { validateEmail } from "@/utils/validations";
import resetPasswordRequest from "@/lib/services/auth/reset-password-request";

export default function Page() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (newValue: string) => {
    setError("");
    setEmail(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await resetPasswordRequest(email);
      setSuccessMessage(
        "Se este email estiver cadastrado, você receberá um link para redefinir sua senha."
      );
      setEmail("");
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar email de recuperação");
    } finally {
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
            sx={{ width: "100%", textAlign: "center", paddingBottom: "12px" }}
          >
            Esqueceu a senha?
          </H4>
          <Detail1
            sx={{ width: "100%", textAlign: "center", paddingBottom: "40px" }}
          >
            Insira seu e-mail para enviarmos o código de verificação
          </Detail1>
          <form onSubmit={handleSubmit} className="formContainer">
            <TextField
              label="E-mail"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              error={!!error}
              helperText={error}
              disabled={loading}
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ marginTop: "20px" }}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress
                    size={20}
                    thickness={5}
                    sx={{ color: "inherit" }}
                  />
                ) : null
              }
            >
              {loading ? "Enviando..." : "Confirmar"}
            </Button>
            {successMessage && (
              <Subtitle2 sx={{ marginTop: 2, color: "var(--success-0)" }}>
                {successMessage}
              </Subtitle2>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
