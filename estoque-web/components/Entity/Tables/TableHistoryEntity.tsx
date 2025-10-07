"use client";

import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { useRouter } from "next/navigation";
import { ICellRendererParams } from "ag-grid-community";
import { Tooltip } from "@mui/material";
import { Icon } from "@/components/ui/Icon";
import CopyTooltip from "@/components/ui/CopyTooltip";
import { historyList } from "@/utils/dataBaseExample";
import {
  renderCopyTooltipCell,
  renderDateCell,
  renderIdCell,
} from "@/components/Tables/CelRenderes";

// Registrar todos os módulos Community
ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  groupId: number;
  fiscalNote: string;
  itemId: number;
  itemName: string;
  user: string;
  date: string; //data e hora
  quantity: number;
  disabled?: boolean;
}

export default function TableHistoryEntity() {
  const [rowData] = useState<RowData[]>(historyList);

  const [columnDefs] = useState<ColDef<RowData>[]>([
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
      minWidth: 160,
      cellRenderer: renderDateCell,
    },
    {
      headerName: "Quantidade",
      field: "quantity",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
      minWidth: 120,
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
