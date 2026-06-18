"use client";

import { Printer } from "lucide-react";

export function PrintToolbar() {
  return (
    <div className="print-toolbar">
      <button type="button" onClick={() => window.print()}>
        <Printer size={16} aria-hidden />
        Print / Save PDF
      </button>
    </div>
  );
}
