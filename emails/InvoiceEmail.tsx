// emails/InvoiceEmail.tsx
import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Img,
  Row,
  Column,
} from "@react-email/components";

interface InvoiceEmailProps {
  invoiceId: string;
  orderId: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

export default function InvoiceEmail({
  invoiceId,
  orderId,
  date,
  customerName,
  customerEmail,
  items,
  subtotal,
  shipping,
  tax,
  total,
  paymentMethod,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://zetutech.co.tz/logo.png"
            width="120"
            alt="ZetuTech"
            style={{ margin: "0 auto 20px" }}
          />
          <Text style={heading}>Invoice #{invoiceId}</Text>
          <Text style={subheading}>
            Hi {customerName}, here’s your invoice for order #{orderId} placed on{" "}
            {new Date(date).toLocaleDateString()}.
          </Text>

          <Section style={section}>
            <Row style={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}>
              <Column style={{ width: "60%" }}>Item</Column>
              <Column style={{ width: "20%", textAlign: "center" }}>Qty</Column>
              <Column style={{ width: "20%", textAlign: "right" }}>Price</Column>
            </Row>

            {items.map((item, i) => (
              <Row key={i} style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
                <Column style={{ width: "60%" }}>{item.name}</Column>
                <Column style={{ width: "20%", textAlign: "center" }}>{item.quantity}</Column>
                <Column style={{ width: "20%", textAlign: "right" }}>
                  {item.price.toLocaleString()} TZS
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={totalsSection}>
            <Row>
              <Column style={label}>Subtotal:</Column>
              <Column style={value}>{subtotal.toLocaleString()} TZS</Column>
            </Row>
            <Row>
              <Column style={label}>Shipping:</Column>
              <Column style={value}>{shipping.toLocaleString()} TZS</Column>
            </Row>
            <Row>
              <Column style={label}>Tax:</Column>
              <Column style={value}>{tax.toLocaleString()} TZS</Column>
            </Row>
            <Hr />
            <Row>
              <Column style={labelTotal}>Total:</Column>
              <Column style={valueTotal}>{total.toLocaleString()} TZS</Column>
            </Row>
          </Section>

          <Text style={paymentInfo}>
            Payment Method: <strong>{paymentMethod.replace("_", " ").toUpperCase()}</strong>
          </Text>

          {customerEmail && (
            <Text style={note}>A copy of this invoice has been sent to {customerEmail}.</Text>
          )}

          <Hr />
          <Text style={footer}>
            Thank you for shopping with <strong>ZetuTech</strong> — Smart Tech, Smart Living.
            <br />
            <Link href="https://zetutech.co.tz" style={link}>
              Visit our store →
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// 🖌️ Styles
const main = {
  backgroundColor: "#f9fafb",
  padding: "40px 0",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "30px",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "10px",
  textAlign: "center" as const,
};

const subheading = {
  color: "#444",
  fontSize: "14px",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const section = {
  marginBottom: "20px",
};

const totalsSection = {
  marginTop: "20px",
};

const label = { width: "70%", textAlign: "right" as const, paddingRight: "10px", color: "#333" };
const value = { width: "30%", textAlign: "right" as const, fontWeight: "bold" };

const labelTotal = { ...label, fontSize: "16px", fontWeight: "bold" };
const valueTotal = { ...value, fontSize: "16px", color: "#16a34a" };

const paymentInfo = { textAlign: "center" as const, marginTop: "15px", fontSize: "14px" };
const note = { textAlign: "center" as const, color: "#666", fontSize: "13px" };
const footer = { textAlign: "center" as const, fontSize: "12px", color: "#888" };
const link = { color: "#3b82f6", textDecoration: "none" };
