"use client";

import React, { useState } from "react";
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
import { Box, Tooltip } from "@mui/material";
import { Icon } from "@/components/ui/Icon";
import { itemList } from "@/utils/dataBaseExample";
import { renderDateCell, renderIdCell, renderTooltip } from "@/components/Tables/CelRenderes";

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
  const [loading, setLoading] = useState(false);
  const [rowData] = useState<RowDataItem[]>(itemList);

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
      cellRenderer: renderIdCell,
    },
    {
      headerName: "Nome",
      field: "name",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: { value: string | undefined; }) => renderTooltip(params.value),
    },
    {
      headerName: "Posição",
      field: "position",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: { value: string | undefined; }) => renderTooltip(params.value),
    },
    {
      headerName: "Fabricante",
      field: "manufacturer",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: { value: string | undefined; }) => renderTooltip(params.value),
    },
    {
      headerName: "Segmento",
      field: "segment",
      sortable: true,
      filter: "agTextColumnFilter",
      width: 120,
      cellRenderer: (params: { value: string | undefined }) => renderTooltip(params.value),
    },

    {
      headerName: "Quantidade",
      field: "quantity",
      sortable: true,
      filter: "agTextColumnFilter",
      width: 120,
      cellRenderer: (params: { value: string | undefined }) => renderTooltip(params.value),
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
