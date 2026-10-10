import { Image, Text, View, type Styles } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { Appearance } from "../types";
import type { InvoiceView, PartyView } from "./view";

type Style = Styles[string];

// ---------------------------------------------------------------------------
// Theme: derive a full palette from the two colours the user picks.
// ---------------------------------------------------------------------------

export interface PdfTheme {
  font: Appearance["fontFamily"];
  /** Base body size in pt; everything else scales from it. */
  size: number;
  text: string;
  muted: string;
  line: string;
  accent: string;
  /** Accent darkened when needed so it stays readable as text on white. */
  accentText: string;
  accentSoft: string;
  /** Readable text colour on top of `accent`. */
  onAccent: string;
}

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
const rgbToHex = (rgb: number[]) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

/** Mixes `hex` toward white by `amount` (0 = unchanged, 1 = white). */
const tint = (hex: string, amount: number) => rgbToHex(hexToRgb(hex).map((c) => c + (255 - c) * amount));
/** Mixes `hex` toward black by `amount`. */
const shade = (hex: string, amount: number) => rgbToHex(hexToRgb(hex).map((c) => c * (1 - amount)));

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrastOnWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05);

/** Darkens `hex` in steps until it reaches WCAG AA contrast (4.5:1) against white. */
function readableOnWhite(hex: string): string {
  let color = hex;
  for (let step = 0; step < 10 && contrastOnWhite(color) < 4.5; step++) color = shade(color, 0.15);
  return color;
}

export function createPdfTheme(appearance: Appearance): PdfTheme {
  return {
    font: appearance.fontFamily,
    size: appearance.fontSize,
    text: appearance.textColor,
    muted: tint(appearance.textColor, 0.42),
    line: tint(appearance.textColor, 0.86),
    accent: appearance.accentColor,
    accentText: readableOnWhite(appearance.accentColor),
    accentSoft: tint(appearance.accentColor, 0.92),
    onAccent: luminance(appearance.accentColor) > 0.45 ? "#111827" : "#ffffff",
  };
}

export const pageStyle = (theme: PdfTheme, overrides: Style = {}): Style => ({
  fontFamily: theme.font,
  fontSize: theme.size,
  color: theme.text,
  paddingTop: 48,
  paddingHorizontal: 48,
  paddingBottom: 64,
  ...overrides,
});

/**
 * Line height for multi-line body text, as absolute points. react-pdf resolves a unitless lineHeight
 * against a default 18pt unless fontSize is set on the same element, and a lineHeight on <Page>
 * hides `render` text such as page numbers.
 */
const bodyLineHeight = (theme: PdfTheme) => `${theme.size * 1.4}pt`;

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export function Label({ children, color, theme }: { children: ReactNode; color?: string; theme: PdfTheme }) {
  return (
    <Text
      style={{
        fontSize: theme.size * 0.75,
        fontWeight: 700,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: color ?? theme.muted,
        marginBottom: 4,
      }}
    >
      {children}
    </Text>
  );
}

export function Logo({ src, height = 44, style }: { src: string | null; height?: number; style?: Style }) {
  if (!src) return null;
  // react-pdf's <Image> is not an HTML <img> and has no alt attribute.
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={src} style={{ height, maxWidth: 160, objectFit: "contain", ...style }} />;
}

