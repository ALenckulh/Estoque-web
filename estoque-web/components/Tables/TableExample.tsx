"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowSelectedEvent,
} from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { useRouter } from "next/navigation";
import { ICellRendererParams } from "ag-grid-community";
import { Icon } from "../ui/Icon";
import { Tooltip } from "@mui/material";

// Registrar todos os módulos Community
ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  id: number;
  name: string;
  age: number;
  email: string;
  disabled?: boolean;
}

export default function AgGridExample() {
  const router = useRouter();

  const [rowData] = useState<RowData[]>([
    { id: 1, name: "Ana", age: 25, email: "ana@example.com", disabled: true },
    { id: 2, name: "Bruno", age: 30, email: "bruno@example.com" },
    { id: 3, name: "Carla", age: 28, email: "carla@example.com" },
    { id: 4, name: "Daniel", age: 35, email: "daniel@example.com" },
  ]);

  const [columnDefs] = useState<ColDef<RowData>[]>([
    {
      headerName: "ID",
      field: "id",
      sortable: true,
      width: 80,
      filter: "agNumberColumnFilter",
      suppressMovable: true,
      lockPosition: 'left',
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled, // garante boolean
      },
      cellRenderer: (params: ICellRendererParams<RowData, number>) => (
        <Tooltip
          title={params.data?.disabled ? "Usuario inativo" : ""}
          arrow
          disableHoverListener={!params.data?.disabled}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -6],
                  },
                },
              ],
            },
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {params.data?.disabled && (
              <Icon
                name="Circle"
                size={13}
                style={{
                  fill: "var(--neutral-40)",
                  color: "var(--neutral-40)",
                  position: "absolute",
                  left: -8,
                }}
              />
            )}
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      headerName: "Nome",
      field: "name",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Idade",
      field: "age",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
    },
  ]);

  const handleRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      router.push(`/design-system`);
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="single"
        colResizeDefault="shift"
        onRowSelected={handleRowSelected}
        pagination={true}
        paginationPageSize={20}
        theme={myTheme}
        enableCellTextSelection={true}
        suppressDragLeaveHidesColumns={true}
      />
    </div>
  );
}
