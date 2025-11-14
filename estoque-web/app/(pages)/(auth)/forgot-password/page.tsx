"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Detail1, H4 } from "@/components/ui/Typography";
import { Box, Button, Card, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/utils/validations";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    setError("");
    setEmail(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    const error = validateEmail(email);

    if (error) {
      setError(error);
      return;
    }

    router.push("forgot-password/verify-email");
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
            />
            <Button type="submit" variant="contained" sx={{ marginTop: "20px" }}>
              Confirmar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
