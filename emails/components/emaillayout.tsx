// emails/components/EmailLayout.tsx
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Hr,
    Preview,
  } from "@react-email/components";
  import * as React from "react";
  
  interface EmailLayoutProps {
    preview?: string;
    title?: string;
    children: React.ReactNode;
  }
  
  export default function EmailLayout({
    preview,
    title,
    children,
  }: EmailLayoutProps) {
    return (
      <Html>
        <Head>
          {title && <title>{title}</title>}
        </Head>
  
        {preview && <Preview>{preview}</Preview>}
  
        <Body
          style={{
            backgroundColor: "#f9fafb",
            color: "#111827",
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: "24px",
          }}
        >
          <Container
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Header */}
            <Section
              style={{
                background: "linear-gradient(to right, #f9fafb, #ffffff, #f3f4f6)",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: 0,
                }}
              >
                zetu<span style={{ color: "#2563eb" }}>Tech</span>
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginTop: "4px",
                }}
              >
                Smart shopping. Better living.
              </Text>
            </Section>
  
            <Hr style={{ borderColor: "#e5e7eb", margin: 0 }} />
  
            {/* Main Content */}
            <Section style={{ padding: "24px" }}>{children}</Section>
  
            {/* Footer */}
            <Hr style={{ borderColor: "#e5e7eb", margin: "0" }} />
            <Section
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#9ca3af",
                padding: "16px 0",
              }}
            >
              <Text>
                © {new Date().getFullYear()} ZetuTech. All rights reserved.
                <br />
                Free shipping in Dar es Salaam • 1-Year Warranty
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
  