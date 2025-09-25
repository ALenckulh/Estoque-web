import React, { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { IconButton } from "./IconButton";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordField({
  label = "Senha",
  value,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);


  return (
    <TextField
      type={showPassword ? "text" : "password"}
      label={label}
      value={value}
      autoComplete="new-password"
      onChange={onChange}
      
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="circle"
                muiIconButtonProps={{ color: "secondary", size: "small" }}
                tooltip={showPassword ? "Ocultar senha" : "Mostrar senha"}
                icon={showPassword ? "EyeOff" : "Eye"}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputAdornment>
          ),
        },
      }}
      fullWidth
    />
  );
}
