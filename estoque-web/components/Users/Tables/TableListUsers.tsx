"use client";

import React, { useState, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowSelectedEvent,
  ICellRendererParams,
  RowClassParams,
  RowStyle,
} from "ag-grid-community";
import { Box } from "@mui/material";
import { myTheme } from "@/app/theme/agGridTheme";
import { usersList } from "@/utils/dataBaseExample";
import { useUser } from "@/hooks/userHook";
import {
  renderTooltip,
  renderDisabledCellWithIcons,
} from "@/components/Tables/CelRenderes";
import { IconButton } from "@/components/ui/IconButton";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataUser {
  id: string;
  user: string;
  email: string;
  is_admin: boolean;
  disabled: boolean;
}

export default function TableListUsers() {
  const [loading, setLoading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [rowData] = useState<DataUser[]>(usersList);
  const gridRef = useRef<AgGridReact<DataUser>>(null);
  const { setFindUserId, myUserId, setOpenModalInactive, setOpenModalActive } = useUser();

  const getRowStyle = (
    params: RowClassParams<DataUser>
  ): RowStyle | undefined => {
    if (params.data && params.data.id === myUserId) {
      return { fontWeight: 700 } as RowStyle;
    }
    return undefined;
  };

  // Garante que o usuário atual apareça no topo
  const displayedRows = useMemo(() => {
    const currentUser = rowData.find((r) => r.id === myUserId);
    return currentUser
      ? [currentUser, ...rowData.filter((r) => r.id !== myUserId)]
      : rowData;
  }, [rowData, myUserId]);

  // Definições de colunas
  const columnDefs = useMemo<ColDef<DataUser>[]>(
    () => [
      { headerName: "ID", field: "id", hide: true },
      {
        headerName: "Usuário",
        field: "user",
        minWidth: 180,
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        cellClassRules: { "cell-disabled": (p) => !!p.data?.disabled },
        cellRenderer: (params: ICellRendererParams<any, any>) =>
          renderDisabledCellWithIcons(
            params,
            (data) => {
              const messages = [];
              if (data.disabled) messages.push("Usuário está desativado");
              if (data.id === myUserId)
                messages.push("Este é o seu usuário atual");
              return messages.join("");
            },
            myUserId ?? undefined
          ),
      },
      {
        headerName: "E-mail",
        field: "email",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        cellClassRules: { "cell-disabled": (p) => !!p.data?.disabled },
        cellRenderer: (params: {
          data: { disabled: boolean; id: string };
          value: string;
        }) =>
          params.data?.disabled
            ? renderTooltip(params.value, "Usuário está desativado")
            : params.data.id === myUserId
              ? renderTooltip(params.value, "Este é o seu usuário atual")
              : params.value,
      },
      {
        headerName: "Permissões",
        field: "is_admin",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        cellClassRules: { "cell-disabled": (p) => !!p.data?.disabled },
        cellRenderer: (params: {
          data: { disabled: boolean; id: string };
          value: string;
        }) =>
          params.data?.disabled
            ? renderTooltip(
                params.value ? "Admin" : "Default",
                "Usuário está desativado"
              )
            : params.data.id === myUserId
              ? renderTooltip(
                  params.value ? "Admin" : "Default",
                  "Este é o seu usuário atual"
                )
              : params.value
                ? "Admin"
                : "Default",
      },
      {
        headerName: "Actions",
        sortable: true,
        width: 80,
        cellRenderer: (params: { data: { disabled: boolean } }) => {
          const disabled = params.data.disabled;
          return (
            <IconButton
              icon={ disabled ? "SquareCheck" : "Trash" }
              buttonProps={{ variant: "text", color: disabled ? "success" : "error" }}
              tooltip={ disabled ? "Ativar usuário" : "Inativar usuário" }
              onClick={() => {
                if (disabled) {
                  setOpenModalActive(true);
                  setIsButtonClicked(true);
                } else {
                  setOpenModalInactive(true);
                  setIsButtonClicked(true);
                }
              }}
            />
          );
        },
      },
    ],
    [myUserId]
  );

  const handleRowSelected = (event: RowSelectedEvent<DataUser>) => {
    const row = event.data;
    if (!row || row.disabled || isButtonClicked) return;

    setLoading(true);
    setFindUserId?.(row.id);
    setLoading(false);
    event.node.setSelected(false);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={displayedRows}
        columnDefs={columnDefs}
        getRowStyle={getRowStyle}
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
