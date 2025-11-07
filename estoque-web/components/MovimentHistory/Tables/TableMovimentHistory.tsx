"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { ICellRendererParams } from "ag-grid-community";
import { movimentHistoryList } from "@/utils/dataBaseExample";
import {
  renderCopyTooltipCell,
  renderDateCell,
  renderIdCell,
} from "@/components/Tables/CelRenderes";

// Registrar todos os módulos Community
ModuleRegistry.registerModules([AllCommunityModule]);

interface RowDataItem {
  groupId: number;
  fiscalNote: string;
  entityId: number;
  itemId: number;
  user: string;
  movimentDate: string;
  quantity: number;
  type: string;
  disabled?: boolean;
}

export default function TableHistoryEntity() {
  const [rowData] = useState<RowDataItem[]>(movimentHistoryList);

  const [columnDefs] = useState<ColDef<RowDataItem>[]>([
    {
      headerName: "ID do Grupo",
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
      cellRenderer: renderIdCell,
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
      headerName: "Data de movimentação",
      field: "movimentDate",
      sortable: true,
      filter: "agDateColumnFilter",
      flex: 1,
      minWidth: 160,
      cellRenderer: renderDateCell,
    },
    {
      headerName: "User responsável",
      field: "user",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 140,
      cellRenderer: renderCopyTooltipCell,
    },
    {
      headerName: "ID Entidade",
      minWidth: 120,
      field: "entityId",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
    },
    {
      headerName: "ID Item",
      field: "itemId",
      minWidth: 140,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: renderCopyTooltipCell,
    },
    {
      headerName: "Quantidade",
      field: "quantity",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
      minWidth: 120,
       cellRenderer: (params: ICellRendererParams) => {
    const data = params.data as { type?: string; quantity?: number };
    if (!data) return null;

    if (data.type === "saída") {
      return (
        <span style={{ color: "#E42D2D", fontWeight: "bold" }}>
          - {data.quantity}
        </span>
      );
    }

    return <span>{data.quantity}</span>;
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
      />
    </div>
  );
}
