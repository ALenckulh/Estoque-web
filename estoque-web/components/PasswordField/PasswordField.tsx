import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { IconButton } from "@/components/IconButton/IconButton";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordField({ label = "Senha", value, onChange }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      label={label}
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              tooltip={showPassword ? "Ocultar senha" : "Mostrar senha"}
              icon={showPassword ? <EyeOff /> : <Eye />}
              onClick={() => setShowPassword(!showPassword)}
            />
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  );
}
