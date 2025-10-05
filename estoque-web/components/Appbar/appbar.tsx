import React, { useState } from "react";
import { AppBar, Toolbar, Avatar, Menu, IconButton, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Tab } from "@/components/ui/Tab/Tab";
import MenuItem from "../ui/MenuItem";

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
}

export function Appbar({
  showTabs = true,
  showAvatar = true,
  tabItems = [
    { id: "itens", label: "Itens", url: "" },
    { id: "entidade", label: "Entidades", url: "/entity" },
    { id: "historico", label: "Histórico", url: "" },
  ],
  selectedTab = "itens",
  onTabChange,
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
    <AppBar position="fixed" color="default">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Link href="/" passHref style={{ height: 30 }}>
          <Image
            src={"/estoqueWeb.svg"}
            alt={"Logo"}
            width={200}
            height={30}
            style={{ cursor: "pointer" }}
          />
        </Link>

        {/* Tabs e Avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexShrink: 0,
          }}
        >
          {showTabs && (
            <Tab
              items={tabItems}
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
            />
          )}

          {/* Avatar */}
          {showAvatar && (
            <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
              <Avatar>
                <Icon name="User" size={26} strokeWidth={1.3} />
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
            }}
          >
            <MenuItem onClick={handleCloseMenu} icon="User">
              Gerenciar conta
            </MenuItem>
            <MenuItem onClick={handleCloseMenu} icon="Users">
              Gerenciar usuários
            </MenuItem>
            <MenuItem onClick={handleCloseMenu} icon="LogOut" error={true}>
              Sair da conta
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
}