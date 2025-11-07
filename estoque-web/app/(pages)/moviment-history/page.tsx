"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableHistoryItems from "@/components/Items/Tables/TableHistoryItems";
import { RowDataItem } from "@/components/Items/Tables/TableListItems";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Body1, Detail1, Detail4, Subtitle2 } from "@/components/ui/Typograph";
import { itemList } from "@/utils/dataBaseExample";
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CopyTooltip from "@/components/ui/CopyTooltip";
import { NotFound } from "@/components/NotFound";
import { EntityIdLoading } from "@/components/Entity/Loading/EntityIdLoading";
import { ToastContainer, useToast } from "@/components/ui/Toast/Toast";
import TableMovimentHistory from "@/components/MovimentHistory/Tables/TableMovimentHistory";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("historico");
  const [item, setItem] = useState<RowDataItem | null>(null);
  const params = useParams();
  const id = params.id;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModalInactive, setOpenModalInactive] = useState(false);
  const [openModalActive, setOpenModalActive] = useState(false);
  const { toasts, showToast } = useToast();

  const itemDetails = [
    { label: "Quantidade", value: item?.quantity?.toString() },
    { label: "Quantidade de alerta", value: item?.alertQuantity },
    { label: "Unidade de medida", value: item?.unit },
    { label: "Posição", value: item?.position },
    { label: "Grupo", value: item?.group },
    { label: "Segmento", value: item?.segment },
    { label: "Fabricante", value: item?.manufacturer },
  ];

  const topRowItems = itemDetails.slice(0, 4);
  const bottomRowItems = itemDetails.slice(4, 7);

  return (
    <div>
      <Appbar
        showTabs={true}
        showAvatar={true}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="container">
          <>
    
            <Box className="historyContainer">
              <Box className="historyHeader">
                <Icon name="History" size={14} color="var(--neutral-60)" />
                <Detail4>Histórico de Movimentação</Detail4>
              </Box>
              <TableMovimentHistory />
            </Box>
            <Box sx={{ height: "12px" }}>
              <p></p>
            </Box>
    
            <ToastContainer toasts={toasts} />
          </>
      </div>
    </div>
  );
}