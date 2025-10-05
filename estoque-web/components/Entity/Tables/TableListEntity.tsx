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
import { Tooltip } from "@mui/material";
import { Icon } from "@/components/ui/Icon";
import { entityList } from "@/utils/entintyExampleList";

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
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled, // garante boolean
      },
      cellRenderer: (params: ICellRendererParams<RowDataEntity, number>) => (
        <Tooltip
          title={params.data?.disabled ? "Grupo inativo" : ""}
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
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<RowDataEntity, string>) => {
        const spanRef = React.createRef<HTMLSpanElement>();

        return (
          <Tooltip
            title={params.value}
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: { offset: [0, -6] },
                  },
                ],
              },
            }}
          >
            <span
              ref={spanRef}
              className="ellipsis"
              style={{display:"block"}}
            >
              {params.value}
            </span>
          </Tooltip>
        );
      },
    },
    {
      headerName: "E-mail",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: ICellRendererParams<RowDataEntity, string>) => {
        const spanRef = React.createRef<HTMLSpanElement>();

        return (
          <Tooltip
            title={params.value}
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: { offset: [0, -6] },
                  },
                ],
              },
            }}
          >
            <span
              ref={spanRef}
              className="ellipsis"
              style={{display:"block"}}
            >
              {params.value}
            </span>
          </Tooltip>
        );
      },
    },

    {
      headerName: "Endereço",
      field: "address",
      minWidth: 180,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<RowDataEntity, string>) => {
        const spanRef = React.createRef<HTMLSpanElement>();

        return (
          <Tooltip
            title={params.value}
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: { offset: [0, -6] },
                  },
                ],
              },
            }}
          >
            <span
              ref={spanRef}
              className="ellipsis"
              style={{display:"block"}}
            >
              {params.value}
            </span>
          </Tooltip>
        );
      },
    },
    {
      headerName: "Criado",
      field: "createdAt",
      sortable: true,
      filter: "agDateColumnFilter",
      width: 120,
      cellRenderer: (
        params: ICellRendererParams<RowDataEntity, string | null | undefined>
      ) => {
        if (!params.value) {
          return <span>-</span>;
        }
        const date = new Date(params.value);
        const formattedDate = date.toLocaleDateString("pt-BR");

        return (
          <span
            style={{ color: "var(--neutral-90)" }}
          >{`${formattedDate}`}</span>
        );
      },
    },
  ]);

  const handleRowSelected = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      const entityId = event.data.id;
      router.push(`/entity/${entityId}`);
    }
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "100%", width: "100%", minHeight: "500px" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="single"
        onRowSelected={handleRowSelected}
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
