//app/api/email/send/route.ts
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createElement } from "react";
import WelcomeEmail from "@/emails/welcomeEmail";
import InvoiceEmail from "@/emails/InvoiceEmail";
import SupportEmail from "@/emails/supportEmail";
import OrderUpdateEmail from "@/emails/orderUpdateEmail";
import NewOrderNotificationEmail from "@/emails/orderNotificationEmail";

export async function POST(req: Request) {
  const { type, to, data } = await req.json();

  // Initialize Resend client (server-side)
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not set" },
      { status: 500 }
    );
  }
  const resend = new Resend(apiKey);

  // Resolve email component based on type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let EmailComponent: (props: any) => any;
  let subject = "";

  switch (type) {
    case "welcome":
      EmailComponent = WelcomeEmail;
      subject = "Welcome to zetuTech 🎉";
      break;
    case "invoice":
      EmailComponent = InvoiceEmail;
      subject = `Your zetuTech Invoice #${data.invoiceId}`;
      break;
    case "support":
      EmailComponent = SupportEmail;
      subject = `zetuTech Support Ticket #${data.ticketId}`;
      break;
    case "order-update":
      EmailComponent = OrderUpdateEmail;
      subject = `Your order #${data.orderId} is ${data.status}`;
      break;
    case "order-notification":
      EmailComponent = NewOrderNotificationEmail;
      subject = `New Order Received - #${data.orderId}`;
      break;
      
    default:
      return NextResponse.json(
        { error: "Invalid email type" },
        { status: 400 }
      );
  }

  // Render HTML from the React email component without JSX in a .ts file
  const html = render(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createElement(EmailComponent as any, { ...(data ?? {}) })
  );

  if (!to) {
    return NextResponse.json({ error: "Missing 'to' field" }, { status: 400 });
  }

  await resend.emails.send({
    from: "ZetuTech <no-reply@updates.zetutech.co.tz>",
    to,
    subject,
    html: await html,
  });

  return NextResponse.json({ success: true });
}
