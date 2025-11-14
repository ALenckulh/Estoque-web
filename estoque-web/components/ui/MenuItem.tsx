import React from "react";
import { Icon } from "./Icon";
import { icons, LucideProps } from "lucide-react";
import MuiMenuItem from "@mui/material/MenuItem"; // 👈 importa o MenuItem do MUI

interface MenuItemProps extends LucideProps {
  children: React.ReactNode;
  icon?: keyof typeof icons;
  error?: boolean;
  onClick?: () => void;
  value?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  icon,
  value,
  error = false,
  onClick,
}) => {
  return (
    <MuiMenuItem
      value={value}
      onClick={onClick}
      sx={{
        color: error ? "var(--danger-10)" : "inherit",
        "&:hover": {
          backgroundColor: error
            ? "rgba(var(--danger-30-rgb), 0.1)"
            : "rgba(0,0,0,0.04)",
        },
      }}
    >
      {icon && <Icon name={icon} style={{ marginRight: 8, opacity: 0.6 }} />}
      {children}
    </MuiMenuItem>
  );
};

export default MenuItem;
