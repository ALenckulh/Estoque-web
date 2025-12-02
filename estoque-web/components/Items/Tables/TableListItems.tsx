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

export default function TableListItems() {
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
        const resp = await api.get("/item/listItem", {
          headers: { "x-enterprise-id": String(myUserEnterpriseId) },
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
  }, [myUserEnterpriseId]);

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
      cellRenderer: (params: { value: number | undefined }) =>
        renderText(
          params.value == null ? "-" : String(params.value)
        ),
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
