import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { Appearance, Invoice, Orientation, TemplateId } from "../types";
import {
  ItemsTable,
  Label,
  Logo,
  MetaItem,
  NotesBlock,
  PageFooter,
  PartyBlock,
  TotalsBlock,
  createPdfTheme,
  pageStyle,
  type PdfTheme,
} from "./parts";
import { buildInvoiceView, type InvoiceView } from "./view";

interface TemplateProps {
  view: InvoiceView;
  theme: PdfTheme;
  orientation: Orientation;
}

function ModernTemplate({ view, theme, orientation }: TemplateProps) {
  return (
    <Page size="A4" orientation={orientation} style={pageStyle(theme)}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Logo src={view.logo} style={{ marginBottom: theme.gap(12) }} />
          <Label theme={theme} color={theme.accentText}>
            Invoice
          </Label>
          <Text style={{ fontSize: theme.size * 2.4, fontWeight: 700, lineHeight: 1.1 }}>
            {view.number ? `#${view.number}` : "Invoice"}
          </Text>
        </View>
        <View>
          <MetaItem label="Date" value={view.issueDate} theme={theme} />
          <MetaItem label="Due date" value={view.dueDate} theme={theme} />
        </View>
      </View>

      <View style={{ height: 2, backgroundColor: theme.accent, marginTop: theme.gap(20), marginBottom: theme.gap(26) }} />

      <View style={{ flexDirection: "row", gap: 32 }}>
        <PartyBlock title="From" party={view.sender} theme={theme} titleColor={theme.accentText} />
        <PartyBlock title="Billed to" party={view.client} theme={theme} titleColor={theme.accentText} />
      </View>

      <ItemsTable view={view} theme={theme} variant="filled" />
      <TotalsBlock view={view} theme={theme} variant="rule" />
      <NotesBlock notes={view.notes} theme={theme} />
      <PageFooter theme={theme} />
    </Page>
  );
}

function BoldTemplate({ view, theme, orientation }: TemplateProps) {
  return (
    <Page size="A4" orientation={orientation} style={pageStyle(theme)}>
      {/* Negative margins bleed the band to the page edges while continuation pages keep normal padding. */}
      <View
        style={{
          marginTop: -theme.margin,
          marginHorizontal: -theme.margin,
          backgroundColor: theme.accent,
          color: theme.onAccent,
          paddingHorizontal: theme.margin,
          paddingTop: theme.margin - 8,
          paddingBottom: theme.gap(28),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <View>
          <Logo src={view.logo} style={{ marginBottom: theme.gap(14) }} />
          <Text style={{ fontSize: theme.size * 3, fontWeight: 700, letterSpacing: 2, lineHeight: 1 }}>INVOICE</Text>
          {view.sender.name ? <Text style={{ marginTop: theme.gap(6), opacity: 0.85 }}>{view.sender.name}</Text> : null}
        </View>
        <View style={{ textAlign: "right" }}>
          {view.number ? (
            <Text style={{ fontSize: theme.size * 1.3, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>#{view.number}</Text>
          ) : null}
          {view.issueDate ? <Text style={{ opacity: 0.85 }}>Issued {view.issueDate}</Text> : null}
          {view.dueDate ? <Text style={{ opacity: 0.85 }}>Due {view.dueDate}</Text> : null}
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 32, marginTop: theme.gap(28) }}>
        <PartyBlock title="Billed to" party={view.client} theme={theme} titleColor={theme.accentText} />
        <PartyBlock title="From" party={view.sender} theme={theme} titleColor={theme.accentText} align="right" />
      </View>

      <ItemsTable view={view} theme={theme} variant="lined" />
      <TotalsBlock view={view} theme={theme} variant="band" />
      <NotesBlock notes={view.notes} theme={theme} title="Terms & notes" />
      <PageFooter theme={theme} />
    </Page>
  );
}

function ClassicTemplate({ view, theme, orientation }: TemplateProps) {
  const contact = [view.sender.email, view.sender.phone].filter(Boolean).join("  ·  ");
  return (
    <Page size="A4" orientation={orientation} style={pageStyle(theme)}>
      <View style={{ alignItems: "center", textAlign: "center" }}>
        <Logo src={view.logo} style={{ marginBottom: theme.gap(10) }} />
        {view.sender.name ? (
          <Text style={{ fontSize: theme.size * 2, fontWeight: 700, lineHeight: 1.25, color: theme.accentText }}>{view.sender.name}</Text>
        ) : null}
        {view.sender.address ? <Text style={{ color: theme.muted }}>{view.sender.address}</Text> : null}
        {contact ? <Text style={{ color: theme.muted }}>{contact}</Text> : null}
        {view.sender.customLines.length ? (
          <Text style={{ color: theme.muted }}>{view.sender.customLines.join("  ·  ")}</Text>
        ) : null}
      </View>

      <View style={{ marginTop: theme.gap(18), borderTopWidth: 2, borderTopColor: theme.accent }} />
      <View style={{ marginTop: 2, marginBottom: theme.gap(24), borderTopWidth: 0.75, borderTopColor: theme.accent }} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 32 }}>
        <PartyBlock title="Bill to" party={view.client} theme={theme} />
        <View style={{ width: 200 }}>
          <Text style={{ fontSize: theme.size * 1.8, fontWeight: 700, lineHeight: 1.2, textAlign: "right", marginBottom: theme.gap(8) }}>
            Invoice
          </Text>
          {[
            ["Invoice no.", view.number],
            ["Date", view.issueDate],
            ["Due date", view.dueDate],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: theme.gap(1.5) }}>
                <Text style={{ color: theme.muted }}>{label}</Text>
                <Text style={{ fontWeight: 700 }}>{value}</Text>
              </View>
            ))}
        </View>
      </View>

      <ItemsTable view={view} theme={theme} variant="boxed" />
      <TotalsBlock view={view} theme={theme} variant="double" />
      <NotesBlock notes={view.notes} theme={theme} />
      <PageFooter theme={theme} text="Thank you for your business." />
    </Page>
  );
}

