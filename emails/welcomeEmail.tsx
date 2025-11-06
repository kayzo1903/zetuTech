import { Text, Button } from "@react-email/components";
import EmailLayout from "./components/emaillayout";


interface WelcomeEmailProps {
  name?: string;
}

export default function WelcomeEmail({ name = "there" }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to ZetuTech">
      <Text style={{ fontSize: "18px", fontWeight: "600" }}>Hi {name},</Text>
      <Text style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Welcome to <strong>ZetuTech</strong> — your one-stop shop for tech and electronics in Tanzania!
      </Text>
      <Button
        href="https://zetutech.co.tz"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#2563eb",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
          marginTop: "16px",
        }}
      >
        Explore ZetuTech
      </Button>
    </EmailLayout>
  );
}
