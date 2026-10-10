import { memo } from "react";
import { FONT_SIZE_RANGE } from "@/lib/invoice/draft";
import { FONT_FAMILIES, type Appearance } from "@/lib/invoice/types";
import { FieldLabel, inputClass, labelTextClass } from "./EditorFields";

const ACCENT_PRESETS = ["#2563eb", "#0f766e", "#7c2d12", "#7c3aed", "#db2777", "#ea580c", "#111827"];

const colorInputClass = "h-8 w-11 cursor-pointer rounded-[7px] border border-slate-200 bg-white p-0.5";

interface AppearanceSectionProps {
  appearance: Appearance;
  onChange: (next: Appearance) => void;
  onReset: () => void;
}

function AppearanceSection({ appearance, onChange, onReset }: AppearanceSectionProps) {
  const update = <K extends keyof Appearance>(field: K, value: Appearance[K]) =>
    onChange({ ...appearance, [field]: value });

  return (
    <>
      <FieldLabel label="Font">
        <select
          className={inputClass}
          value={appearance.fontFamily}
          onChange={(e) => update("fontFamily", e.target.value as Appearance["fontFamily"])}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </FieldLabel>

      <FieldLabel label="Text size">
        <div className="flex items-center gap-3">
          <input
            type="range"
            className="flex-1 accent-blue-600"
            min={FONT_SIZE_RANGE.min}
            max={FONT_SIZE_RANGE.max}
            step={FONT_SIZE_RANGE.step}
            value={appearance.fontSize}
            onChange={(e) => update("fontSize", Number(e.target.value))}
          />
          <strong className="min-w-[38px] text-right text-xs text-ink">{appearance.fontSize}pt</strong>
        </div>
      </FieldLabel>

      <div className="mt-[13px] flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <span className={labelTextClass}>Accent</span>
          <input
            type="color"
            aria-label="Accent colour"
            className={colorInputClass}
            value={appearance.accentColor}
            onChange={(e) => update("accentColor", e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use accent ${color}`}
              aria-pressed={appearance.accentColor.toLowerCase() === color}
              className="size-6 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(15,23,42,0.15)] transition hover:scale-110 aria-pressed:shadow-[0_0_0_2px_#172033]"
              style={{ backgroundColor: color }}
              onClick={() => update("accentColor", color)}
            />
          ))}
        </div>
      </div>

      <label className="mt-[13px] flex items-center justify-between gap-4">
        <span className={labelTextClass}>Text colour</span>
        <input
          type="color"
          className={colorInputClass}
          value={appearance.textColor}
          onChange={(e) => update("textColor", e.target.value)}
        />
      </label>

      <button
        type="button"
        className="mt-5 w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-ink"
        onClick={onReset}
      >
        Reset to template defaults
      </button>
    </>
  );
}

export default memo(AppearanceSection);
