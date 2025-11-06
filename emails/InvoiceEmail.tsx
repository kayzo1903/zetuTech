import { Text, Button, Section, Column, Row } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceEmailProps {
  name: string;
  invoiceId: string;
  items: InvoiceItem[];
  total: number;
}

export default function InvoiceEmail({ name, invoiceId, items, total }: InvoiceEmailProps) {
  return (
    <EmailLayout preview={`Your ZetuTech invoice #${invoiceId}`}>
      <Text style={{ fontSize: "18px", fontWeight: "600" }}>Hello {name},</Text>
      <Text>
        Here&apos;s your invoice from <strong>ZetuTech</strong>:
      </Text>

      {/* Invoice Items - Mobile Friendly */}
      <Section style={{ marginTop: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
        {/* Header */}
        <Row style={{ backgroundColor: "#f3f4f6", padding: "12px 8px" }}>
          <Column style={{ fontWeight: "600", fontSize: "14px" }}>Item</Column>
          <Column style={{ fontWeight: "600", fontSize: "14px", textAlign: "center", width: "60px" }}>Qty</Column>
          <Column style={{ fontWeight: "600", fontSize: "14px", textAlign: "right", width: "100px" }}>Price (TZS)</Column>
        </Row>

        {/* Items */}
        {items.map((item, index) => (
          <Row 
            key={item.name} 
            style={{ 
              padding: "12px 8px", 
              borderBottom: index < items.length - 1 ? "1px solid #e5e7eb" : "none",
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa"
            }}
          >
            <Column style={{ fontSize: "14px" }}>{item.name}</Column>
            <Column style={{ fontSize: "14px", textAlign: "center", width: "60px" }}>{item.quantity}</Column>
            <Column style={{ fontSize: "14px", textAlign: "right", width: "100px" }}>{item.price.toLocaleString()}</Column>
          </Row>
        ))}
      </Section>

      {/* Total */}
      <Section style={{ marginTop: "16px", textAlign: "right" }}>
        <Text style={{ fontSize: "16px", fontWeight: "700" }}>
          Total: {total.toLocaleString()} TZS
        </Text>
      </Section>

      {/* Call to Action */}
      <Section style={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          href={`https://zetutech.co.tz/invoices/${invoiceId}`}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          View Invoice
        </Button>
      </Section>

      {/* Fallback for very basic email clients */}
      <Section style={{ display: "none", maxHeight: "0", overflow: "hidden" }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Invoice Items:</Text>
        {items.map((item, index) => (
          <Text key={item.name} style={{ fontSize: "12px" }}>
            {index + 1}. {item.name} - Qty: {item.quantity} - Price: {item.price.toLocaleString()} TZS
          </Text>
        ))}
        <Text style={{ fontSize: "14px", fontWeight: "700" }}>
          Total: {total.toLocaleString()} TZS
        </Text>
      </Section>
    </EmailLayout>
  );
}