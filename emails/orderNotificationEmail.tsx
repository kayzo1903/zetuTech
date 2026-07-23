// emails/newOrderNotificationEmail.tsx
import { Text, Section, Link } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface NewOrderNotificationEmailProps {
  adminName: string;
  customerName: string;
  orderId: string;
  orderTotal: string;
  orderDate: string;
  itemsCount: number;
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    phone?: string;
  };
}

export default function NewOrderNotificationEmail({
  customerName,
  orderId,
  orderTotal,
  orderDate,
  itemsCount,
  shippingAddress,
}: NewOrderNotificationEmailProps) {
  return (
    <EmailLayout preview={`New Order Received - #${orderId}`}>
      <Text style={heading}>New Order Notification</Text>
      
      <Section style={section}>
        <Text style={greeting}>Hi zetutech</Text>
        
        <Text style={message}>
          A new order has been placed and requires your attention.
        </Text>

        <Section style={orderCard}>
          <Text style={orderCardTitle}>Order Summary</Text>
          
          <Section style={orderDetails}>
            <Text style={detailRow}>
              <span style={detailLabel}>Order ID:</span>
              <span style={detailValue}>#{orderId}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>Customer:</span>
              <span style={detailValue}>{customerName}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>Order Date:</span>
              <span style={detailValue}>{orderDate}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>Items:</span>
              <span style={detailValue}>{itemsCount} item{itemsCount > 1 ? 's' : ''}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>Total Amount:</span>
              <span style={detailValueHighlight}>{orderTotal}</span>
            </Text>
          </Section>

          <Section style={shippingSection}>
            <Text style={sectionTitle}>Shipping Address</Text>
            <Text style={addressText}>
              {shippingAddress.street}<br />
              {shippingAddress.city}<br />
              {shippingAddress.region}
              {shippingAddress.phone && <><br />Phone: {shippingAddress.phone}</>}
            </Text>
          </Section>
        </Section>

        <Section style={buttonSection}>
          <Link
            href={`https://zetutech.co.tz/admin-dashboard/orders/${orderId}`}
            style={primaryButton}
          >
            View Order in Admin Panel
          </Link>
        </Section>

        <Text style={footerNote}>
          This order is currently in <strong>&quot;Pending&quot;</strong> status and awaits processing.
        </Text>

        <Text style={supportText}>
          This is an automated notification. Please process the order promptly.
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Styles
const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const greeting = {
  fontSize: "16px",
  color: "#374151",
  marginBottom: "16px",
};

const message = {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "1.5",
  marginBottom: "24px",
};

const orderCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "24px",
};

const orderCardTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "16px",
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "8px",
};

const orderDetails = {
  marginBottom: "16px",
};

const detailRow = {
  fontSize: "14px",
  color: "#475569",
  lineHeight: "1.8",
  margin: "4px 0",
};

const detailLabel = {
  fontWeight: "500",
  color: "#64748b",
  display: "inline-block",
  width: "100px",
};

const detailValue = {
  fontWeight: "400",
  color: "#1e293b",
};

const detailValueHighlight = {
  fontWeight: "600",
  color: "#059669",
  fontSize: "15px",
};

const shippingSection = {
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #e2e8f0",
};

const sectionTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#475569",
  marginBottom: "8px",
};

const addressText = {
  fontSize: "14px",
  color: "#475569",
  lineHeight: "1.5",
  fontStyle: "normal",
};

const buttonSection = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const primaryButton = {
  backgroundColor: "#059669",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-block",
};

const footerNote = {
  fontSize: "14px",
  color: "#dc2626",
  textAlign: "center" as const,
  fontStyle: "italic",
  marginBottom: "16px",
  padding: "12px",
  backgroundColor: "#fef2f2",
  borderRadius: "4px",
};

const supportText = {
  fontSize: "12px",
  color: "#6b7280",
  textAlign: "center" as const,
  marginTop: "16px",
};

const section = {
  marginBottom: "20px",
};