import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import { Tooltip } from "@mui/material";
import { Icon } from "@/components/ui/Icon";
import CopyTooltip from "../ui/CopyTooltip";

export const renderTooltip = (value?: string) => (
  <Tooltip
    title={value || ""}
    arrow
    slotProps={{
      popper: {
        modifiers: [{ name: "offset", options: { offset: [0, -6] } }],
      },
    }}
  >
    <span className="ellipsis" style={{ display: "block" }}>
      {value}
    </span>
  </Tooltip>
);

export const renderIdCell = (params: ICellRendererParams<any, number>) => (
  <Tooltip
    title={params.data?.disabled ? "Grupo inativo" : ""}
    arrow
    disableHoverListener={!params.data?.disabled}
    slotProps={{
      popper: {
        modifiers: [{ name: "offset", options: { offset: [0, -6] } }],
      },
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {params.data?.disabled && (
        <Icon
          name="Circle"
          size={13}
          style={{
            fill: "var(--neutral-40)",
            color: "var(--neutral-40)",
            position: "absolute",
            left: -8,
          }}
        />
      )}
      {params.value}
    </span>
  </Tooltip>
);

export const renderDateCell = (params: ICellRendererParams<any, string | null | undefined>) => {
  if (!params.value) return <span>-</span>;
  const date = new Date(params.value);
  return <span style={{ color: "var(--neutral-90)" }}>{date.toLocaleDateString("pt-BR")}</span>;
};

export const renderCopyTooltipCell = (params: ICellRendererParams<any, string>) => {
  const spanRef = React.createRef<HTMLSpanElement>();

  return (
    <CopyTooltip
      title={params.value || ""}
      arrow
      offset={[0, -6]}
      placement="bottom"
    >
      <span ref={spanRef} className="ellipsis" style={{ display: "block" }}>
        {params.value}
      </span>
    </CopyTooltip>
  );
};