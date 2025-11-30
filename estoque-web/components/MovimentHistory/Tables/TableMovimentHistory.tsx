"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { ICellRendererParams } from "ag-grid-community";
import {
  renderCopyTooltipCell,
  renderDateCell,
  renderDisabledCellWithIcons,
} from "@/components/Tables/CelRenderes";
import { useUser } from "@/hooks/userHook";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/axios";
import { Loading } from "@/components/Feedback/Loading";

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowDataItem {
  groupId: number;
  fiscalNote: string;
  entityId: number;
  itemId: number;
  user: string; // user_id
  movimentDate: string; // formatted date
  quantity: number;
  disabled?: boolean;
}

export default function TableHistoryEntity() {
  const { myUserEnterpriseId } = useUser();

  const { data: rowData = [] } = useQuery({
    queryKey: ["movements", myUserEnterpriseId],
    enabled: !!myUserEnterpriseId,
    queryFn: async () => {
      if (!myUserEnterpriseId) return [] as RowDataItem[];
      const resp = await api.get("/movement", {
        params: { enterprise_id: myUserEnterpriseId },
      });
      const list = (resp?.data?.movements ?? []) as any[];
      return list.map((m) => ({
        groupId: Number(m.group_id),
        fiscalNote: m.nota_fiscal ?? "",
        entityId: Number(m.enterprise_id),
        itemId: Number(m.item_id),
        user: String(m.user_id ?? ""),
        movimentDate: m.data_movimentacao ?? m.date ?? "",
        quantity: Number(m.quantity ?? 0),
      })) as RowDataItem[];
    },
  });

  const columnDefs = useMemo<ColDef<RowDataItem>[]>(
    () => [
    {
      headerName: "ID do Grupo",
      field: "groupId",
      sortable: true,
      width: 140,
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
        const value = params.value ?? params.data?.quantity;
        const n = Number(value);
        if (value === undefined || value === null || Number.isNaN(n)) return <span>-</span>;

        const style = n < 0 ? { color: "var(--danger-0)" } : undefined;

        return (
          <div style={{ paddingLeft: "10px" }}>
            <span style={style}>{n}</span>
          </div>
        );
      },
    },
  ], [/* no deps */]);

  if (!myUserEnterpriseId) {
    return <Loading />;
  }

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
