"use client";

import { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

export default function Toast({
  type = "info",
  message,
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: "bg-emerald-600/90 border-emerald-400 text-white",
    error: "bg-red-600/90 border-red-400 text-white",
    info: "bg-yellow-500/90 border-yellow-300 text-black",
  };

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 shrink-0" />,
    error: <XCircleIcon className="h-5 w-5 shrink-0" />,
    info: <InformationCircleIcon className="h-5 w-5 shrink-0" />,
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md ${styles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-xs font-bold opacity-80 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
