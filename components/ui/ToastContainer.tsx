"use client";

import React from "react";
import { usePulse } from "@/lib/pulse-context";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = usePulse();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start space-x-3 p-4 rounded-xl bg-background-card/95 border border-border-hover shadow-glow-indigo backdrop-blur-xl animate-slide-up transition-all"
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-accent-rose" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-accent-cyan" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground tracking-tight">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-xs text-foreground-muted mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-foreground-subtle hover:text-foreground transition-colors p-0.5"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
