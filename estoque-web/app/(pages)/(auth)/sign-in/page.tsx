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
import { useRouter, useSearchParams } from "next/navigation";
import signInWithEmail from "@/lib/services/auth/sign-in";
import signInWithGoogle from "@/lib/services/auth/sign-in-with-google";
import { supabase } from "@/utils/supabase/supabaseClient";

import { validateEmail, validateSignInPassword } from "@/utils/validations";
import Link from "next/link";

// Wrap useSearchParams usage inside a Suspense boundary to avoid warnings
function OAuthCallbackHandler({
  setGoogleError,
}: {
  setGoogleError: (msg: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const errorCode = searchParams.get("error_code");

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
      // Clean URL
      router.replace("/sign-in");
      return;
    }

    // Only check session on OAuth callback (hash or query present)
    const hasOAuthParams =
      typeof window !== "undefined" &&
      (window.location.hash || Array.from(searchParams.keys()).length > 0);

    if (hasOAuthParams) {
      const checkSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.push("/");
        }
      };

      checkSession();
    }
  }, [searchParams, router, setGoogleError]);

  return null;
}

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
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err: any) {
      setFormError(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    try {
      setGoogleLoading(true);

      // Garante que não vai criar conta nova (apenas login)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pending_user_creation");
      }

      // Redireciona de volta para /sign-in após OAuth
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

  return (
    <div>
      <Suspense fallback={null}>
        <OAuthCallbackHandler setGoogleError={setGoogleError} />
      </Suspense>
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
