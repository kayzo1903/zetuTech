import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface AutoReplyProps {
  name?: string;
  ticketId: string;
}

export default function AutoReplySupportEmail({ name = "there", ticketId }: AutoReplyProps) {
  return (
    <EmailLayout preview="zetuTech Support">
      <Text style={{ fontSize: "18px", fontWeight: "600" }}>Hi {name},</Text>

      <Text style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Thank you for contacting <strong>zetuTech Support</strong>.  
        Your ticket <strong>#{ticketId}</strong> has been received.
      </Text>

      <Text style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Our support team will review your request and get back to you shortly.
      </Text>

      <Text style={{ marginTop: "20px", fontSize: "14px", opacity: 0.7 }}>
        — zetuTech Support Team
      </Text>
    </EmailLayout>
  );
}
