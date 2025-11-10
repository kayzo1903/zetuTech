import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface SupportEmailProps {
  name: string;
  ticketId: string;
}

export default function SupportEmail({ name, ticketId }: SupportEmailProps) {
  return (
    <EmailLayout preview="We received your support request">
      <Text style={{ fontSize: "18px", fontWeight: "600" }}>Hi {name},</Text>
      <Text>
        Thanks for reaching out to <strong>ZetuTech Support</strong>. Your
        ticket number is <strong>#{ticketId}</strong>. Our team will get back to
        you within 24 hours.
      </Text>
      <Text style={{ fontSize: "14px", color: "#6b7280" }}>
        You can reply to this email if you’d like to add more details.
      </Text>
    </EmailLayout>
  );
}
