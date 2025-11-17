"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Detail4 } from "@/components/ui/Typography";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useToast } from "@/hooks/toastHook";
import {
  Box,
  Button,
  Card,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import TableMovimentHistory from "@/components/MovimentHistory/Tables/TableMovimentHistory";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("historico");
  const [item, setItem] = useState(null);
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