export function PartyBlock({
  title,
  party,
  theme,
  titleColor,
  align = "left",
}: {
  title: string;
  party: PartyView;
  theme: PdfTheme;
  titleColor?: string;
  align?: "left" | "right";
}) {
  const lines = [party.address, party.email, party.phone].filter(Boolean);
  return (
    <View style={{ flex: 1, textAlign: align }}>
      <Label theme={theme} color={titleColor}>
        {title}
      </Label>
      {party.name ? (
        <Text style={{ fontSize: theme.size * 1.2, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>{party.name}</Text>
      ) : null}
      {lines.map((line, i) => (
        <Text key={i} style={{ color: theme.muted, lineHeight: bodyLineHeight(theme) }}>
          {line}
        </Text>
      ))}
      {party.isEmpty ? <Text style={{ color: theme.muted }}>—</Text> : null}
    </View>
  );
}

export function MetaItem({
  label,
  value,
  theme,
  align = "right",
}: {
  label: string;
  value: string;
  theme: PdfTheme;
  align?: "left" | "right";
}) {
  if (!value) return null;
  return (
    <View style={{ textAlign: align, marginBottom: 6 }}>
      <Text style={{ fontSize: theme.size * 0.8, color: theme.muted }}>{label}</Text>
      <Text style={{ fontWeight: 700 }}>{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Items table
// ---------------------------------------------------------------------------

export type TableVariant = "filled" | "lined" | "boxed";

const COLUMNS = [
  { key: "description", label: "Description", style: { flex: 1 } },
  { key: "quantity", label: "Qty", style: { width: 44, textAlign: "right" } },
  { key: "rate", label: "Rate", style: { width: 96, textAlign: "right" } },
  { key: "amount", label: "Amount", style: { width: 104, textAlign: "right" } },
] as const satisfies { key: string; label: string; style: Style }[];

export function ItemsTable({ view, theme, variant }: { view: InvoiceView; theme: PdfTheme; variant: TableVariant }) {
  const cellPad = { paddingVertical: 7, paddingHorizontal: 8, lineHeight: bodyLineHeight(theme) };
  const boxed = variant === "boxed";

  const headerRow: Style = {
    flexDirection: "row",
    ...(variant === "filled" && { backgroundColor: theme.accent, color: theme.onAccent, borderRadius: 3 }),
    ...(variant === "lined" && { borderBottomWidth: 1.5, borderBottomColor: theme.accent }),
    ...(boxed && { backgroundColor: theme.accentSoft, borderWidth: 1, borderColor: theme.line }),
  };
  const headerText: Style = {
    fontWeight: 700,
    fontSize: theme.size * (variant === "lined" ? 0.78 : 0.92),
    ...(variant === "lined" && { textTransform: "uppercase", letterSpacing: 0.6, color: theme.muted }),
  };
  const bodyRow: Style = {
    flexDirection: "row",
    borderBottomWidth: boxed ? 1 : 0.75,
    borderBottomColor: theme.line,
    ...(boxed && { borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.line }),
  };
  const divider = (index: number): Style =>
    boxed && index > 0 ? { borderLeftWidth: 1, borderLeftColor: theme.line } : {};

  return (
    <View style={{ marginTop: 24 }}>
      {/* `fixed` repeats the header on every page when the table spans pages. */}
      <View style={headerRow} fixed>
        {COLUMNS.map((col, i) => (
          <Text key={col.key} style={[cellPad, col.style, headerText, divider(i)]}>
            {col.label}
          </Text>
        ))}
      </View>
      {view.items.length === 0 ? (
        <View style={bodyRow}>
          <Text style={[cellPad, { flex: 1, color: theme.muted }]}>No line items</Text>
        </View>
      ) : (
        view.items.map((item) => (
          <View key={item.id} style={bodyRow} wrap={false}>
            {COLUMNS.map((col, i) => (
              <Text key={col.key} style={[cellPad, col.style, divider(i)]}>
                {item[col.key]}
              </Text>
            ))}
          </View>
        ))
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Totals
// ---------------------------------------------------------------------------

export type TotalsVariant = "rule" | "band" | "double";

export function TotalsBlock({ view, theme, variant }: { view: InvoiceView; theme: PdfTheme; variant: TotalsVariant }) {
  const rows = [
    { label: "Subtotal", value: view.subtotal },
    view.tax && { label: view.tax.label, value: view.tax.amount },
    view.discount && { label: "Discount", value: view.discount },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  const row: Style = { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 };

  const totalRow: Style = {
    ...row,
    alignItems: "center",
    marginTop: 8,
    paddingVertical: 8,
    ...(variant === "rule" && { borderTopWidth: 1.5, borderTopColor: theme.accent }),
    ...(variant === "band" && { backgroundColor: theme.accent, color: theme.onAccent, paddingHorizontal: 10, borderRadius: 3 }),
    ...(variant === "double" && { borderTopWidth: 0.75, borderBottomWidth: 2.5, borderColor: theme.text }),
  };
  const totalColor = variant === "rule" ? theme.accentText : undefined;

  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20 }} wrap={false}>
      <View style={{ width: 230 }}>
        {rows.map((r) => (
          <View key={r.label} style={[row, { paddingHorizontal: variant === "band" ? 10 : 0 }]}>
            <Text style={{ color: theme.muted }}>{r.label}</Text>
            <Text style={{ fontWeight: 700 }}>{r.value}</Text>
          </View>
        ))}
        <View style={totalRow}>
          <Text style={{ fontSize: theme.size * 1.15, lineHeight: 1.3 }}>Amount Due</Text>
          <Text style={{ fontSize: theme.size * 1.5, fontWeight: 700, lineHeight: 1.3, color: totalColor }}>{view.total}</Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Notes & footer
// ---------------------------------------------------------------------------

export function NotesBlock({ notes, theme, title = "Notes" }: { notes: string; theme: PdfTheme; title?: string }) {
  if (!notes) return null;
  return (
    <View style={{ marginTop: 28, paddingTop: 14, borderTopWidth: 0.75, borderTopColor: theme.line }} wrap={false}>
      <Text style={{ fontWeight: 700, marginBottom: 4 }}>{title}</Text>
      <Text style={{ color: theme.muted, lineHeight: bodyLineHeight(theme) }}>{notes}</Text>
    </View>
  );
}

export function PageFooter({ theme, text }: { theme: PdfTheme; text?: string }) {
  // Absolute, `fixed` Text elements are the pattern react-pdf supports for per-page dynamic content.
  // Both `left` and `right` are set so the dynamic text gets a width to lay out in.
  const footer: Style = {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    fontSize: theme.size * 0.75,
    color: theme.muted,
  };
  return (
    <>
      {text ? (
        <Text fixed style={footer}>
          {text}
        </Text>
      ) : null}
      <Text
        fixed
        style={{ ...footer, textAlign: "right" }}
        render={({ pageNumber, totalPages }) => (totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : "")}
      />
    </>
  );
}
