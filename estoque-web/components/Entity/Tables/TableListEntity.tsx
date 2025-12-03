"use client";

import React, { useEffect, useState } from "react";
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
import {
  renderDateCell,
  renderDisabledCellWithIcons,
  renderTooltip,
} from "@/components/Tables/CelRenderes";
import { AG_GRID_LOCALE_PT_BR } from "@/utils/agGridLocalePtBr";
import { api } from "@/utils/axios";
import { useUser } from "@/hooks/userHook";

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

interface TableListEntityProps {
  filters?: {
    safe_delete?: boolean;
  };
}

export default function TableListEntity({ filters }: TableListEntityProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<RowDataEntity[]>([]);
  const { myUserEnterpriseId } = useUser();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!myUserEnterpriseId) return;
      try {
        const params: any = {};
        if (typeof filters?.safe_delete === "boolean") params.safe_delete = filters.safe_delete;
        const resp = await api.get("/entity/listEntity", {
          headers: { "x-enterprise-id": String(myUserEnterpriseId) },
          params,
        });
        const entities = resp?.data?.entities || [];
        const mapped: RowDataEntity[] = entities.map((entity: any) => ({
          id: Number(entity.id ?? 0),
          name: String(entity.name ?? ""),
          telephone: String(entity.phone ?? ""),
          email: String(entity.email ?? ""),
          address: String(entity.address ?? ""),
          disabled: Boolean(entity.safe_delete),
          createdAt: String(entity.created_at ?? ""),
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
  }, [myUserEnterpriseId, JSON.stringify(filters)]);

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
