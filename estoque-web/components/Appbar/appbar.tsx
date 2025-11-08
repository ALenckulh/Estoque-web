"use client";

import React, { useState } from "react";
import { AppBar, Toolbar, Avatar, Menu, IconButton, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Tab } from "@/components/ui/Tab/Tab";
import MenuItem from "../ui/MenuItem";
import { useRouter } from "next/navigation";

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
    { id: "itens", label: "Itens", url: "/items" },
    { id: "entidade", label: "Entidades", url: "/entities" },
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

  const router = useRouter();

  const handleNavigate = (path?: string) => {
    setAnchorEl(null);
    if (path) router.push(path);
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
            src={"/stocky.svg"}
            alt={"Logo"}
            width={100}
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
            <IconButton onClick={handleOpenMenu} >
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
          >
            <MenuItem onClick={() => handleNavigate("/my-users")} icon="Users">
              Meus usuários
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/help")} icon={"MessageCircleQuestion"}>
              Ajuda
            </MenuItem>
            <MenuItem onClick={handleCloseMenu} icon="LogOut" error={true}>
              Sair
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
}