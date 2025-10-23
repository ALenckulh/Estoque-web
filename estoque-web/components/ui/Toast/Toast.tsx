// Toast.tsx
import React, { useState } from "react";
import { Box, Fade, Button } from "@mui/material";
import styles from "./Toast.module.css"; // Importa o CSS Module
import { Icon } from "../Icon";
import { icons } from 'lucide-react';


// ------------------ Tipagem ------------------
export type ToastType = {
  id: number;
  type?: "success" | "error" | undefined;
  show: boolean;
  message: string;
  icon?: keyof typeof icons;
};

// ------------------ Toast ------------------
interface ToastProps {
  type?: "success" | "error" | undefined;
  message: string;
  icon?: keyof typeof icons;
}

export const Toast: React.FC<ToastProps> = ({
  type = "success",
  message,
  icon,
}) => {
  const toastClass = `${styles.toast} body3 ${styles[type]}`;

  return (
    <div
      className={toastClass.trim()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {icon && <Icon name={icon} />}
      {message}
    </div>
  );
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
            <Toast type={toast.type} message={toast.message} icon={toast.icon} />
          </div>
        </Fade>
      ))}
    </Box>
  );
};                                
                                                                    