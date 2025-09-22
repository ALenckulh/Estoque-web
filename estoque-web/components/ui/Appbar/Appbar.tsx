import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Avatar,
  Typography,
  Box,
  styled
} from "@mui/material";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

// Estilização personalizada para o Toolbar
const StyledToolbar = styled(Toolbar)({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  width: "100%",
  gap: "20px"
});

// Interface para as props do componente
interface AppbarProps {
  /**
   * Controla se mostra as tabs (Itens, Entidade, Histórico)
   * @default true
   */
  showTabs?: boolean;
  
  /**
   * Controla se mostra o avatar do usuário
   * @default true
   */
  showAvatar?: boolean;
  
  /**
   * Nome do usuário para o avatar
   * @default "User"
   */
  userName?: string;
  
  /**
   * URL da imagem do avatar
   * @default "/avatar.png"
   */
  userAvatar?: string;
}

export function Appbar({ 
  showTabs = true, 
  showAvatar = true,
  userName = "User",
  userAvatar = "/avatar.png"
}: AppbarProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ backgroundColor: "white", color: "black" }}
    >
      <StyledToolbar>
        {/* Logo e título à esquerda */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ViewInArIcon />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ESTOQUE WEB
          </Typography>
        </Box>

        {/* Tabs deslocadas para a direita (apenas se showTabs for true) */}
        {showTabs && (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            width: "90%",
            marginRight: "20px"
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Itens" />
              <Tab label="Entidade" />
              <Tab label="Histórico" />
            </Tabs>
          </Box>
        )}

        {/* Avatar alinhado à direita (apenas se showAvatar for true) */}
        {showAvatar && (
          <Box>
            <Avatar alt={userName} src={userAvatar} />
          </Box>
        )}
      </StyledToolbar>
    </AppBar>
  );
}