"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { PasswordField } from "@/components/ui/PasswordField";
import { H4, Subtitle2 } from "@/components/ui/Typography";
import {
  Box,
  Button,
  Card,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import signInWithEmail from "@/lib/services/auth/sign-in";
import signInWithGoogle from "@/lib/services/auth/sign-in-with-google";
import { supabase } from "@/utils/supabase/supabaseClient";
import resendVerificationEmail from "@/lib/services/auth/resend-verification";
import loadAndStoreUserEnterprise from "@/lib/services/user/load-user-enterprise";

import { validateEmail, validateSignInPassword } from "@/utils/validations";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [isCheckingOAuthUser, setIsCheckingOAuthUser] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError("");
    setVerificationMessage("");
    const newErrors: Record<string, string> = {
      email: validateEmail(email),
      password: validateSignInPassword(password),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) return;

    try {
      setLoading(true);
      const result = await signInWithEmail(email, password);

      // Support both { user, session } and { data: { user, session } }
      const hasSession = !!(result && (result.user || result.session));

      if (hasSession) {
        try {
          const _r: any = result;
          const access_token =
            _r?.session?.access_token ?? _r?.data?.session?.access_token;
          const refresh_token =
            _r?.session?.refresh_token ?? _r?.data?.session?.refresh_token;
          const expires_in =
            _r?.session?.expires_in ?? _r?.data?.session?.expires_in;

          if (access_token && refresh_token) {
            try {
              await fetch("/api/auth/sync-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  access_token,
                  refresh_token,
                  expires_in,
                }),
                credentials: "same-origin",
              });
              // After session sync, load & persist enterprise id once
              try {
                await loadAndStoreUserEnterprise();
              } catch (e) {
                // ignore
              }
            } catch (syncErr) {
              // Sync failed, continue anyway
            }
          } else {
          }

          await router.push("/");
        } catch (navErr) {}
      } else {
        setFormError("Falha no login. Verifique suas credenciais.");
      }
    } catch (err: any) {
      const raw = (err?.message || "").toLowerCase();

      // Email not confirmed -> resend verification and show message
      if (
        raw.includes("email not confirmed") ||
        raw.includes("email confirmation")
      ) {
        await resendVerificationEmail(email);
        setVerificationMessage(
          "Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada."
        );
        // don't set formError in this case; verificationMessage is shown
      } else {
        // Map common error messages to friendly Portuguese text
        let friendly = "Falha no login. Verifique suas credenciais.";

        if (
          raw.includes("invalid login credentials") ||
          raw.includes("invalid email or password") ||
          raw.includes("invalid password") ||
          raw.includes("invalid_login_credentials") ||
          raw.includes("invalid login")
        ) {
          friendly = "E-mail ou senha incorretos.";
        } else if (
          raw.includes("user not found") ||
          raw.includes("no user found") ||
          raw.includes("user_not_found")
        ) {
          friendly = "Conta não encontrada.";
        } else if (
          raw.includes("too many requests") ||
          raw.includes("rate limit") ||
          raw.includes("too many")
        ) {
          friendly = "Muitas tentativas. Tente novamente mais tarde.";
        } else if (
          raw.includes("invalid input") ||
          raw.includes("invalid email") ||
          raw.includes("email inválido")
        ) {
          friendly = "E-mail inválido.";
        } else if (
          raw.includes("internal error") ||
          raw.includes("internal server error")
        ) {
          friendly = "Erro interno. Tente novamente mais tarde.";
        }

        setFormError(friendly);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    try {
      setGoogleLoading(true);
      const redirectTo = `${window.location.origin}/sign-in`;
      const data = await signInWithGoogle(redirectTo);
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setGoogleError(err?.message || "Falha ao iniciar login com Google");
      setGoogleLoading(false);
    }
  };

  // Listener para garantir redirecionamento mesmo em fluxo de linking (USER_UPDATED)
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // NÃO redirecionar se estamos validando usuário OAuth
        if (isCheckingOAuthUser) return;

        if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
          router.push("/");
        }
      }
    );
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [router, isCheckingOAuthUser]);

  // Handle OAuth callback errors and session check on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const errorCode = params.get("error_code");

    if (error) {
      // Map OAuth errors to friendly messages
      let friendlyMessage = "Falha ao entrar com Google";
      if (
        errorCode === "signup_disabled" ||
        errorDescription?.includes("Signups not allowed")
      ) {
        friendlyMessage =
          "Esta conta não existe. Por favor, crie uma conta primeiro.";
      } else if (error === "access_denied") {
        friendlyMessage =
          "Acesso negado. Você cancelou o login ou não tem permissão.";
      } else if (errorDescription) {
        friendlyMessage = decodeURIComponent(errorDescription);
      }

      setGoogleError(friendlyMessage);
      // Clean the query params to keep UI tidy
      router.replace("/sign-in");
      return;
    }

    // If there are OAuth params (hash or query), check session and redirect if logged in
    const hasOAuthParams =
      window.location.hash || Array.from(params.keys()).length > 0;
    if (hasOAuthParams) {
      setIsCheckingOAuthUser(true);
      (async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            try {
              await fetch("/api/auth/sync-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  access_token: session.access_token,
                  refresh_token: session.refresh_token,
                  expires_in: session.expires_in,
                }),
                credentials: "same-origin",
              });
              // After session sync, load & persist enterprise id once
              try {
                await loadAndStoreUserEnterprise();
              } catch (e) {
                // ignore
              }
            } catch (e) {
              // Sync failed, continue anyway
            }

            // Depois do sync, verfica se existe um app user correspondente
            try {
              const checkResp = await fetch("/api/auth/check-app-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
              });
              const checkJson = await checkResp.json().catch(() => ({}));
              const exists = !!checkJson?.exists;
              if (exists) {
                setIsCheckingOAuthUser(false);
                router.push("/");
              } else {
                // usuário não existe no app: desloga e mostra mensagem amigável
                try {
                  await fetch("/api/auth/sign-out", {
                    method: "POST",
                    credentials: "same-origin",
                  });
                } catch (e) {
                  // Sign out failed, continue anyway
                }
                if (checkJson?.deleted) {
                  setGoogleError(
                    "Conta inexistente removida do provedor de Auth. Entre em contato com o administrador."
                  );
                } else {
                  setGoogleError(
                    "Conta não existe no sistema. Entre em contato com o administrador."
                  );
                }
                setIsCheckingOAuthUser(false);
                // remove query params and stay on sign-in page
                router.replace("/sign-in");
              }
            } catch (e) {
              // fallback: allow navigation
              setIsCheckingOAuthUser(false);
              router.push("/");
            }
          }
        } catch (e) {
          // Session check failed, stay on sign-in
          setIsCheckingOAuthUser(false);
        }
      })();
    }
  }, [router]);

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
            Entrar
          </H4>
          <form onSubmit={handleSubmit} className="formContainer">
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
            <Link
              style={{
                fontSize: "16px",
                color: "var(--primary-10)",
              }}
              href="/forgot-password"
            >
              Esqueci minha senha?
            </Link>
            <Button
              type="submit"
              variant="contained"
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
              Confirmar
            </Button>
            {formError && (
              <Subtitle2 sx={{ marginTop: 2, color: "var(--danger-0)" }}>
                {formError}
              </Subtitle2>
            )}
            {verificationMessage && (
              <Subtitle2 sx={{ marginTop: 2, color: "var(--success-20)" }}>
                {verificationMessage}
              </Subtitle2>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                marginTop: 2,
              }}
            >
              <Divider sx={{ flexGrow: 1, borderColor: "var(--neutral-30)" }} />
              <Subtitle2 sx={{ marginX: 1, color: "var(--neutral-70)" }}>
                ou
              </Subtitle2>
              <Divider sx={{ flexGrow: 1, borderColor: "var(--neutral-30)" }} />
            </Box>

            <Button
              color="secondary"
              sx={{
                marginTop: 2,
                "& .MuiButton-startIcon": {
                  marginRight: "12px",
                },
              }}
              variant="outlined"
              startIcon={
                googleLoading ? (
                  <CircularProgress
                    size={20}
                    thickness={5}
                    sx={{
                      color: "inherit",
                      ...(googleLoading || loading ? { opacity: 0.5 } : {}),
                    }}
                  />
                ) : (
                  <img
                    src="/icons/googleIcon.svg"
                    alt="Google Icon"
                    height={20}
                    width={20}
                  />
                )
              }
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
            >
              Entrar com o Google
            </Button>
            {googleError && (
              <Subtitle2 sx={{ marginTop: 1, color: "var(--danger-0)" }}>
                {googleError}
              </Subtitle2>
            )}
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
              Não possui conta?
            </Subtitle2>
            <Link
              style={{
                fontSize: "16px",
                color: "var(--primary-10)",
              }}
              href="/sign-up"
            >
              Criar conta
            </Link>
          </Box>
        </Card>
      </div>
    </div>
  );
}
