"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { H4, Subtitle2 } from "@/components/ui/Typography";
import { Button, Card, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  validateConfirmPassword,
  validatePassword,
} from "@/utils/validations";
import { PasswordField } from "@/components/ui/PasswordField";
import updatePassword from "@/lib/services/auth/update-password";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Loading } from "@/components/Feedback/Loading";

export default function Page() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Verificar se há uma sessão válida (token do link de recuperação)
    const checkSession = async () => {
      // Primeiro, verificar se há token_hash nos query params (formato do Supabase email)
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get('token_hash');
      const type = params.get('type');

      // Se não houver token_hash, redirecionar imediatamente para forgot-password
      if (!tokenHash || type !== 'recovery') {
        router.replace('/forgot-password');
        return;
      }

      if (tokenHash && type === 'recovery') {
        try {
          // Call server API to verify token_hash (server uses supabaseAdmin)
          const res = await fetch('/api/auth/verify-recovery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token_hash: tokenHash }),
            credentials: 'same-origin',
          });

          const data = await res.json();

          if (!res.ok) {
            setFormError('Link inválido ou expirado. Solicite um novo link de recuperação.');
            setSessionValid(false);
            return;
          }

          // If the server returned a session, set it into the client supabase so we can call updateUser
          if (data?.session) {
            try {
              await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token || '',
              });
            } catch (err) {
              // ignore and proceed to check session below
            }
          } else if (!window.location.hash) {
            // no session returned and no hash fragment -> invalid
            setFormError('Link inválido ou expirado. Solicite um novo link de recuperação.');
            setSessionValid(false);
            return;
          }
        } catch (err) {
          setFormError('Erro ao processar link de recuperação.');
          setSessionValid(false);
          return;
        }
      } else {
        // Fallback: tentar processar hash fragment (formato alternativo)
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const hashType = hashParams.get('type');

          if (accessToken && hashType === 'recovery') {
            try {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });
            } catch (err) {
              setFormError("Erro ao processar link de recuperação.");
              setSessionValid(false);
              return;
            }
          } else {
            // Sem token válido, redirecionar
            router.replace('/forgot-password');
            return;
          }
        } else {
          // Sem token, redirecionar
          router.replace('/forgot-password');
          return;
        }
      }

      // Verificar se a sessão está ativa
      const { data: { session } } = await supabase.auth.getSession();
      setSessionValid(!!session);
      if (!session) {
        setFormError('Link inválido ou expirado. Solicite um novo link de recuperação.');
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const newErrors: Record<string, string> = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) return;

    try {
      setLoading(true);
      await updatePassword(password);

      // Sincronizar sessão com cookies HttpOnly no servidor
      const { data: { session } } = await supabase.auth.getSession();
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
        } catch (syncErr) {
          // Continue mesmo se sync falhar
        }
      }

      // Redirecionar para home após sucesso
      router.push("/");
    } catch (err: any) {
      setFormError(err?.message || "Erro ao atualizar senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionValid === null) {
    return <Loading />;
  }

  if (!sessionValid) {
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
              sx={{ width: "100%", textAlign: "center", paddingBottom: "20px" }}
            >
              Link Inválido
            </H4>
            <Subtitle2 sx={{ color: "var(--danger-0)", textAlign: "center", marginBottom: 3 }}>
              {formError}
            </Subtitle2>
            <Button
              variant="contained"
              onClick={() => router.push("/forgot-password")}
              fullWidth
            >
              Solicitar novo link
            </Button>
          </Card>
        </div>
      </div>
    );
  }

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
            sx={{ width: "100%", textAlign: "center", paddingBottom: "40px" }}
          >
            Redefinir senha
          </H4>
          <form onSubmit={handleSubmit} className="formContainer">
            <PasswordField
              label="Nova senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
            />
            <PasswordField
              label="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: "" });
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
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
                    sx={{ color: "var(--neutral-40)" }}
                  />
                ) : null
              }
            >
              {loading ? "Atualizando..." : "Confirmar"}
            </Button>
            {formError && (
              <Subtitle2 sx={{ marginTop: 2, color: "var(--danger-0)" }}>
                {formError}
              </Subtitle2>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
