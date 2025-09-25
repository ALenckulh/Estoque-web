// Toast.tsx
import React, { useState } from "react";
import { Box, Fade, Button } from "@mui/material";
import styles from "./Toast.module.css"; // Importa o CSS Module

// ------------------ Tipagem ------------------
export type ToastType = {
  id: number;
  type?: "success" | "error" | undefined;
  show: boolean;
  message: string;
};

// ------------------ Toast ------------------
interface ToastProps {
  type?: "success" | "error" | undefined;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = "success",
  message,
}) => {
  const toastClass = `${styles.toast} body3 ${styles[type]}`;

  return <div className={toastClass.trim()}>{message}</div>;
};

// ------------------ Toast Container ------------------
interface ToastContainerProps {
  toasts: ToastType[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {toasts.map((toast) => (
        <Fade
          key={toast.id}
          in={toast.show}
          timeout={300}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <Toast type={toast.type} message={toast.message}/>
          </div>
        </Fade>
      ))}
    </Box>
  );
};

// ------------------ Hook para gerenciar toasts ------------------
export const useToast  = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);


  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    const newToast: ToastType = { id, type, show: true, message };

    setToasts((prev) => [...prev, newToast]);

    // Oculta depois de 3 segundos
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, show: false } : t))
      );
    }, 3000);
  };

  return { toasts, showToast };
};
                                    
                                                                    