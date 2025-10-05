"use client";

import {
  Button,
  TextField,
  Typography,
  Card,
  Checkbox,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Select,
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  Drawer,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import React from "react";
import { DateField } from "@/components/ui/DateField";
import AgGridExample from "@/components/TableExample/TableExample";
import { Icon } from "@/components/ui/Icon";
import { ToastContainer, useToast } from "@/components/ui/Toast/Toast";
import { IconButton } from "@/components/ui/IconButton";
import { PasswordField } from "@/components/ui/PasswordField";
import { Appbar } from "@/components/Appbar/appbar";

type Option = {
  label: string;
  value: string | number;
};

export default function DesignSystem() {
  const [valor, setValor] = useState<string | number>(""); // Select
  const [selectedOption, setSelectedOption] = useState<Option | null>(null); // Autocomplete
  const [date, setDate] = React.useState<Date | null>(null);
  const { toasts, showToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [anchorPopover, setAnchorPopover] = useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showTabs, setShowTabs] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const [password, setPassword] = useState("");

  const options: Option[] = [
    { label: "Opção 1", value: 1 },
    { label: "Opção 2", value: 2 },
    { label: "Opção 3", value: 3 },
  ];

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    setValor(event.target.value as string | number);
  };

  const [selectedTab, setSelectedTab] = useState("items");

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

          {/* Icon Button */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Icon Button
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <IconButton
              type="default"
              tooltip="Botão padrão"
              icon="Smile"
              onClick={() => {}}
            />
            <IconButton
              type="default"
              buttonProps={{ color: "secondary", variant: "contained" }}
              tooltip="Botão padrão"
              icon="Smile"
              onClick={() => {}}
            />
            <IconButton
              type="default"
              buttonProps={{ color: "error", variant: "outlined" }}
              tooltip="Botão padrão"
              icon="Smile"
              onClick={() => {}}
            />
            <IconButton
              type="default"
              buttonProps={{ disabled: true }}
              tooltip="Botão padrão"
              icon="Smile"
              onClick={() => {}}
            />
            <IconButton
              type="default"
              buttonProps={{ color: "success", variant: "outlined" }}
              tooltip="Botão padrão"
              icon="Smile"
              onClick={() => {}}
            />
          </Box>
        </Card>

        <Card sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            AppBar
          </Typography>
          <Divider />

          {/* Controles */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Button
              variant={showTabs ? "contained" : "outlined"}
              onClick={() => setShowTabs(!showTabs)}
            >
              {showTabs ? "Esconder Tabs" : "Mostrar Tabs"}
            </Button>

            <Button
              variant={showAvatar ? "contained" : "outlined"}
              onClick={() => setShowAvatar(!showAvatar)}
              color="secondary"
            >
              {showAvatar ? "Esconder Avatar" : "Mostrar Avatar"}
            </Button>
          </Box>

          {/* AppBar */}
          <Appbar
            showTabs={showTabs}
            showAvatar={showAvatar}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />

          {/* Status */}
          <Typography variant="body2" color="text.secondary">
            Tabs: {showTabs ? "Visível" : "Oculta"} | Avatar:{" "}
            {showAvatar ? "Visível" : "Oculta"}
          </Typography>
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
          <PasswordField
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* TextFieldArea */}
          <TextField 
            multiline
            rows={4}
            label="Textarea"
            placeholder="Digite sua descrição aqui..."
          />
        </Card>

        {/* Toasts*/}
        <Card sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Toast, Modal, Page aside e Popover
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
              mb: 4,
            }}
          >
            {/* Toast */}
            <ToastContainer toasts={toasts} />
            <Button
              variant="contained"
              color="success"
              onClick={() => showToast("Toast de Sucesso!", "success")}
            >
              Toast de Sucesso
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => showToast("Toast de Erro!", "error")}
            >
              Toast de Erro
            </Button>

            {/* Modal */}
            <Button variant="outlined" onClick={() => setOpenModal(true)}>
              Abrir Modal
            </Button>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
              <DialogTitle>Exemplo de Modal</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                  Conteúdo do modal aqui.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)}>Fechar</Button>
                <Button variant="contained">Salvar</Button>
              </DialogActions>
            </Dialog>

            {/* Popover */}
            <Button
              variant="outlined"
              onClick={(e) => setAnchorPopover(e.currentTarget)}
            >
              Abrir Popover
            </Button>
            <Popover
              open={Boolean(anchorPopover)}
              anchorEl={anchorPopover}
              onClose={() => setAnchorPopover(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: anchorPopover ? anchorPopover.clientWidth : "auto",
                    padding: 3,
                  },
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Typography>
            </Popover>

            {/* Page Aside */}
            <Button variant="outlined" onClick={() => setOpenDrawer(true)}>
              Abrir Page Aside
            </Button>
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Page Aside
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Typography>
            </Drawer>
          </Box>
        </Card>
        <Card sx={{ p: 2 }}>
          <AgGridExample />
        </Card>
      </Box>
    </Box>
  );
}
