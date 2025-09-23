import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  alpha,
  Box,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Tab } from "@/components/ui/Tab/Tab";
import { palette } from "@/app/theme/palette";

interface TabItem {
  id: string;
  label: string;
  url: string;
}

interface AppbarProps {
  showTabs?: boolean;
  showAvatar?: boolean;
  tabItems?: TabItem[];
  selectedTab?: string;
  onTabChange?: (tabId: string) => void;
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export function Appbar({
  showTabs = true,
  showAvatar = true,
  tabItems = [
    { id: "itens", label: "Itens", url: "" },
    { id: "entidade", label: "Entidades", url: "" },
    { id: "historico", label: "Histórico", url: "" },
  ],
  selectedTab = "itens",
  onTabChange,
  logoUrl = "/estoqueWeb.svg",
  logoAlt = "Logo",
  logoWidth = 200,
  logoHeight = 30,
}: AppbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <AppBar position="static" color="default">
      <Box
        sx={{
          width: '100%',
          maxWidth: '1392px',
          margin: '0 auto',
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "48px",
            padding: "0 24px",
            gap: "20px",
            boxSizing: 'border-box',
          }}
        >
          {/* Logo */}
          <Box sx={{ flexShrink: 0 }}>
            <Link href="/" passHref style={{ height: logoHeight, display: 'block' }}>
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                style={{ cursor: "pointer" }}
              />
            </Link>
          </Box>

          {/* Tabs e Avatar */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '20px',
            flexShrink: 0,
          }}>
            {showTabs && (
              <Tab
                items={tabItems}
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
              />
            )}

            {/* Avatar */}
            {showAvatar && (
              <IconButton 
                onClick={handleOpenMenu} 
                sx={{ p: 0 }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <Icon name="User" size={20} strokeWidth={1.3} />
                </Avatar>
              </IconButton>
            )}
          </Box>

          {/* Menu Dropdown */}
          {showAvatar && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                mt: 1,
                '& .MuiPaper-root': {
                  width: '300px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  '& .MuiList-root': {
                    padding: '0',
                  },
                },
              }}
            >
              <MenuItem 
                onClick={handleCloseMenu}
                sx={{
                  height: '47px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '0',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Icon name="User" size={18} />
                Gerenciar conta
              </MenuItem>
              <MenuItem 
                onClick={handleCloseMenu}
                sx={{
                  height: '47px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '0',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Icon name="Users" size={18} />
                Gerenciar usuários
              </MenuItem>
              <MenuItem
                onClick={handleCloseMenu}
                sx={{
                  height: '47px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '0',
                  color: "error.main",
                  '&:hover': {
                    backgroundColor: alpha(palette.error.light, 0.1),
                  },
                }}
              >
                <Icon name="LogOut" size={18} />
                Sair da conta
              </MenuItem>
            </Menu>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default Appbar;