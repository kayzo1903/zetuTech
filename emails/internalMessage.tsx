import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface InternalProps {
  type: string;
  ticketId?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function InternalMessageEmail({ type, ticketId, name, email, subject, message }: InternalProps) {
  return (
    <EmailLayout preview={`New ${type} message`}>
      <Text style={{ fontSize: "18px", fontWeight: "700" }}>
        New {type === "support" ? "Support Ticket" : "Contact Message"} {ticketId ? `#${ticketId}` : ""}
      </Text>

      <Text><strong>Name:</strong> {name}</Text>
      <Text><strong>Email:</strong> {email}</Text>
      <Text><strong>Subject:</strong> {subject}</Text>

      <Text style={{ marginTop: "8px" }}><strong>Message:</strong></Text>
      <Text>{message}</Text>

      <Text style={{ marginTop: "20px", fontSize: "14px", opacity: 0.7 }}>
        — ZetuTech System
      </Text>
    </EmailLayout>
  );
}
