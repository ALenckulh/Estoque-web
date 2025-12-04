"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
} from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { api } from "@/utils/axios";
import {
  renderCopyTooltipCell,
  renderDateCell,
  renderDisabledCellWithIcons,
  renderTooltip,
} from "@/components/Tables/CelRenderes";
import { AG_GRID_LOCALE_PT_BR } from "@/utils/agGridLocalePtBr";

// Registrar todos os módulos Community
ModuleRegistry.registerModules([AllCommunityModule]);


interface RowDataItem {
  groupId: number;
  fiscalNote: string;
  itemId: number;
  itemName: string;
  user: string;
  date: string;
  quantity: number;
  disabled?: boolean;
}

interface TableHistoryItemsProps {
  itemId: string | number;
  filters?: {
    safe_delete?: boolean;
    type?: "entrada" | "saida";
  };
}


export default function TableHistoryItems({ itemId, filters }: TableHistoryItemsProps) {
  const [rowData, setRowData] = useState<RowDataItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!itemId) return;
      try {
        const params: any = { id: itemId };
        if (typeof filters?.safe_delete === "boolean") params.safe_delete = filters.safe_delete;
        if (filters?.type) params.type = filters.type;

        const resp = await api.get("/movement/list-item-movements", { params });
        const movements = resp?.data?.historico_movimentacao || [];
        const mapped: RowDataItem[] = movements.map((m: any) => ({
          groupId: Number(m.id_grupo ?? 0),
          fiscalNote: String(m.nota_fiscal ?? ""),
          itemId: Number(m.item_id ?? 0),
          itemName: String(m.item_name ?? ""),
          user: String(m.usuario_responsavel ?? ""),
          date: String(m.data_movimentacao ?? ""),
          quantity: Number(m.quantidade_movimentada ?? 0),
          disabled: Boolean(m.safe_delete),
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
  }, [itemId, JSON.stringify(filters)]);


  const [columnDefs] = useState<ColDef<RowDataItem>[]>([
    {
      headerName: "Grupo ID",
      field: "groupId",
      sortable: true,
      width: 120,
      pinned: "left",
      filter: "agNumberColumnFilter",
      suppressMovable: true,
      lockPosition: "left",
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled,
      },
      cellRenderer: (params: ICellRendererParams<any, any>) =>
        renderDisabledCellWithIcons(params, (data) => {
          const messages = [];
          if (data.disabled) messages.push("Movimentação está desativada");
          return messages.join("");
        }),
    },
    {
      headerName: "Nota Fiscal",
      minWidth: 140,
      field: "fiscalNote",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled,
      },
      cellRenderer: (params: ICellRendererParams<RowDataItem>) => {
        const tooltip = params.data?.disabled ? "Movimentação está desativada" : "";
        return renderTooltip(String(params.value ?? "-"), tooltip);
      },
    },
    {
      headerName: "Item ID",
      minWidth: 120,
      field: "itemId",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled,
      },
      cellRenderer: (params: ICellRendererParams<RowDataItem>) => {
        const tooltip = params.data?.disabled ? "Movimentação está desativada" : "";
        return renderTooltip(String(params.value ?? "-"), tooltip);
      },
    },
    {
      headerName: "Nome do Item",
      field: "itemName",
      minWidth: 140,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: renderCopyTooltipCell,
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled,
      },
    },
    {
      headerName: "Responsável",
      field: "user",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 140,
      cellRenderer: renderCopyTooltipCell,
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled,
      },
    },
    {
      headerName: "Data",
      field: "date",
      sortable: true,
      filter: "agDateColumnFilter",
      flex: 1,
      minWidth: 140,
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled,
      },
      cellRenderer: (params: ICellRendererParams<RowDataItem>) => {
        const { value, data } = params;
        const tooltip = data?.disabled ? "Movimentação está desativada" : "";
        
        if (!value) return renderTooltip("-", tooltip);
        
        const formattedDate = new Date(value).toLocaleDateString("pt-BR");
        return renderTooltip(formattedDate, tooltip);
      },
    },
    {
      headerName: "Quantidade",
      field: "quantity",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
      minWidth: 120,
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled,
      },
      cellRenderer: (params: ICellRendererParams<RowDataItem>) => {
        const data = params.data as { disabled?: boolean; type?: string; quantity?: number } | undefined;
        const raw = params.value ?? data?.quantity;
        const tooltip = data?.disabled ? "Movimentação está desativada" : "";
        
        if (raw === undefined || raw === null) return renderTooltip("-", tooltip);
        const n = Number(raw);
        if (!Number.isFinite(n)) return renderTooltip(String(raw), tooltip);

        // If quantity is negative, highlight in danger color
        if (n < 0) {
          return <span style={{ color: "var(--danger-0)" }}>{renderTooltip(String(n), tooltip)}</span>;
        }

        return renderTooltip(String(n), tooltip);
      },
    },
  ]);

  return (
    <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="single"
        colResizeDefault="shift"
        pagination={true}
        paginationPageSize={20}
        theme={myTheme}
        enableCellTextSelection={true}
        suppressDragLeaveHidesColumns={true}
        paginationPageSizeSelector={false}
        localeText={AG_GRID_LOCALE_PT_BR}
        loadingOverlayComponent={() => {}}
      />
    </div>
  );
}
