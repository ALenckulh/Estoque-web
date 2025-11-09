"use client";

import React, { useCallback, useState } from "react";
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
import { entityList } from "@/utils/dataBaseExample";
import {
  renderDateCell,
  renderDisabledCellWithIcons,
  renderTooltip,
} from "@/components/Tables/CelRenderes";
import { AG_GRID_LOCALE_PT_BR } from "@/utils/agGridLocalePtBr";
import { useAppReady } from "@/hooks/useAppReady";

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
  const { setAppReady } = useAppReady();

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
      cellRenderer: (params: ICellRendererParams<any, any>) =>
        renderDisabledCellWithIcons(params, (data) => {
          const messages = [];
          if (data.disabled) messages.push("Entidade está desativada");
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
        renderTooltip(params.value),
    },
    {
      headerName: "E-mail",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: { value: string | undefined }) =>
        renderTooltip(params.value),
    },
    {
      headerName: "Endereço",
      field: "address",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: { value: string | undefined }) =>
        renderTooltip(params.value),
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
      router.push(`/entities/${event.data.id}`);
    }
  };

  const onFirstDataRendered = useCallback(() => {
        setAppReady(true);
      }, [setAppReady]);

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
        onFirstDataRendered={onFirstDataRendered}
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
