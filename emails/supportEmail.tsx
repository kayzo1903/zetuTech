import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface SupportEmailProps {
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}


export default function SupportEmail({ ticketId, name, email, subject, message } : SupportEmailProps) {
  return (
    <EmailLayout preview="New Support Ticket">
      <Text style={{ fontSize: "18px", fontWeight: "700" }}>
        New Support Ticket #{ticketId}
      </Text>

      <Text><strong>Name:</strong> {name}</Text>
      <Text><strong>Email:</strong> {email}</Text>
      <Text><strong>Subject:</strong> {subject}</Text>
      <Text><strong>Message:</strong></Text>
      <Text>{message}</Text>

      <Text style={{ marginTop: "20px", fontSize: "14px", opacity: 0.7 }}>
        — ZetuTech System
      </Text>
    </EmailLayout>
  );
}
