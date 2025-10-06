import { Box, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { Detail4 } from "./Typograph";
import { Icon } from "./Icon";

interface CopyTooltipProps {
  title: string;
  children: React.ReactNode;
  placement?: 
    | "bottom"
    | "top"
    | "left"
    | "right"
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  offset?: [0, 0] | [0, -6];
  arrow?: boolean;
}

export function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

export default function CopyTooltip({
  title,
  children,
  placement = "bottom-start",
  offset = [0, 0], // default [0,0]
  arrow = true,
}: CopyTooltipProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    copyToClipboard(title);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Tooltip
      placement={placement}
      arrow={arrow}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: { offset },
            },
          ],
        },
      }}
      title={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            name={copied ? "Check" : "Copy"}
            style={{
              paddingRight: "4px",
              color: copied ? "var(--success-10)" : "var(--neutral-40)",
              transition: "color 0.3s ease",
            }}
          />
          <Detail4 sx={{ color: "var(--neutral-0)" }}>{title}</Detail4>
        </Box>
      }
    >
      <span onClick={handleClick} style={{ cursor: "pointer" }}>
        {children}
      </span>
    </Tooltip>
  );
}