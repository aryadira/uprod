// components/common/RefreshButton.tsx
"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onClick: () => void;
  className?: string;
}

export default function RefreshButton({ onClick, className = "" }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`refresh-btn p-2 border border-slate-200 rounded-lg hover:bg-slate-50 ${className}`}
      aria-label="Refresh"
    >
      <RefreshCw className="size-5 text-slate-500" />
    </button>
  );
}
