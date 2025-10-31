"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Detail1, H4 } from "@/components/ui/Typography";
import { Box, Button, Card, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "@/utils/validations";
import { PasswordField } from "@/components/ui/PasswordField";

export default function Page() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
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
            sx={{ width: "100%", textAlign: "center", paddingBottom: "40px" }}
          >
            Mudar senha
          </H4>
          <form onSubmit={handleSubmit} className="formContainer">
            <PasswordField
              label="Senha"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
              error={!!errors.password}
              helperText={errors.password}
            />
            <PasswordField
              label="Confirmar senha"
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
            >
              Confirmar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
