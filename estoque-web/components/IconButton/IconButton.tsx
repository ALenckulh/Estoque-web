import React from "react";
import { 
  IconButton as MuiIconButton, 
  Tooltip, 
  IconButtonProps as MuiIconButtonProps 
} from "@mui/material";

interface IconButtonProps extends Omit<MuiIconButtonProps, 'children'> {
  tooltip: string;
  icon: React.ReactNode;
  
  /**
   * Posição do tooltip
   * @default "bottom"
   */
  tooltipPlacement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
}

export function IconButton({ 
  tooltip, 
  icon, 
  tooltipPlacement = "bottom",
  ...muiProps
}: IconButtonProps) {
  return (
    <Tooltip title={tooltip} placement={tooltipPlacement}>
      <MuiIconButton {...muiProps}>
        {icon}
      </MuiIconButton>
    </Tooltip>
  );
}