"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowSelectedEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { api } from "@/utils/axios";
import { useUser } from "@/hooks/userHook";
import {
  renderDisabledCellWithIcons,
  renderTooltip,
} from "@/components/Tables/CelRenderes";
import { AG_GRID_LOCALE_PT_BR } from "@/utils/agGridLocalePtBr";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface RowDataItem {
  id: number;
  name: string;
  position: string;
  manufacturer: string;
  segment: string;
  group: string;
  quantity: number;
  alertQuantity: number;
  unit: string;
  disabled: boolean;
  description: string;
  createdAt: string;
}

interface TableListItemsProps {
  filters?: {
    group_id?: number;
    created_at?: string;
    unit_id?: number;
    safe_delete?: boolean;
    quantity?: "negativo" | "baixo" | "normal";
  };
}

export default function TableListItems({ filters }: TableListItemsProps) {
  const router = useRouter();
  const renderText = (value: any) => {
    const v = value == null || value === "" ? "-" : value;
    return renderTooltip(String(v));
  };
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<RowDataItem[]>([]);
  const { myUserEnterpriseId } = useUser();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!myUserEnterpriseId) return;
      try {
        // Monta os parâmetros de filtro
        const params: any = {};
        if (filters?.group_id) params.group_id = filters.group_id;
        if (filters?.created_at) params.created_at = filters.created_at;
        if (filters?.unit_id) params.unit_id = filters.unit_id;
        if (typeof filters?.safe_delete === "boolean") params.safe_delete = filters.safe_delete;
        if (typeof filters?.quantity === "string") params.quantity = filters.quantity;

        const resp = await api.get("/item/listItem", {
          headers: { "x-enterprise-id": String(myUserEnterpriseId) },
          params,
        });
        const items = resp?.data?.items || [];
        const mapped: RowDataItem[] = items.map((it: any) => ({
          id: Number(it.id ?? 0),
          name: String(it.name ?? ""),
          position: String(it.position ?? ""),
          manufacturer: String(it.manufacturer ?? ""),
          segment: String(it.segment_name ?? ""),
          group: String(it.group_name ?? ""),
          quantity: Number(it.quantity ?? 0),
          alertQuantity: Number(it.quantity_alert ?? 0),
          unit: String(it.unit_name ?? it.unit ?? ""),
          disabled: Boolean(it.safe_delete),
          description: String(it.description ?? ""),
          createdAt: String(it.created_at ?? ""),
        }));
        if (!cancelled) setRowData(mapped);
      } catch (err) {
        if (!cancelled) setRowData([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [myUserEnterpriseId, JSON.stringify(filters)]);

  const [columnDefs] = useState<ColDef<RowDataItem>[]>([
    {
      headerName: "ID",
      field: "id",
      sortable: true,
      width: 120,
      pinned: "left",
      filter: "agNumberColumnFilter",
      suppressMovable: true,
      lockPosition: "left",
      cellClassRules: { "cell-disabled": (params) => !!params.data?.disabled },
      cellRenderer: (params: ICellRendererParams<any, any>) =>
        renderDisabledCellWithIcons(params, (data) => {
          const messages = [];
          if (data.disabled) messages.push("Item está desativado");
          return messages.join("");
        }),
    },
    {
      headerName: "Nome",
      field: "name",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: { value: string | undefined }) =>
        renderText(params.value),
    },
    {
      headerName: "Posição",
      field: "position",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: { value: string | undefined }) =>
        renderText(params.value),
    },
    {
      headerName: "Fabricante",
      field: "manufacturer",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: { value: string | undefined }) =>
        renderText(params.value),
    },
    {
      headerName: "Segmento",
      field: "segment",
      sortable: true,
      flex: 1,
      filter: "agTextColumnFilter",
      minWidth: 180,
      cellRenderer: (params: { value: string | undefined }) =>
        renderText(params.value),
    },

    {
      headerName: "Quantidade",
      field: "quantity",
      sortable: true,
      pinned: "right",
      suppressMovable: true,
      lockPosition: "left",
      filter: "agNumberColumnFilter",
      width: 140,
      cellRenderer: (params: ICellRendererParams<RowDataItem>) => {
        const qty = params.value;
        const alert = params.data?.alertQuantity ?? 0;
        
        if (qty == null) return renderText("-");
        
        // Se quantidade < 0, usar vermelho
        if (qty < 0) {
          return (
            <span style={{ color: "var(--danger-10)" }}>
              {renderTooltip(String(qty))}
            </span>
          );
        }
        
        // Se quantidade > 0 e menor que alerta, usar laranja
        if (qty > 0 && qty < alert) {
          return (
            <span style={{ color: "var(--alert-10)" }}>
              {renderTooltip(String(qty))}
            </span>
          );
        }
        
        return renderText(String(qty));
      },
    },
  ]);

  const handleRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      setLoading(true);
      router.push(`/items/${event.data.id}`);
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="single"
        onRowSelected={handleRowSelected}
        colResizeDefault="shift"
        pagination
        paginationPageSize={20}
        theme={myTheme}
        enableCellTextSelection
        suppressDragLeaveHidesColumns
        paginationPageSizeSelector={false}
        localeText={AG_GRID_LOCALE_PT_BR}
        loadingOverlayComponent={() => {}}
      />

      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          zIndex={10000}
          sx={{ cursor: "wait" }}
        />
      )}
    </div>
  );
}
