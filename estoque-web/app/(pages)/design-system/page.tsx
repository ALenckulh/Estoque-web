"use client";

import {
  Button,
  TextField,
  Typography,
  Card,
  Checkbox,
  IconButton,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Select,
  InputAdornment,
  Fade,
} from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { DateField } from "@/components/ui/date-field";
import { ToastBar } from "@/components/ui/ToastBar/ToastBar";
import { Icon } from "@/components/ui/Icon/Icon";
import { Tab } from "@/components/ui/Tab/Tab";
import { url } from "inspector";

type Option = {
  label: string;
  value: string | number;
};

type ToastType = {
  id: number;
  type: "success" | "error";
  message: string;
  show: boolean;
};

export default function DesignSystem() {
  const [valor, setValor] = useState<string | number>(""); // Select
  const [selectedOption, setSelectedOption] = useState<Option | null>(null); // Autocomplete
  const [date, setDate] = React.useState<Date | null>(null);
  const [password, setPassword] = useState<string>(""); // PasswordField
  const [showPassword, setShowPassword] = React.useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const options: Option[] = [
    { label: "Opção 1", value: 1 },
    { label: "Opção 2", value: 2 },
    { label: "Opção 3", value: 3 },
  ];

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    setValor(event.target.value as string | number);
  };

  const [selectedTab, setSelectedTab] = useState("items");

  const tabItems = [
    { id: "items", label: "Itens", url: "" },
    { id: "products", label: "Produtos", url: "" },
    { id: "categories", label: "Categorias", url: "" },
  ];

  const showToast = (type: "success" | "error") => {
    const id = Date.now();
    const message =
      type === "success"
        ? "Operação realizada com sucesso!"
        : "Ocorreu um erro na operação.";

    // Adiciona o toast com show: true para animação de entrada
    setToasts((prev) => [...prev, { id, type, message, show: true }]);

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
      // Primeiro esconde o toast com animação
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, show: false } : toast
        )
      );

      // Depois de dar tempo para a animação de saída, remove completamente
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 300); // Tempo da animação de saída
    }, 3000);
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f6fa",
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, md: 8 },
        position: "relative",
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ fontWeight: 700, color: "#2d3436", mb: 4 }}
      >
        MUI Components Preview
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {/* Buttons */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Buttons
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Primary Color */}
          <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
            Primary Color
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <Button variant="text" startIcon={<Icon name="Smile" />}>
              Text
            </Button>
            <Button variant="outlined" startIcon={<Icon name="Smile" />}>
              Outlined
            </Button>
            <Button variant="contained" startIcon={<Icon name="Smile" />}>
              Contained
            </Button>
          </Box>

          {/* Secondary Color */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Secondary Color
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <Button
              variant="text"
              color="secondary"
              startIcon={<Icon name="Smile" />}
            >
              Text
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Icon name="Smile" />}
            >
              Outlined
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Icon name="Smile" />}
            >
              Contained
            </Button>
          </Box>

          {/* Success Color */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Success Color
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <Button
              variant="text"
              color="success"
              startIcon={<Icon name="Smile" />}
            >
              Text
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<Icon name="Smile" />}
            >
              Outlined
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Icon name="Smile" />}
            >
              Contained
            </Button>
          </Box>

          {/* Error Color */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Error Color
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <Button
              variant="text"
              color="error"
              startIcon={<Icon name="Smile" />}
            >
              Text
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Icon name="Smile" />}
            >
              Outlined
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Icon name="Smile" />}
            >
              Contained
            </Button>
          </Box>

          {/* Disabled States */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Disabled States
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <Button variant="text" disabled startIcon={<Icon name="Smile" />}>
              Text
            </Button>
            <Button
              variant="outlined"
              disabled
              startIcon={<Icon name="Smile" />}
            >
              Outlined
            </Button>
            <Button
              variant="contained"
              disabled
              startIcon={<Icon name="Smile" />}
            >
              Contained
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Icon Button
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <IconButton color="primary">
              <Icon name="Smile" />
            </IconButton>
            <Button
              sx={{ minWidth: 0, width: 40, padding: 0 }}
              color="primary"
              variant="outlined"
            >
              <Icon name="Smile" />
            </Button>
            <Button
              sx={{ minWidth: 0, width: 40, padding: 0 }}
              color="primary"
              variant="contained"
            >
              <Icon name="Smile" />
            </Button>
          </Box>
        </Card>

        <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Inputs
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {/* Checkbox */}
          <Box sx={{ width: "fit-content" }}>
            <Checkbox />
          </Box>

          {/* TextField */}
          <TextField label="Standard" variant="outlined" />

          {/* Select */}
          <FormControl style={{ minWidth: 300 }}>
            <InputLabel id="demo-label">Escolha uma opção</InputLabel>
            <Select
              labelId="demo-label"
              value={valor}
              label="Escolha uma opção"
              onChange={handleChange}
            >
              <MenuItem value={1}>Opção 1</MenuItem>
              <MenuItem value={2}>Opção 2</MenuItem>
            </Select>
          </FormControl>

          {/* Autocomplete */}
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            value={selectedOption}
            onChange={(_, newValue) => setSelectedOption(newValue)}
            isOptionEqualToValue={(option, val) => option.value === val?.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Escolha uma opção"
                placeholder="Selecione..."
                variant="outlined"
                size="small"
              />
            )}
          />

          {/* DatePicker */}
          <DateField
            label="Data de término"
            value={date}
            onChange={(newDate) => setDate(newDate)}
          />

          {/* PasswordField */}
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Senha"
            value={password}
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <Icon name="Smile" />
                      ) : (
                        <Icon name="Smile" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            multiline
            rows={4}
            label="Textarea"
            placeholder="Digite sua descrição aqui..."
          />
        </Card>

        {/* Container para os toasts (fixo no topo) */}
        <Box
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {toasts.map((toast) => (
            <Fade
              key={toast.id}
              in={toast.show}
              timeout={300} // Duração da animação
              mountOnEnter
              unmountOnExit
            >
              <div>
                <ToastBar type={toast.type}>{toast.message}</ToastBar>
              </div>
            </Fade>
          ))}
        </Box>

        {/* Toasts*/}
        <Card sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Toast
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => showToast("success")}
            >
              Toast de Sucesso
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => showToast("error")}
            >
              Toast de Erro
            </Button>
          </Box>
        </Card>

        <Card sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Tab
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Tab
            items={tabItems}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </Card>
      </Box>
    </Box>
  );
}
