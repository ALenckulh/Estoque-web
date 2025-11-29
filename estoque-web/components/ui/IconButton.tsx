import React from "react";
import {
  Tooltip,
  IconButton as MuiIconButton,
  Button,
  ButtonProps,
  IconButtonProps as MuiIconButtonProps,
  TooltipProps,
} from "@mui/material";
import { Icon } from "./Icon";
import { icons } from "lucide-react";

interface IconButtonProps {
  type?: "circle" | "default";
  tooltip: string;
  icon: keyof typeof icons;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  buttonProps?: Partial<ButtonProps>;
  muiIconButtonProps?: Partial<MuiIconButtonProps>;
  tooltipProps?: Omit<TooltipProps, "title" | "children">;
}

export const IconButton: React.FC<IconButtonProps> = ({
  type = "default",
  tooltip,
  icon,
  onClick,
  buttonProps,
  muiIconButtonProps,
  tooltipProps,
}) => {
  return (
    <Tooltip title={tooltip} {...tooltipProps}>
      {type === "default" ? (
        <Button
          sx={{ minWidth: 0, width: 40, height: 40, padding: 0 }}
          onClick={onClick}
          {...buttonProps}
        >
          <Icon name={icon} />
        </Button>
      ) : (
        <MuiIconButton onClick={onClick} color="primary" {...muiIconButtonProps}>
          <Icon name={icon} />
        </MuiIconButton>
      )}
    </Tooltip>
  );
};
