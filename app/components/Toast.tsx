"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const success = useCallback((message: string) => addToast(message, "success"), [addToast]);
    const error = useCallback((message: string) => addToast(message, "error"), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === "success"
                            ? "bg-white/90 border-stone-200 text-stone-900"
                            : "bg-red-50/90 border-red-100 text-red-900"
                            }`}
                    >
                        <span className="text-xl">{toast.type === "success" ? "✨" : "⚠️"}</span>
                        <p className="font-medium text-sm">{toast.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
