import { memo } from "react";
import { FONT_SIZE_RANGE, LINE_HEIGHT_RANGE, MARGIN_RANGE, SPACING_RANGE } from "@/lib/invoice/draft";
import { FONT_FAMILIES, type Appearance } from "@/lib/invoice/types";
import { FieldLabel, inputClass, labelTextClass } from "./EditorFields";

const ACCENT_PRESETS = ["#2563eb", "#0f766e", "#7c2d12", "#7c3aed", "#db2777", "#ea580c", "#111827"];

const colorInputClass = "h-8 w-11 cursor-pointer rounded-[7px] border border-slate-200 bg-white p-0.5";

type SpacingSettings = Pick<Appearance, "spacing" | "lineHeight" | "margin">;

/** Presets are relative to the template's own defaults, so "Normal" restores the template's look. */
const SPACING_PRESETS: { label: string; apply: (defaults: SpacingSettings) => SpacingSettings }[] = [
  {
    label: "Compact",
    apply: (d) => ({ spacing: 0.65, lineHeight: 1.25, margin: Math.max(MARGIN_RANGE.min, d.margin - 16) }),
  },
  { label: "Normal", apply: (d) => ({ spacing: d.spacing, lineHeight: d.lineHeight, margin: d.margin }) },
  {
    label: "Relaxed",
    apply: (d) => ({ spacing: 1.35, lineHeight: 1.6, margin: Math.min(MARGIN_RANGE.max, d.margin + 12) }),
  },
];

const sameSpacing = (a: SpacingSettings, b: SpacingSettings) =>
  a.spacing === b.spacing && a.lineHeight === b.lineHeight && a.margin === b.margin;

interface RangeFieldProps {
  label: string;
  value: number;
  range: { min: number; max: number; step: number };
  format: (value: number) => string;
  onChange: (value: number) => void;
}

function RangeField({ label, value, range, format, onChange }: RangeFieldProps) {
  return (
    <FieldLabel label={label}>
      <div className="flex items-center gap-3">
        <input
          type="range"
          className="flex-1 accent-blue-600"
          min={range.min}
          max={range.max}
          step={range.step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <strong className="min-w-[42px] text-right text-xs text-ink">{format(value)}</strong>
      </div>
    </FieldLabel>
  );
}

interface AppearanceSectionProps {
  appearance: Appearance;
  /** The template's defaults, used by the spacing presets. */
  defaults: Appearance;
  onChange: (next: Appearance) => void;
  onReset: () => void;
}

function AppearanceSection({ appearance, defaults, onChange, onReset }: AppearanceSectionProps) {
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

      <RangeField
        label="Text size"
        value={appearance.fontSize}
        range={FONT_SIZE_RANGE}
        format={(v) => `${v}pt`}
        onChange={(v) => update("fontSize", v)}
      />

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

      <fieldset className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <legend className={`${labelTextClass} px-1`}>Spacing</legend>
        <div role="group" aria-label="Spacing presets" className="mb-3 grid grid-cols-3 gap-1.5">
          {SPACING_PRESETS.map(({ label, apply }) => {
            const preset = apply(defaults);
            return (
              <button
                key={label}
                type="button"
                aria-pressed={sameSpacing(appearance, preset)}
                className="rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink aria-pressed:border-blue-600 aria-pressed:bg-blue-50 aria-pressed:text-blue-700"
                onClick={() => onChange({ ...appearance, ...preset })}
              >
                {label}
              </button>
            );
          })}
        </div>
        <RangeField
          label="Section spacing"
          value={appearance.spacing}
          range={SPACING_RANGE}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => update("spacing", v)}
        />
        <RangeField
          label="Line height"
          value={appearance.lineHeight}
          range={LINE_HEIGHT_RANGE}
          format={(v) => v.toFixed(2)}
          onChange={(v) => update("lineHeight", v)}
        />
        <RangeField
          label="Page margins"
          value={appearance.margin}
          range={MARGIN_RANGE}
          format={(v) => `${Math.round((v / 72) * 25.4)}mm`}
          onChange={(v) => update("margin", v)}
        />
      </fieldset>

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
