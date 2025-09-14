// components/ToastBar/ToastBar.tsx
import React from "react";
import "./ToastBar.css"; // Importa o CSS tradicional

interface ToastProps {
  type: "success" | "error";
  children: React.ReactNode;
  className?: string;
}

export const ToastBar: React.FC<ToastProps> = ({ type, children, className }) => {
  const toastClass = `toast body3 ${type} ${className || ""}`;
  
  return (
    <div className={toastClass.trim()}>
      {children}
    </div>
  );
};