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
import { Loading } from "@/components/Feedback/Loading";
import { myTheme } from "@/app/theme/agGridTheme";
import { useUser } from "@/hooks/userHook";
import {
  renderTooltip,
  renderDisabledCellWithIcons,
} from "@/components/Tables/CelRenderes";
import { IconButton } from "@/components/ui/IconButton";
import { AG_GRID_LOCALE_PT_BR } from "@/utils/agGridLocalePtBr";
import { api } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataUser {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  safe_delete: boolean;
}

interface TableListUsersProps {
  filters?: {
    safe_delete?: boolean;
  };
}

export default function TableListUsers({ filters }: TableListUsersProps) {
  const [loading, setLoading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const gridRef = useRef<AgGridReact<DataUser>>(null);
  const {
    setFoundUserId,
    myUserId,
    myUserEnterpriseId,
    setOpenDialog,
    OpenDialog,
    setFoundUserDisabled,
    setEditDrawerOpen,
  } = useUser();

  const { data: rowData = [], refetch } = useQuery({
    queryKey: ["users", myUserEnterpriseId, JSON.stringify(filters)],
    queryFn: async () => {
      if (!myUserEnterpriseId) return [];
      const params: any = { enterprise_id: myUserEnterpriseId };
      if (typeof filters?.safe_delete === "boolean") params.safe_delete = filters.safe_delete;
      const response = await api.get("/user/listUser", { params });
      return response.data.users as DataUser[];
    },
    enabled: !!myUserEnterpriseId,
  });

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
        field: "name",
        minWidth: 180,
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        cellClassRules: { "cell-disabled": (p) => !!p.data?.safe_delete },
        cellRenderer: (params: ICellRendererParams<any, any>) =>
          renderDisabledCellWithIcons(
            params,
            (data) => {
              const messages = [];
              if (data.safe_delete) messages.push("Usuário está desativado");
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
        cellClassRules: { "cell-disabled": (p) => !!p.data?.safe_delete },
        cellRenderer: (params: {
          data: { safe_delete: boolean; id: string };
          value: string;
        }) =>
          params.data?.safe_delete
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
        cellClassRules: { "cell-disabled": (p) => !!p.data?.safe_delete },
        cellRenderer: (params: {
          data: { safe_delete: boolean; id: string };
          value: string;
        }) =>
          params.data?.safe_delete
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
        headerName: "Ações",
        width: 70,
        cellRenderer: (params: {
          data: { safe_delete: boolean; id: string };
        }) => {
          const safe_delete = params.data.safe_delete;
          const id = params.data.id;
          const isSelf = id === myUserId;
          const tooltipText = isSelf
            ? "Não é permitido desativar o próprio usuário, peça para outro usuário admin desativá-lo"
            : safe_delete
              ? "Ativar usuário"
              : "Inativar usuário";

          return (
            <div style={{ marginTop: "4px" }}>
              <IconButton
                icon={safe_delete ? "SquareCheck" : "Trash"}
                buttonProps={{
                  variant: "text",
                  color: safe_delete ? "success" : "error",
                  disabled: isSelf,
                }}
                tooltip={tooltipText}
                onClick={
                  isSelf
                    ? undefined
                    : (e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setIsButtonClicked(true);
                        setFoundUserId?.(id);
                        setFoundUserDisabled?.(Boolean(safe_delete));
                        setOpenDialog(true);
                      }
                }
              />
            </div>
          );
        },
      },
    ],
    [myUserId]
  );

  const handleRowSelected = (event: RowSelectedEvent<DataUser>) => {
    const row = event.data;
    const isDeleted =
      row == null ||
      row.safe_delete === true ||
      // some APIs use `disabled` instead of `safe_delete`
      (row as any).disabled === true;

    if (isDeleted || isButtonClicked) return;

    setLoading(true);
    setFoundUserId?.(row.id);
    setEditDrawerOpen?.(true);
    setLoading(false);
    event.node.setSelected(false);
  };

  // reset local click guard when dialog closes
  React.useEffect(() => {
    let timer: number | undefined;
    if (!OpenDialog) {
      // Delay clearing the guard to avoid AG Grid selection events
      // fired during data rebind/refresh right after the dialog closes.
      timer = window.setTimeout(() => setIsButtonClicked(false), 300);
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [OpenDialog]);

  if (!myUserEnterpriseId) {
    return <Loading />;
  }

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
