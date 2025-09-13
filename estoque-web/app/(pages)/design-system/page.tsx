"use client"

import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Switch,
  Checkbox,
  Slider,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  List as MuiList,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material"
import { useState } from "react"
import { List } from "@phosphor-icons/react"

export default function DesignSystem() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  return (
    <Box
      sx={{
        bgcolor: "#f5f6fa",
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, md: 8 },
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </Box>
        </Card>

        {/* TextField */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Text Fields
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}>
            <TextField label="Nome" variant="outlined" />
            <TextField label="Email" variant="filled" />
            <TextField label="Senha" variant="standard" type="password" />
          </Box>
        </Card>

        {/* Card */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "#fff",
            gridColumn: { xs: "span 1", md: "span 2" },
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Card
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Card sx={{ maxWidth: 345, mx: "auto", boxShadow: 2 }}>
            <CardContent>
              <Typography gutterBottom variant="h6">
                Título
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exemplo de conteúdo dentro de um Card.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Ação 1</Button>
              <Button size="small">Ação 2</Button>
            </CardActions>
          </Card>
        </Card>

        {/* Inputs */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Inputs
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}>
            <Switch defaultChecked />
            <Checkbox defaultChecked />
            <Slider defaultValue={30} aria-label="Slider" />
          </Box>
        </Card>

        {/* AppBar com Menu */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "#fff",
            gridColumn: { xs: "span 1", md: "span 2" },
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            AppBar
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <AppBar position="static" sx={{ borderRadius: 2 }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <List />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => setAnchorEl(null)}>Item 1</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Item 2</MenuItem>
              </Menu>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                AppBar Demo
              </Typography>
            </Toolbar>
          </AppBar>
        </Card>

        {/* List */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            List
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <MuiList>
            <ListItem>
              <ListItemText primary="Item 1" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Item 2" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Item 3" />
            </ListItem>
          </MuiList>
        </Card>
      </Box>
    </Box>
  )
}