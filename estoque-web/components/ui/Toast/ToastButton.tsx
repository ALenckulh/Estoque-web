import React from "react";
import { Button } from "@mui/material";
import { useToast } from "./Toast";

export function ToastButton() {
  const { Toast, showToast } = useToast();

  return (
    <>
      <Button onClick={() => showToast("Ação realizada com sucesso!", "success")}>
        Mostrar Toast
      </Button>
      {Toast}
    </>
  );
}
