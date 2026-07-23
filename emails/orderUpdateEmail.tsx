// emails/orderUpdateEmail.tsx
import { Text, Section, Link } from "@react-email/components";
import EmailLayout from "./components/emaillayout";


interface OrderUpdateEmailProps {
  name: string;
  orderId: string;
  status: string;
}

export default function OrderUpdateEmail({ name, orderId, status }: OrderUpdateEmailProps) {
  const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
      confirmed: "has been confirmed and is being prepared for processing",
      processing: "is now being processed and prepared for shipment",
      shipped: "has been shipped and is on its way to you",
      delivered: "has been successfully delivered",
      cancelled: "has been cancelled as requested",
      refunded: "has been refunded",
    };
    return messages[status] || `is now ${status}`;
  };

  const getActionMessage = (status: string) => {
    const messages: Record<string, string> = {
      shipped: "You can track your package using the tracking information in your account.",
      delivered: "We hope you enjoy your purchase! If you have any questions, feel free to contact our support team.",
      cancelled: "If this was unexpected or you have questions, please contact our support team.",
      refunded: "The refund has been processed and should reflect in your account within 5-7 business days.",
    };
    return messages[status] || "You can check the latest status in your account dashboard.";
  };

  return (
    <EmailLayout preview={`Your order #${orderId} is ${status}`}>
      <Text style={heading}>Order Status Update</Text>
      
      <Section style={section}>
        <Text style={greeting}>Hi {name},</Text>
        
        <Text style={message}>
          Your order <strong style={highlight}>#{orderId}</strong> {getStatusMessage(status)}.
        </Text>

        <Text style={actionMessage}>
          {getActionMessage(status)}
        </Text>

        <Section style={buttonSection}>
          <Link
            href={`https://zetutech.co.tz/account/orders/${orderId}`}
            style={button}
          >
            View Order Details
          </Link>
        </Section>

        <Text style={supportText}>
          Need help? Contact our support team at{" "}
          <Link href="mailto:support@zetutech.co.tz" style={link}>
            support@zetutech.co.tz
          </Link>
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
  marginBottom: "16px",
};

const actionMessage = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.5",
  marginBottom: "24px",
};

const highlight = {
  color: "#2563eb",
};

const buttonSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-block",
};

const supportText = {
  fontSize: "14px",
  color: "#6b7280",
  textAlign: "center" as const,
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
};

const section = {
  marginBottom: "20px",
};