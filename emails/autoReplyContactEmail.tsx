import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface AutoReplyProps {
  name?: string;
}

export default function AutoReplyContactEmail({ name = "there" }: AutoReplyProps) {
  return (
    <EmailLayout preview="Thanks for contacting ZetuTech">
      <Text style={{ fontSize: "18px", fontWeight: "600" }}>Hi {name},</Text>

      <Text style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Thank you for getting in touch with ZetuTech. We received your message and will respond shortly.
      </Text>

      <Text style={{ marginTop: "20px", fontSize: "14px", opacity: 0.7 }}>
        — ZetuTech Team
      </Text>
    </EmailLayout>
  );
}
