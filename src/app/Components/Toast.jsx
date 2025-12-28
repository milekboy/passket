"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

export default function Toast({
  type = "info",
  message,
  onClose,
  duration = 2000,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!mounted || !message) return null;

  const styles = {
    success: "bg-black/90 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    error: "bg-black/90 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    warning: "bg-black/90 border-yellow-500/50 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    info: "bg-black/90 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  };

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 shrink-0" />,
    error: <XCircleIcon className="h-5 w-5 shrink-0" />,
    warning: <InformationCircleIcon className="h-5 w-5 shrink-0" />,
    info: <InformationCircleIcon className="h-5 w-5 shrink-0" />,
  };

  return createPortal(
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md ${styles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 cursor-pointer text-xs font-bold opacity-80 hover:opacity-100"
      >
        ✕
      </button>
    </div>,
    document.body
  );
}
