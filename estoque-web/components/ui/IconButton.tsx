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
  disabled?: boolean;
  buttonProps?: Partial<ButtonProps>;
  muiIconButtonProps?: Partial<MuiIconButtonProps>;
  tooltipProps?: Omit<TooltipProps, "title" | "children">;
}

export const IconButton: React.FC<IconButtonProps> = ({
  type = "default",
  tooltip,
  icon,
  onClick,
  disabled,
  buttonProps,
  muiIconButtonProps,
  tooltipProps,
}) => {
  const isDisabled = Boolean(
    disabled ?? buttonProps?.disabled ?? muiIconButtonProps?.disabled
  );

  const handleClick = isDisabled ? undefined : onClick;

  const content =
    type === "default" ? (
      <Button
        sx={{ minWidth: 0, width: 40, height: 40, padding: 0 }}
        disabled={isDisabled}
        onClick={handleClick}
        {...buttonProps}
      >
        <Icon name={icon} />
      </Button>
    ) : (
      <MuiIconButton
        color="primary"
        disabled={isDisabled}
        onClick={handleClick}
        {...muiIconButtonProps}
      >
        <Icon name={icon} />
      </MuiIconButton>
    );

  return (
    <Tooltip title={tooltip} {...tooltipProps}>
      <span style={{ display: "inline-flex", lineHeight: 0 }}>{content}</span>
    </Tooltip>
  );
};
