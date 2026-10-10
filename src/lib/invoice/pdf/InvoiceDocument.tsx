import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { Appearance, Invoice, TemplateId } from "../types";
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
}

function ModernTemplate({ view, theme }: TemplateProps) {
  return (
    <Page size="A4" style={pageStyle(theme)}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Logo src={view.logo} style={{ marginBottom: 12 }} />
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

      <View style={{ height: 2, backgroundColor: theme.accent, marginTop: 20, marginBottom: 26 }} />

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

function BoldTemplate({ view, theme }: TemplateProps) {
  return (
    <Page size="A4" style={pageStyle(theme)}>
      {/* Negative margins bleed the band to the page edges while continuation pages keep normal padding. */}
      <View
        style={{
          marginTop: -48,
          marginHorizontal: -48,
          backgroundColor: theme.accent,
          color: theme.onAccent,
          paddingHorizontal: 48,
          paddingTop: 40,
          paddingBottom: 28,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <View>
          <Logo src={view.logo} style={{ marginBottom: 14 }} />
          <Text style={{ fontSize: theme.size * 3, fontWeight: 700, letterSpacing: 2, lineHeight: 1 }}>INVOICE</Text>
          {view.sender.name ? <Text style={{ marginTop: 6, opacity: 0.85 }}>{view.sender.name}</Text> : null}
        </View>
        <View style={{ textAlign: "right" }}>
          {view.number ? (
            <Text style={{ fontSize: theme.size * 1.3, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>#{view.number}</Text>
          ) : null}
          {view.issueDate ? <Text style={{ opacity: 0.85 }}>Issued {view.issueDate}</Text> : null}
          {view.dueDate ? <Text style={{ opacity: 0.85 }}>Due {view.dueDate}</Text> : null}
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 32, marginTop: 28 }}>
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

function ClassicTemplate({ view, theme }: TemplateProps) {
  const contact = [view.sender.email, view.sender.phone].filter(Boolean).join("  ·  ");
  return (
    <Page size="A4" style={pageStyle(theme)}>
      <View style={{ alignItems: "center", textAlign: "center" }}>
        <Logo src={view.logo} style={{ marginBottom: 10 }} />
        {view.sender.name ? (
          <Text style={{ fontSize: theme.size * 2, fontWeight: 700, lineHeight: 1.25, color: theme.accentText }}>{view.sender.name}</Text>
        ) : null}
        {view.sender.address ? <Text style={{ color: theme.muted }}>{view.sender.address}</Text> : null}
        {contact ? <Text style={{ color: theme.muted }}>{contact}</Text> : null}
      </View>

      <View style={{ marginTop: 18, borderTopWidth: 2, borderTopColor: theme.accent }} />
      <View style={{ marginTop: 2, marginBottom: 24, borderTopWidth: 0.75, borderTopColor: theme.accent }} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 32 }}>
        <PartyBlock title="Bill to" party={view.client} theme={theme} />
        <View style={{ width: 200 }}>
          <Text style={{ fontSize: theme.size * 1.8, fontWeight: 700, lineHeight: 1.2, textAlign: "right", marginBottom: 8 }}>
            Invoice
          </Text>
          {[
            ["Invoice no.", view.number],
            ["Date", view.issueDate],
            ["Due date", view.dueDate],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 1.5 }}>
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

function MinimalTemplate({ view, theme }: TemplateProps) {
  return (
    <Page size="A4" style={pageStyle(theme, { paddingTop: 56, paddingHorizontal: 56 })}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Text style={{ fontSize: theme.size * 1.6, fontWeight: 700, lineHeight: 1.25 }}>Invoice</Text>
          {view.number ? <Text style={{ color: theme.muted }}>{view.number}</Text> : null}
        </View>
        <Logo src={view.logo} height={36} />
      </View>

      <View style={{ flexDirection: "row", gap: 24, marginTop: 36 }}>
        <PartyBlock title="From" party={view.sender} theme={theme} />
        <PartyBlock title="To" party={view.client} theme={theme} />
        <View style={{ width: 110 }}>
          <Label theme={theme}>Issued</Label>
          <Text style={{ marginBottom: 8 }}>{view.issueDate || "—"}</Text>
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
}

export function InvoiceDocument({ templateId, invoice, appearance }: InvoiceDocumentProps) {
  const view = buildInvoiceView(invoice);
  const Template = TEMPLATE_COMPONENTS[templateId];
  const title = view.number ? `Invoice ${view.number}` : "Invoice";
  return (
    <Document title={title} author={view.sender.name || undefined} creator="AMKO" producer="AMKO" language="en">
      <Template view={view} theme={createPdfTheme(appearance)} />
    </Document>
  );
}
