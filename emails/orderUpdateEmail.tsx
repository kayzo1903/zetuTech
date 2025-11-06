import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface OrderUpdateEmailProps {
  name: string;
  orderId: string;
  status: string;
}

export default function OrderUpdateEmail({ name, orderId, status }: OrderUpdateEmailProps) {
  return (
    <EmailLayout preview={`Your order #${orderId} is now ${status}`}>
      <Text style={{ fontSize: "18px", fontWeight: "600" }}>Hi {name},</Text>
      <Text>
        Your order <strong>#{orderId}</strong> is now <strong>{status}</strong>.
      </Text>
      <Text>
        You can track your order’s progress on your account dashboard at{" "}
        <a href="https://zetutech.co.tz/account/orders" style={{ color: "#2563eb" }}>
          ZetuTech Orders
        </a>.
      </Text>
    </EmailLayout>
  );
}
