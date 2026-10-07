"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";

const ToastContext = createContext(null);

const styles = {
  success: "border-accent-2/40 text-accent-2",
  error: "border-warn/40 text-warn",
  info: "border-accent/40 text-accent",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message, variant = "info") => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 md:inset-x-auto md:right-6 md:items-end"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`glass pointer-events-auto flex w-full max-w-sm items-start justify-between gap-3 border px-4 py-3 text-sm shadow-card-hover md:w-auto ${styles[item.variant]}`}
          >
            <span className="text-ink">{item.message}</span>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="mt-0.5 text-muted transition-colors hover:text-ink"
            >
              <X aria-hidden="true" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