function MinimalTemplate({ view, theme, orientation }: TemplateProps) {
  return (
    <Page size="A4" orientation={orientation} style={pageStyle(theme)}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Text style={{ fontSize: theme.size * 1.6, fontWeight: 700, lineHeight: 1.25 }}>Invoice</Text>
          {view.number ? <Text style={{ color: theme.muted }}>{view.number}</Text> : null}
        </View>
        <Logo src={view.logo} height={36} />
      </View>

      <View style={{ flexDirection: "row", gap: 24, marginTop: theme.gap(36) }}>
        <PartyBlock title="From" party={view.sender} theme={theme} />
        <PartyBlock title="To" party={view.client} theme={theme} />
        <View style={{ width: 110 }}>
          <Label theme={theme}>Issued</Label>
          <Text style={{ marginBottom: theme.gap(8) }}>{view.issueDate || "—"}</Text>
          {view.dueDate ? (
            <>
              <Label theme={theme}>Due</Label>
              <Text>{view.dueDate}</Text>
            </>
          ) : null}
        </View>
      </View>

      <ItemsTable view={view} theme={theme} variant="lined" />
      <TotalsBlock view={view} theme={theme} variant="rule" />
      <NotesBlock notes={view.notes} theme={theme} />
      <PageFooter theme={theme} />
    </Page>
  );
}

const TEMPLATE_COMPONENTS: Record<TemplateId, (props: TemplateProps) => React.ReactElement> = {
  modern: ModernTemplate,
  bold: BoldTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

export interface InvoiceDocumentProps {
  templateId: TemplateId;
  invoice: Invoice;
  appearance: Appearance;
  /** Defaults to portrait. */
  orientation?: Orientation;
}

export function InvoiceDocument({ templateId, invoice, appearance, orientation = "portrait" }: InvoiceDocumentProps) {
  const view = buildInvoiceView(invoice);
  const Template = TEMPLATE_COMPONENTS[templateId];
  const title = view.number ? `Invoice ${view.number}` : "Invoice";
  return (
    <Document title={title} author={view.sender.name || undefined} creator="amk" producer="amk" language="en">
      <Template view={view} theme={createPdfTheme(appearance)} orientation={orientation} />
    </Document>
  );
}
