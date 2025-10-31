"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { PasswordField } from "@/components/ui/PasswordField";
import { H4, Subtitle2 } from "@/components/ui/Typography";
import { Box, Button, Card, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  validateEmail,
  validateSignInPassword,
} from "@/utils/validations";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {
      email: validateEmail(email),
      password: validateSignInPassword(password),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error);
    if (hasError) return;

    return router.push("/");
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
            <Button type="submit" variant="contained" sx={{ marginTop: "20px" }}>
              Confirmar
            </Button>
            
          </form>
          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", gap:"4px", width:"100%", justifyContent:"center", paddingTop:"40px"}}>
              <Subtitle2 sx={{color:"var(--neutral-60)"}}>Não possui conta?</Subtitle2>
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
