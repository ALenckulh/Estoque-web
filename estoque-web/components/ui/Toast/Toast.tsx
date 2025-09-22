import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error" | "warning" | "info">("info");

  const showToast = (msg: string, type: typeof severity = "info") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const Toast = (
    <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
      <Alert severity={severity} onClose={() => setOpen(false)}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { Toast, showToast };
}
