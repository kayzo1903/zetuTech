import { NextResponse } from "next/server";
import { z } from "zod";
import { render } from "@react-email/render";
import { createElement } from "react";
import { db } from "@/db"; // your drizzle db instance

// email templates
import AutoReplySupportEmail from "@/emails/autoReplySupportEmail";
import AutoReplyContactEmail from "@/emails/autoReplyContactEmail";
import InternalMessageEmail from "@/emails/internalMessage";
import { messages } from "@/db/schema/messages";
import { Resend } from "resend";


// ----------------------
// Server-side ZOD schema
// ----------------------
const MessageSchema = z.object({
  type: z.enum(["support", "contact"]),
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = MessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { type, name, email, subject, message } = parsed.data;

    const resend = new Resend(process.env.RESEND_API_KEY)

    const ticketId =
      "ZT-" +
      new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14) +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase();


      await db.insert(messages).values({
        type,
        name,
        ticketId ,
        email,
        subject,
        message,
      });

    // Prepare and send internal email
    const internalHtml = await render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createElement(InternalMessageEmail, { type, ticketId, name, email, subject, message } as any)
    );

    const internalTo = type === "support" ? "support@zetutech.co.tz" : "contact@zetutech.co.tz";

    await resend.emails.send({
      from: "ZetuTech <no-reply@updates.zetutech.co.tz>",
      to: internalTo,
      subject: type === "support" ? `New Support Ticket ${ticketId ?? ""}` : `New Contact Message: ${subject}`,
      html: await internalHtml,
    });

    // Send auto-reply to user
    if (type === "support") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replyHtml = render(createElement(AutoReplySupportEmail, { name, ticketId } as any));
      await resend.emails.send({
        from: "ZetuTech Support <no-reply@updates.zetutech.co.tz>",
        to: email,
        subject: `We received your support request (${ticketId})`,
        html: await replyHtml,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replyHtml = render(createElement(AutoReplyContactEmail, { name } as any));
      await resend.emails.send({
        from: "ZetuTech <no-reply@updates.zetutech.co.tz>",
        to: email,
        subject: `Thanks for contacting ZetuTech`,
        html: await replyHtml,
      });
    }

    return NextResponse.json({ success: true, ticketId });
  } catch (err) {
    console.error("Message submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
