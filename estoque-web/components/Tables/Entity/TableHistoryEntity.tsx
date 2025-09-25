"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { myTheme } from "@/app/theme/agGridTheme";
import { useRouter } from "next/navigation";
import { ICellRendererParams } from "ag-grid-community";
import { Tooltip } from "@mui/material";
import { Icon } from "@/components/ui/Icon";

// Registrar todos os módulos Community
ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  groupId: number;
  fiscalNote: string;
  itemId: number;
  itemName: string;
  user: string;
  date: string; //data e hora
  quantity: number;
  disabled?: boolean;
}

export default function TableHistoryEntity() {
  const router = useRouter();

  const [rowData] = useState<RowData[]>([
    {
      groupId: 101,
      fiscalNote: "NF-2025-001",
      itemId: 1,
      itemName: "Caneta Azul",
      user: "ana@example.com",
      date: "2025-09-25T09:15:00",
      quantity: 10,
    },
    {
      groupId: 101,
      fiscalNote: "NF-2025-002",
      itemId: 2,
      itemName: "Caderno Pautado",
      user: "bruno@example.com",
      date: "2025-09-25T10:20:00",
      quantity: 5,
      disabled: true,
    },
    {
      groupId: 102,
      fiscalNote: "NF-2025-003",
      itemId: 3,
      itemName: "Lápis HB",
      user: "carla@example.com",
      date: "2025-09-24T14:45:00",
      quantity: 20,
    },
    {
      groupId: 103,
      fiscalNote: "NF-2025-004",
      itemId: 4,
      itemName: "Borracha",
      user: "daniel@example.com",
      date: "2025-09-24T16:30:00",
      quantity: 15,
    },
    {
      groupId: 104,
      fiscalNote: "NF-2025-005",
      itemId: 5,
      itemName: "Marcador Permanente",
      user: "eduardo@example.com",
      date: "2025-09-23T11:00:00",
      quantity: 8,
    },
    {
      groupId: 105,
      fiscalNote: "NF-2025-006",
      itemId: 6,
      itemName: "Apontador",
      user: "fernanda@example.com",
      date: "2025-09-23T13:15:00",
      quantity: 12,
    },
    {
      groupId: 101,
      fiscalNote: "NF-2025-007",
      itemId: 7,
      itemName: "Régua 30cm",
      user: "gabriel@example.com",
      date: "2025-09-22T09:50:00",
      quantity: 7,
      disabled: true,
    },
    {
      groupId: 102,
      fiscalNote: "NF-2025-008",
      itemId: 8,
      itemName: "Agenda 2025",
      user: "heloisa@example.com",
      date: "2025-09-22T15:10:00",
      quantity: 18,
    },
    {
      groupId: 103,
      fiscalNote: "NF-2025-009",
      itemId: 9,
      itemName: "Post-it 3x3",
      user: "igor@example.com",
      date: "2025-09-21T10:40:00",
      quantity: 25,
    },
    {
      groupId: 104,
      fiscalNote: "NF-2025-010",
      itemId: 10,
      itemName: "Clip de Papel",
      user: "juliana@example.com",
      date: "2025-09-21T12:55:00",
      quantity: 6,
    },
    {
      groupId: 105,
      fiscalNote: "NF-2025-011",
      itemId: 11,
      itemName: "Papel A4",
      user: "kaio@example.com",
      date: "2025-09-20T09:30:00",
      quantity: 14,
    },
    {
      groupId: 101,
      fiscalNote: "NF-2025-012",
      itemId: 12,
      itemName: "Envelope",
      user: "larissa@example.com",
      date: "2025-09-20T11:25:00",
      quantity: 9,
    },
    {
      groupId: 102,
      fiscalNote: "NF-2025-013",
      itemId: 13,
      itemName: "Fita Adesiva",
      user: "marcos@example.com",
      date: "2025-09-19T14:15:00",
      quantity: 22,
      disabled: true,
    },
    {
      groupId: 103,
      fiscalNote: "NF-2025-014",
      itemId: 14,
      itemName: "Bloco de Notas",
      user: "natalia@example.com",
      date: "2025-09-19T16:40:00",
      quantity: 11,
    },
    {
      groupId: 104,
      fiscalNote: "NF-2025-015",
      itemId: 15,
      itemName: "Tesoura",
      user: "octavio@example.com",
      date: "2025-09-18T10:05:00",
      quantity: 17,
    },
    {
      groupId: 105,
      fiscalNote: "NF-2025-016",
      itemId: 16,
      itemName: "Cola em Bastão",
      user: "paula@example.com",
      date: "2025-09-18T12:50:00",
      quantity: 20,
    },
    {
      groupId: 101,
      fiscalNote: "NF-2025-017",
      itemId: 17,
      itemName: "Marcador Quadro Branco",
      user: "quiteria@example.com",
      date: "2025-09-17T09:20:00",
      quantity: 13,
    },
    {
      groupId: 102,
      fiscalNote: "NF-2025-018",
      itemId: 18,
      itemName: "Caderno de Matemática",
      user: "rafael@example.com",
      date: "2025-09-17T14:30:00",
      quantity: 8,
      disabled: true,
    },
    {
      groupId: 103,
      fiscalNote: "NF-2025-019",
      itemId: 19,
      itemName: "Lápis de Cor",
      user: "sandra@example.com",
      date: "2025-09-16T11:45:00",
      quantity: 19,
    },
    {
      groupId: 104,
      fiscalNote: "NF-2025-020",
      itemId: 20,
      itemName: "Estojo",
      user: "thiago@example.com",
      date: "2025-09-16T13:55:00",
      quantity: 16,
    },
  ]);

  const [columnDefs] = useState<ColDef<RowData>[]>([
    {
      headerName: "Grupo ID",
      field: "groupId",
      sortable: true,
      width: 120,
      pinned: "left",
      filter: "agNumberColumnFilter",
      suppressMovable: true,
      lockPosition: "left",
      cellClassRules: {
        "cell-disabled": (params) => !!params.data?.disabled, // garante boolean
      },
      cellRenderer: (params: ICellRendererParams<RowData, number>) => (
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
      headerName: "Nota Fiscal",
      minWidth: 140,
      field: "fiscalNote",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Item ID",
      minWidth: 120,
      field: "itemId",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
    },
    {
      headerName: "Nome do Item",
      field: "itemName",
      minWidth: 140,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<RowData, string>) => {
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
              style={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.value}
            </span>
          </Tooltip>
        );
      },
    },
    {
      headerName: "Responsável",
      field: "user",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: ICellRendererParams<RowData, string>) => {
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
              style={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.value}
            </span>
          </Tooltip>
        );
      },
    },
    {
      headerName: "Data",
      field: "date",
      sortable: true,
      filter: "agDateColumnFilter",
      flex: 1,
      minWidth: 160,
      cellRenderer: (params: any) => {
        const date = new Date(params.value);

        const formattedDate = date.toLocaleDateString("pt-BR");
        const formattedTime = date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div style={{ display: "flex", flexDirection: "row", gap: 4, color: "var(--neutral-60)" }}>
            <span style={{ color: "var(--neutral-90)" }}>{`${formattedDate}`}</span>
            -
            <span>{`${formattedTime}`}</span>
          </div>
        );
      },
    },
    {
      headerName: "Quantidade",
      field: "quantity",
      sortable: true,
      filter: "agNumberColumnFilter",
      flex: 1,
      minWidth: 120,
    },
  ]);

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
