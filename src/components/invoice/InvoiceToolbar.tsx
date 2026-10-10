"use client";

import type { KeyboardEvent } from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import FormatListBulletedOutlined from "@mui/icons-material/FormatListBulletedOutlined";
import PaletteOutlined from "@mui/icons-material/PaletteOutlined";
import PercentOutlined from "@mui/icons-material/PercentOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";

export type ToolId = "details" | "sender" | "client" | "items" | "tax" | "appearance";

export interface Tool {
  id: ToolId;
  label: string;
  Icon: SvgIconComponent;
}

/** Toolbar order is also the "Next" order inside the panel. */
export const TOOLS: readonly Tool[] = [
  { id: "details", label: "Invoice details", Icon: ReceiptLongOutlined },
  { id: "sender", label: "Your business", Icon: StorefrontOutlined },
  { id: "client", label: "Bill to", Icon: PersonOutlineOutlined },
  { id: "items", label: "Line items", Icon: FormatListBulletedOutlined },
  { id: "tax", label: "Tax, discount & notes", Icon: PercentOutlined },
  { id: "appearance", label: "Appearance", Icon: PaletteOutlined },
];

interface InvoiceToolbarProps {
  active: ToolId | null;
  itemCount: number;
  onSelect: (tool: ToolId) => void;
}

/** Arrow keys move focus between tools, as expected for role="toolbar". */
function handleArrowKeys(e: KeyboardEvent<HTMLDivElement>) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
  const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
  const last = buttons.length - 1;
  const next =
    e.key === "Home" ? 0 : e.key === "End" ? last : e.key === "ArrowRight" ? (current + 1) % buttons.length : (current - 1 + buttons.length) % buttons.length;
  buttons[next]?.focus();
  e.preventDefault();
}

export default function InvoiceToolbar({ active, itemCount, onSelect }: InvoiceToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Invoice tools"
      className="flex items-center justify-center gap-1 lg:justify-start"
      onKeyDown={handleArrowKeys}
    >
      {TOOLS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            className={`group relative grid size-10 place-items-center rounded-xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none ${
              isActive ? "bg-ink text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-ink"
            }`}
            onClick={() => onSelect(id)}
          >
            <Icon fontSize="small" aria-hidden />
            {id === "items" && (
              <span
                aria-hidden
                className={`absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] leading-none font-bold ${
                  isActive ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
                }`}
              >
                {itemCount}
              </span>
            )}
            {/* Title shown only on hover / keyboard focus; the accessible name comes from aria-label. */}
            <span
              aria-hidden
              className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 translate-y-1 rounded-md bg-ink px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
