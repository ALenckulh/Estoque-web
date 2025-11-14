"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Detail1, H4 } from "@/components/ui/Typography";
import { Box, Button, Card, CircularProgress } from "@mui/material";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Subtitle2 } from "@/components/ui/Typography";
import { MuiOtpInput } from "mui-one-time-password-input";
import { matchIsNumeric, validateOtp } from "@/utils/validations";
import { useUser } from "@/hooks/userHook";


function VerifyEmailInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { myUserId } = useUser();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [creating, setCreating] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [info, setInfo] = useState("");

  const handleChange = (newValue: string) => {
    setError("");
    setOtp(newValue);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("pending_verify_email");
      console.log("Email para verificação:", stored);
      if (stored) setEmail(stored);
    }
  }, [search]);

  // Não enviar OTP automaticamente para evitar e-mails duplicados.
  // O envio inicial acontece no sign-up ou manualmente pelo usuário.

  useEffect(() => {
    let interval: any;
    if (resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => interval && clearInterval(interval);
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (!email) return;
    setSending(true);
    setInfo("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao enviar código");
      setInfo("Código enviado. Verifique seu e-mail.");
      setResendCooldown(60); // 60s cooldown
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const validationError = validateOtp(otp);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!email) {
      setError("Email não disponível para verificação");
      return;
    }
    setVerifying(true);
    try {
      const { data, error: supError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (supError) throw new Error(supError.message);
      if (!data.session) throw new Error("Sessão não criada");
      // Após verificação, cria o usuário da aplicação via API
      setCreating(true);
      let authUserId = myUserId || null;
      if (!authUserId) {
        const { data: userData } = await supabase.auth.getUser();
        authUserId = userData.user?.id || null;
      }
      if (!authUserId) {
        throw new Error(
          "Não foi possível obter o authUserId após verificação."
        );
      }
      let name: string | undefined = undefined;
      if (typeof window !== "undefined") {
        name = window.localStorage.getItem("pending_signup_name") || undefined;
      }
      if (!name && email) {
        name = email.split("@")[0];
      }
      const appRes = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          is_admin: true,
          is_owner: true,
          authUserId,
        }),
      });
      const appJson = await appRes.json();
      if (!appRes.ok) {
        throw new Error(
          appJson.error || "Falha ao criar usuário da aplicação."
        );
      }
      // Limpa marcadores locais
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("pending_verify_email");
        window.localStorage.removeItem("pending_signup_name");
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Falha ao verificar código");
    } finally {
      setVerifying(false);
      setCreating(false);
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
            Verifique seu e-mail
          </H4>
          <Detail1
            sx={{ width: "100%", textAlign: "center", paddingBottom: "16px" }}
          >
            Digite o código enviado para:
          </Detail1>
          <Detail1
            sx={{
              width: "100%",
              textAlign: "center",
              paddingBottom: "24px",
              fontWeight: 600,
            }}
          >
            {email || "(email não encontrado)"}
          </Detail1>
          <form onSubmit={handleSubmit} className="formContainer">
            <Box>
              {/* @ts-expect-error: type conflict between React versions */}
              <MuiOtpInput
                value={otp}
                onChange={handleChange}
                length={6}
                autoFocus
                validateChar={matchIsNumeric}
                TextFieldsProps={{ error: Boolean(error) }}
              />
              <Detail1
                sx={{
                  color: "var(--danger-10)",
                  height: "20px",
                  marginTop: "8px",
                }}
              >
                {error}
              </Detail1>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={verifying || sending}
              startIcon={
                verifying || creating ? (
                  <CircularProgress size={20} color="inherit" />
                ) : undefined
              }
              sx={{ marginTop: "20px" }}
            >
              {verifying || creating ? "Finalizando..." : "Confirmar"}
            </Button>
            <Button
              type="button"
              variant="text"
              disabled={sending || resendCooldown > 0}
              onClick={sendOtp}
              startIcon={
                sending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : undefined
              }
              sx={{ marginTop: "8px" }}
            >
              {sending
                ? "Enviando..."
                : resendCooldown > 0
                  ? `Reenviar (${resendCooldown}s)`
                  : "Enviar código"}
            </Button>
            {(info || error) && (
              <Subtitle2
                sx={{
                  marginTop: 2,
                  color: error ? "var(--danger-0)" : "var(--success-10)",
                }}
              >
                {error || info}
              </Subtitle2>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
