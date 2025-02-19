/** @format */

import React, { createContext, useContext, useId, useState } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: string;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const uniqueId = useId(); // Ensures consistent ID across SSR & CSR

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = `toast-${uniqueId}-${Date.now()}`; // Stable ID
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (typeof window !== "undefined") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-md ${
              toast.variant === "destructive"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {toast.title && <h4 className="font-medium">{toast.title}</h4>}
            {toast.description && (
              <p className="text-sm">{toast.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const Toaster = () => null;
