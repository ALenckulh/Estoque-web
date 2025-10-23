"use client";

import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowSelectedEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { Box } from "@mui/material";
import { usersList } from "@/utils/dataBaseExample";
import { useUser } from "@/hooks/userHook";
import {
  renderIsDisabledCellWithIconAndTooltip,
  renderIsDisabledCellWithTooltip,
} from "@/components/Tables/CelRenderes";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataUSer {
  id: string;
  user: string;
  email: string;
  is_admin: boolean;
  disabled: boolean;
}

export default function TableListUsers() {
  const [loading, setLoading] = useState(false);
  const [rowData] = useState<DataUSer[]>(usersList);
  const gridRef = useRef<AgGridReact<DataUSer>>(null);
  const { setFindUserId } = useUser();

  const [columnDefs] = useState<ColDef<DataUSer>[]>([
    {
      headerName: "ID",
      field: "id",
      hide: true,
    },

    {
      headerName: "Usuário",
      field: "user",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellClassRules: { "cell-disabled": (params) => !!params.data?.disabled },
      cellRenderer: (
        params: ICellRendererParams<DataUSer, string | undefined>
      ) =>
        renderIsDisabledCellWithIconAndTooltip(params, (data) =>
          data.disabled ? `Usuário está desativado` : ""
        ),
    },
    {
      headerName: "E-mail",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 180,
      cellClassRules: { "cell-disabled": (params) => !!params.data?.disabled },
      cellRenderer: (
        params: ICellRendererParams<DataUSer, string | undefined>
      ) =>
        params.data?.disabled
          ? renderIsDisabledCellWithTooltip(
              params.value,
              `Usuário está desativado`
            )
          : params.value,
    },
    {
      headerName: "Permissões",
      field: "is_admin",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 180,
      cellClassRules: { "cell-disabled": (params) => !!params.data?.disabled },
      cellRenderer: (
        params: ICellRendererParams<DataUSer, boolean | undefined>
      ) =>
        params.data?.disabled
          ? renderIsDisabledCellWithTooltip(
              params.value ? "Admin" : "Default",
              `Usuário está desativado`
            )
          : params.value
            ? "Admin"
            : "Default",
    },
  ]);

const handleRowSelected = (event: RowSelectedEvent<DataUSer>) => {
  const rowData = event.data;

  if (rowData?.disabled) {
    return;
  }

  setLoading(true);
  setFindUserId?.(rowData?.id ?? null);
  setLoading(false);

  event.node.setSelected(false);
};

  return (
    <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        ref={gridRef}
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
