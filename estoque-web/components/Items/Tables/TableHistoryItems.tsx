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
import { itemHistoryList } from "@/utils/dataBaseExample";
import {
  renderCopyTooltipCell,
  renderDateCell,
  renderDisabledCellWithIcons,
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

export default function TableHistoryEntity() {
  const [rowData] = useState<RowDataItem[]>(itemHistoryList);


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
    },
    {
      headerName: "Item ID",
      minWidth: 120,
      field: "itemId",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
    },
    {
      headerName: "Nome do Item",
      field: "itemName",
      minWidth: 140,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: renderCopyTooltipCell,
    },
    {
      headerName: "Responsável",
      field: "user",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 140,
      cellRenderer: renderCopyTooltipCell,
    },
    {
      headerName: "Data",
      field: "date",
      sortable: true,
      filter: "agDateColumnFilter",
      flex: 1,
      minWidth: 140,
      cellRenderer: renderDateCell,
    },
    {
      headerName: "Quantidade",
      field: "quantity",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: ICellRendererParams) => {
        const data = params.data as { type?: string; quantity?: number } | undefined;
        const raw = params.value ?? data?.quantity;
        if (raw === undefined || raw === null) return <span>-</span>;
        const n = Number(raw);
        if (!Number.isFinite(n)) return <span>{String(raw)}</span>;

        // If quantity is negative, highlight in danger color
        if (n < 0) {
          return <span style={{ color: "var(--danger-0)" }}>{n}</span>;
        }

        return (
          <div style={{ paddingLeft: "10px" }}>
            <span>{n}</span>
          </div>
        );
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
