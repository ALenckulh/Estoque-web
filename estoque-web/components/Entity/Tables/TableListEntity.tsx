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
import { entityList } from "@/utils/dataBaseExample";
import { renderDateCell, renderIsDisabledCellWithIconAndTooltip, renderTooltip } from "@/components/Tables/CelRenderes";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface RowDataEntity {
  id: number;
  name: string;
  telephone: string;
  email: string;
  createdAt: string;
  address: string;
  disabled: boolean;
  description?: string;
}

export default function TableListEntity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rowData] = useState<RowDataEntity[]>(entityList);

  const [columnDefs] = useState<ColDef<RowDataEntity>[]>([
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
      cellRenderer: renderIsDisabledCellWithIconAndTooltip,
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
      headerName: "E-mail",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: { value: string | undefined; }) => renderTooltip(params.value),
    },
    {
      headerName: "Endereço",
      field: "address",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: { value: string | undefined; }) => renderTooltip(params.value),
    },
    {
      headerName: "Criado",
      field: "createdAt",
      sortable: true,
      filter: "agDateColumnFilter",
      width: 120,
      cellRenderer: renderDateCell,
    },
  ]);

  const handleRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      setLoading(true);
      router.push(`/entity/${event.data.id}`);
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
