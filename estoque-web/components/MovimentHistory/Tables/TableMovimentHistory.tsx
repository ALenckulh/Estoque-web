"use client";

import React, { useMemo, useState } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/axios";
import { Loading } from "@/components/Feedback/Loading";
import { IconButton } from "@/components/ui/IconButton";
import { useToast } from "@/hooks/toastHook";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Menu,
} from "@mui/material";
import MenuItem from "../../ui/MenuItem";

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowDataItem {
  movementId: number;
  groupId: number;
  fiscalNote: string;
  entityId: number;
  itemId: number;
  user: string; // user_id
  movimentDate: string; // formatted date
  quantity: number;
  disabled?: boolean;
}

export default function TableHistoryEntity({
  filters,
}: {
  filters?: { safe_delete?: boolean; type?: "entrada" | "saida" };
}) {
  const { myUserEnterpriseId } = useUser();
  const queryClient = useQueryClient();
  const { toasts, showToast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedMovementId, setSelectedMovementId] = useState<number | null>(
    null
  );
  const [selectedDisabled, setSelectedDisabled] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [toggleScope, setToggleScope] = useState<"line" | "group" | null>(null);

  const { data: rowData = [] } = useQuery({
    queryKey: ["movements", myUserEnterpriseId, filters?.safe_delete, filters?.type],
    enabled: !!myUserEnterpriseId,
    queryFn: async () => {
      if (!myUserEnterpriseId) return [] as RowDataItem[];
      const resp = await api.get("/movement", {
        params: {
          enterprise_id: myUserEnterpriseId,
          // send safe_delete only when defined
          ...(filters?.safe_delete !== undefined
            ? { safe_delete: String(filters.safe_delete) }
            : {}),
          // send type only when defined
          ...(filters?.type ? { type: filters.type } : {}),
        },
      });
      const list = (resp?.data?.movements ?? []) as any[];
      return list.map((m) => ({
        movementId: Number(m.id ?? 0),
        groupId: Number(m.group_id),
        fiscalNote: m.nota_fiscal ?? "",
        entityId: Number(m.enterprise_id),
        itemId: Number(m.item_id),
        user: String(m.user_email ?? m.user_id ?? ""),
        movimentDate: m.date ?? "",
        quantity: Number(m.quantity ?? 0),
        disabled: Boolean(m.safe_delete),
      })) as RowDataItem[];
    },
  });

  console.log("rowData:", rowData);

  const renderWithDash = (renderer: (p: ICellRendererParams) => any) => {
    return (params: ICellRendererParams) => {
      const val = params.value;
      if (val === undefined || val === null || val === "") return <span>-</span>;
      return renderer(params);
    };
  };

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
        cellRendererParams: {
          copyOnClick: true,
        },
        cellClassRules: {
          "cell-disabled": (params) => !!params.data?.disabled,
        },
        cellRenderer: (params: ICellRendererParams<any, any>) =>
          renderDisabledCellWithIcons(params, (data) => {
            const messages = [];
            if (data.disabled) messages.push("Movimentação está desativada");
            return messages.join("");
          }),
        // Enable click-to-copy/selection behavior similar to itemId
      },
      {
        headerName: "Nota Fiscal",
        minWidth: 140,
        field: "fiscalNote",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        cellClassRules: {
          "cell-disabled": (params) => !!params.data?.disabled,
        },
        cellRenderer: renderWithDash(renderCopyTooltipCell),
        
      },
      {
        headerName: "Data de movimentação",
        field: "movimentDate",
        sortable: true,
        filter: "agDateColumnFilter",
        flex: 1,
        minWidth: 160,
        cellRenderer: renderDateCell,
        cellClassRules: {
          "cell-disabled": (params) => !!params.data?.disabled,
        },
      },
      {
        headerName: "User responsável",
        field: "user",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 140,
        cellRenderer: renderWithDash(renderCopyTooltipCell),
        
        cellClassRules: {
          "cell-disabled": (params) => !!params.data?.disabled,
        },
      },
      {
        headerName: "ID Entidade",
        minWidth: 120,
        field: "entityId",
        sortable: true,
        filter: "agNumberColumnFilter",
        flex: 1,
        cellRenderer: renderWithDash(renderCopyTooltipCell),
        
        cellClassRules: {
          "cell-disabled": (params) => !!params.data?.disabled,
        },
      },
      {
        headerName: "ID Item",
        field: "itemId",
        minWidth: 140,
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        cellRenderer: renderWithDash(renderCopyTooltipCell),
        cellClassRules: {
          "cell-disabled": (params) => !!params.data?.disabled,
        },
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
          if (value === undefined || value === null || Number.isNaN(n))
            return <span>-</span>;

          const style = n < 0 ? { color: "var(--danger-0)" } : undefined;

          return (
            <div style={{ paddingLeft: "10px" }}>
              <span style={style}>{n}</span>
            </div>
          );
        },
        cellClassRules: {
          "cell-disabled": (params) => !!params.data?.disabled,
        },
      },
      {
        headerName: "Ações",
        width: 100,
        pinned: "right",
        sortable: false,
        
        cellRenderer: (params: { data: RowDataItem }) => {
          const isDisabled = Boolean(params.data?.disabled);
          const groupId = Number(params.data?.groupId);
          const movementId = Number(params.data?.movementId);
          const tooltipText = isDisabled
            ? "Ativar movimentação"
            : "Desativar movimentação";

          return (
            <div style={{ marginTop: "4px" }}>
            <IconButton
              icon={"EllipsisVertical"}
              buttonProps={{
                variant: "text",
              }}
              tooltip={tooltipText}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setSelectedGroupId(groupId);
                setSelectedMovementId(movementId);
                setSelectedDisabled(isDisabled);
                setAnchorEl(e.currentTarget);
              }}
            />
            </div>
          );
        },
      },
    ],
    [
      /* no deps */
    ]
  );

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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {selectedMovementId !== null && selectedMovementId > 0 && (
          <MenuItem
            onClick={() => {
              setToggleScope("line");
              setAnchorEl(null);
              setOpenDialog(true);
            }}
            icon={selectedDisabled ? "SquareCheck" : "Trash"}
          >
            {selectedDisabled ? "Ativar a linha" : "Desativar a linha"}
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setToggleScope("group");
            setAnchorEl(null);
            setOpenDialog(true);
          }}
          icon={selectedDisabled ? "SquareCheck" : "Trash"}
        >
          {selectedDisabled ? "Ativar o grupo" : "Desativar o grupo"}
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar ação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedDisabled
              ? "Tem certeza que deseja ativar esta movimentação?"
              : "Tem certeza que deseja desativar esta movimentação?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color={selectedDisabled ? "success" : "error"}
            onClick={async () => {
              try {
                if (!myUserEnterpriseId) {
                  showToast("Movimentação ou empresa inválida", "error", "X");
                  return;
                }
                const payload =
                  toggleScope === "line"
                    ? {
                        movement_id: Number(selectedMovementId),
                        enterprise_id: Number(myUserEnterpriseId),
                      }
                    : {
                        group_id: Number(selectedGroupId),
                        enterprise_id: Number(myUserEnterpriseId),
                      };
                const resp = await api.post(
                  "/movement/toggle-safe-delete",
                  payload
                );
                if (resp?.data?.success) {
                  queryClient.invalidateQueries({
                    queryKey: ["movements", myUserEnterpriseId],
                  });
                  showToast(
                    selectedDisabled
                      ? toggleScope === "line"
                        ? "Linha ativada com sucesso"
                        : "Grupo ativado com sucesso"
                      : toggleScope === "line"
                        ? "Linha desativada com sucesso"
                        : "Grupo desativado com sucesso",
                    "success",
                    selectedDisabled ? "SquareCheck" : "Trash"
                  );
                } else {
                  const msg =
                    resp?.data?.message || "Erro ao atualizar movimentação";
                  showToast(msg, "error", "X");
                }
              } catch (err: any) {
                showToast(
                  err?.message || "Erro ao atualizar movimentação",
                  "error",
                  "X"
                );
              } finally {
                setOpenDialog(false);
                setSelectedGroupId(null);
                setSelectedMovementId(null);
                setSelectedDisabled(false);
                setToggleScope(null);
              }
            }}
          >
            {selectedDisabled ? "Ativar" : "Desativar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
