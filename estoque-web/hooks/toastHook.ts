import { ToastType } from "@/components/ui/Toast/Toast";
import { icons } from "lucide-react";
import { useState } from "react";

export const useToast  = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);


  const showToast = (message: string, type: "success" | "error" = "success", icon?: keyof typeof icons) => {
    const id = Date.now();
    const newToast: ToastType = { id, type, show: true, message, icon };

    setToasts((prev) => [...prev, newToast]);

    // Oculta depois de 3 segundos
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, show: false } : t))
      );
    }, 1500);
  };

  return { toasts, showToast };
};