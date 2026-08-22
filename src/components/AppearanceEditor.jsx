import { memo } from "react";

function AppearanceEditor({
  appearance,
  setAppearance,
}) {

  const update =
    (field, value) => {

      setAppearance(prev => ({
        ...prev,
        [field]: value,
      }));

    };

  return (
    <section className="editor-card">

      <h3>
        Appearance
      </h3>

      <label className="field">

        <span>
          Font
        </span>

        <select
          value={
            appearance.fontFamily
          }
          onChange={event =>
            update(
              "fontFamily",
              event.target.value
            )
          }
        >
          <option value="Inter">
            Inter
          </option>

          <option value="Arial">
            Arial
          </option>

          <option value="Helvetica">
            Helvetica
          </option>

          <option value="Georgia">
            Georgia
          </option>

          <option value="Times">
            Times New Roman
          </option>
        </select>

      </label>

      <label className="field">

        <span>
          Font size
        </span>

        <div className="range-row">

          <input
            type="range"
            min="10"
            max="20"
            step="1"
            value={
              appearance.fontSize
            }
            onChange={event =>
              update(
                "fontSize",
                Number(
                  event.target.value
                )
              )
            }
          />

          <strong>
            {appearance.fontSize}px
          </strong>

        </div>

      </label>

      <label className="color-field">

        <span>
          Accent
        </span>

        <input
          type="color"
          value={
            appearance.accentColor
          }
          onChange={event =>
            update(
              "accentColor",
              event.target.value
            )
          }
        />

      </label>

      <label className="color-field">

        <span>
          Text
        </span>

        <input
          type="color"
          value={
            appearance.textColor
          }
          onChange={event =>
            update(
              "textColor",
              event.target.value
            )
          }
        />

      </label>

    </section>
  );
}

export default memo(
  AppearanceEditor
);