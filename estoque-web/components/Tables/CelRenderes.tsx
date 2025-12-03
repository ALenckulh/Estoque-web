import React, { useRef } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Tooltip } from "@mui/material";
import { Icon } from "@/components/ui/Icon";
import CopyTooltip from "../ui/CopyTooltip";

// 🔧 Centraliza o estilo do Tooltip para reuso
const defaultTooltipProps = {
  arrow: true,
  slotProps: {
    popper: {
      modifiers: [{ name: "offset", options: { offset: [0, -6] } }],
    },
  },
};

interface HasDisabled {
  disabled?: boolean;
  id?: string;
}

// 🔹 Tooltip para células
export const renderTooltip = (value?: string | null, tooltip?: string) => {
  const displayValue = !value || value === "" || value === "null" || value === "undefined" ? "-" : value;
  
  return (
    <Tooltip title={tooltip || ""} {...defaultTooltipProps}>
      <span className="ellipsis" style={{ display: "block", cursor: "default" }}>
        {displayValue}
      </span>
    </Tooltip>
  );
};

// 🔹 Tooltip para células com botão
export const renderActionButton = (children?: React.ReactNode, tooltip?: string) => (
  <Tooltip title={tooltip || ""} {...defaultTooltipProps}>
    <span className="ellipsis" style={{ display: "block", cursor: "default" }}>
      {children}
    </span>
  </Tooltip>
);

// 🔹 Célula com ícones e tooltip condicional
export const renderDisabledCellWithIcons = <
  T extends { disabled?: boolean; id?: string },
  V = unknown,
>(
  params: ICellRendererParams<T, V>,
  getTooltipMessage: (data: T) => string,
  currentUserId?: string
) => {
  const tooltipMessage = getTooltipMessage(params.data!);
  const rowId = params.data?.id;
  const showUserIconForCurrent = !!currentUserId && rowId === currentUserId;

  // 🔸 Define se o círculo deve aparecer e sua cor
  const showCircle = params.data?.disabled || showUserIconForCurrent;
  const circleColor = showUserIconForCurrent
    ? "var(--primary-0)"
    : "var(--neutral-40)";

  return (
    <Tooltip
      title={tooltipMessage}
      arrow
      disableHoverListener={!tooltipMessage}
      slotProps={{
        popper: {
          modifiers: [{ name: "offset", options: { offset: [0, -6] } }],
        },
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {showCircle && (
          <Icon
            name="Circle"
            size={13}
            style={{
              fill: circleColor,
              color: circleColor,
              position: "absolute",
              left: -8,
            }}
          />
        )}
        {String(params.value)}
      </span>
    </Tooltip>
  );
};

// 🔹 Célula de data
export const renderDateCell = (
  params: ICellRendererParams<HasDisabled, string | null | undefined>
) => {
  const { value } = params;
  if (!value) return <span>-</span>;

  return (
    <span style={{ color: "var(--neutral-90)" }}>
      {new Date(value).toLocaleDateString("pt-BR")}
    </span>
  );
};

// 🔹 Célula com tooltip de cópia
export const renderCopyTooltipCell = (
  params: ICellRendererParams<HasDisabled, string>
) => {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <CopyTooltip
      title={params.value || ""}
      arrow
      offset={[0, -6]}
      placement="bottom"
    >
      <span ref={ref} className="ellipsis" style={{ display: "block" }}>
        {params.value}
      </span>
    </CopyTooltip>
  );
};
