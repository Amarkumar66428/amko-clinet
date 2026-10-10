import type { ReactNode } from "react";

const controlBase =
  "w-full rounded-lg border border-slate-200 bg-white text-base text-ink outline-none sm:text-sm transition focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] motion-reduce:transition-none";

export const inputClass = `${controlBase} h-10 px-[11px]`;
export const textareaClass = `${controlBase} min-h-[76px] resize-y px-[11px] py-2.5 leading-normal`;
export const labelTextClass = "text-[11px] font-semibold text-slate-500";

export function FieldLabel({
  label,
  className = "mb-[13px] last:mb-0",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className={labelTextClass}>{label}</span>
      {children}
    </label>
  );
}
