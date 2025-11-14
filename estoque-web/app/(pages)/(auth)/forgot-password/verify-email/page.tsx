"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Detail1, H4 } from "@/components/ui/Typography";
import { Box, Button, Card } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MuiOtpInput } from "mui-one-time-password-input";
import { matchIsNumeric, validateOtp } from "@/utils/validations";

export default function Page() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    setError("");
    setOtp(newValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    const error = validateOtp(otp);

    if (error) {
      setError(error);
      return;
    }

    router.push("verify-email/change-password");
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
          <H4 sx={{ width: "100%", textAlign: "center", paddingBottom: "12px" }}>
            Verifique seu e-mail
          </H4>
          <Detail1
            sx={{ width: "100%", textAlign: "center", paddingBottom: "40px" }}
          >
            Enviamos um código de 5 dígitos para o seu e-mail
          </Detail1>
          <form onSubmit={handleSubmit} className="formContainer">
            <Box>
              {/* @ts-expect-error: type conflict between React versions */}
              <MuiOtpInput value={otp} onChange={handleChange} length={5} autoFocus validateChar={matchIsNumeric} TextFieldsProps={{ error: Boolean(error) }} />
            <Detail1 sx={{ color: "var(--danger-10)", height: "20px", marginTop: "8px" }}>
              {error}
            </Detail1>

            </Box>

            <Button type="submit" variant="contained" sx={{ marginTop: "20px" }}>
              Confirmar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
