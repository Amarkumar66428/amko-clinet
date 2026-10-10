import { memo } from "react";

const FONTS = [
  ["Inter", "Inter"],
  ["Arial", "Arial"],
  ["Helvetica", "Helvetica"],
  ["Georgia", "Georgia"],
  ["Times", "Times New Roman"],
];

function AppearanceEditor({ appearance, setAppearance }) {
  const update = (field, value) => setAppearance((prev) => ({ ...prev, [field]: value }));

  return (
    <section className="editor-card">
      <h3>Appearance</h3>

      <label className="field">
        <span>Font</span>
        <select value={appearance.fontFamily} onChange={(e) => update("fontFamily", e.target.value)}>
          {FONTS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Font size</span>
        <div className="range-row">
          <input
            type="range"
            min="10"
            max="20"
            step="1"
            value={appearance.fontSize}
            onChange={(e) => update("fontSize", Number(e.target.value))}
          />
          <strong>{appearance.fontSize}px</strong>
        </div>
      </label>

      <label className="color-field">
        <span>Accent</span>
        <input type="color" value={appearance.accentColor} onChange={(e) => update("accentColor", e.target.value)} />
      </label>

      <label className="color-field">
        <span>Text</span>
        <input type="color" value={appearance.textColor} onChange={(e) => update("textColor", e.target.value)} />
      </label>
    </section>
  );
}

export default memo(AppearanceEditor);
