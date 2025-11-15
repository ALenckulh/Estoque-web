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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError("");
    const newErrors: Record<string, string> = {
      email: validateEmail(email),
      password: validateSignInPassword(password),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) return;

    try {
      setLoading(true);
      console.log("[sign-in] handleSubmit: calling signInWithEmail", { email });
      const result = await signInWithEmail(email, password);
      console.log("[sign-in] handleSubmit: signInWithEmail result", result);

      // Support both { user, session } and { data: { user, session } }
      const hasSession = !!(result && (result.user || result.session));
      console.log(
        "[sign-in] handleSubmit: result, hasSession",
        result,
        hasSession
      );

      if (hasSession) {
        try {
          console.log('[sign-in] handleSubmit: session found, attempting to sync to server cookies');
          const _r: any = result;
          const access_token = _r?.session?.access_token ?? _r?.data?.session?.access_token;
          const refresh_token = _r?.session?.refresh_token ?? _r?.data?.session?.refresh_token;
          const expires_in = _r?.session?.expires_in ?? _r?.data?.session?.expires_in;

          if (access_token && refresh_token) {
            try {
              const syncResp = await fetch("/api/auth/sync-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ access_token, refresh_token, expires_in }),
                credentials: "same-origin",
              });
              const syncJson = await syncResp.json().catch(() => ({}));
              console.log("[sign-in] sync-session response", syncResp.status, syncJson);
              if (!syncResp.ok) {
                console.warn("[sign-in] sync-session failed, continuing but middleware may redirect");
              }
            } catch (syncErr) {
              console.error("[sign-in] sync-session error", syncErr);
            }
          } else {
            console.warn("[sign-in] no tokens to sync to server");
          }

          console.log('[sign-in] handleSubmit: attempting router.push("/")');
          await router.push("/");
          // small delay to allow navigation to happen and middleware to run
          setTimeout(() => {
            console.log(
              "[sign-in] after router.push, location.href =",
              window.location.href
            );
            console.log("[sign-in] document.cookie =", document.cookie);
            supabase.auth.getSession().then(({ data }) => {
              console.log(
                "[sign-in] supabase.getSession after push",
                data?.session ?? null
              );
            });
          }, 300);
        } catch (navErr) {
          console.error("[sign-in] router.push error", navErr);
        }
      } else {
        console.log("[sign-in] handleSubmit: no session, showing error");
        setFormError("Falha no login. Verifique suas credenciais.");
      }
    } catch (err: any) {
      console.error("[sign-in] handleSubmit error", err);
      setFormError(err?.message || "Falha no login");
    } finally {
      setLoading(false);
      console.log("[sign-in] handleSubmit end");
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("[sign-in] handleGoogleSignIn start");
    setGoogleError("");
    try {
      setGoogleLoading(true);
      const redirectTo = `${window.location.origin}/sign-in`;
      console.log("[sign-in] handleGoogleSignIn: calling signInWithGoogle", {
        redirectTo,
      });
      const data = await signInWithGoogle(redirectTo);
      console.log(
        "[sign-in] handleGoogleSignIn: signInWithGoogle returned",
        data
      );
      if (data?.url) {
        console.log("[sign-in] handleGoogleSignIn: redirecting to", data.url);
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("[sign-in] handleGoogleSignIn error", err);
      setGoogleError(err?.message || "Falha ao iniciar login com Google");
      setGoogleLoading(false);
    }
  };

  // Listener para garantir redirecionamento mesmo em fluxo de linking (USER_UPDATED)
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[sign-in] onAuthStateChange event", { event, session });
        if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
          console.log("[sign-in] onAuthStateChange -> redirecting to /");
          router.push("/");
        }
      }
    );
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  // Handle OAuth callback errors and session check on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const errorCode = params.get("error_code");

    console.log("[sign-in] oauth callback params", {
      error,
      errorDescription,
      errorCode,
    });
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
    console.log("[sign-in] hasOAuthParams", hasOAuthParams);
    if (hasOAuthParams) {
      (async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          console.log("[sign-in] oauth session check", session);
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
            } catch (e) {
              console.error("[sign-in] oauth sync-session error", e);
            }
            router.push("/");
          }
        } catch (e) {
          console.error("[sign-in] oauth session check error", e);
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
                    sx={{ color: "var(--neutral-40)" }}
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
                    sx={{ color: "var(--neutral-40)" }}
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
