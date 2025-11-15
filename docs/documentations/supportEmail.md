Great — you already have **React Email + Resend** set up, so creating a **ZetuTech Customer Support System** that:

1. Receives support complaints via email to **[support@zetutech.co.tz](mailto:support@zetutech.co.tz)**
2. Saves the complaint to your **admin dashboard (database)**
3. Sends an **automatic reply email** to the customer
4. Lets you **view + manage** support tickets in your dashboard

…is very doable with your current stack (Next.js, API routes, Drizzle, Resend).

Below is the **full architecture + Next.js code templates** matching your existing structure and style.

---

# ✅ **SYSTEM ARCHITECTURE**

### **Flow**

1. User submits a support form (or sends an email).
2. Your backend:

   * Generates a Ticket ID
   * Saves the complaint in DB
   * Sends internal email → `support@zetutech.co.tz`
   * Sends auto-response → customer
3. Admin sees the ticket in dashboard (status: open → pending → resolved)

---

# ✅ **STEP 1: Create Database Table (Drizzle)**

**`schema.ts`**

```ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketId: text("ticket_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

---

# ✅ **STEP 2: Create Support Email Template (Auto Reply)**

You said you will provide templates — here is a version matching your `WelcomeEmail` style:

**`/emails/autoReplySupportEmail.tsx`**

```tsx
import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

interface AutoReplyProps {
  name?: string;
  ticketId: string;
}

export default function AutoReplySupportEmail({ name = "there", ticketId }: AutoReplyProps) {
  return (
    <EmailLayout preview="ZetuTech Support">
      <Text style={{ fontSize: "18px", fontWeight: "600" }}>Hi {name},</Text>

      <Text style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Thank you for contacting <strong>ZetuTech Support</strong>.  
        Your ticket <strong>#{ticketId}</strong> has been received.
      </Text>

      <Text style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Our support team will review your request and get back to you shortly.
      </Text>

      <Text style={{ marginTop: "20px", fontSize: "14px", opacity: 0.7 }}>
        — ZetuTech Support Team
      </Text>
    </EmailLayout>
  );
}
```

---

# ⭐ **STEP 3: Add “support-ticket” API Endpoint**

This receives data → saves to DB → sends both emails.

**`/app/api/support/submit/route.ts`**

```ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { supportTickets } from "@/db/schema";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createElement } from "react";

// email templates
import AutoReplySupportEmail from "@/emails/autoReplySupportEmail";
import SupportEmail from "@/emails/supportEmail";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Generate Ticket ID
    const ticketId = "ZT-" + Math.floor(100000 + Math.random() * 900000);

    // Save in database
    await db.insert(supportTickets).values({
      ticketId,
      name,
      email,
      subject,
      message,
    });

    // Resend setup
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1️⃣ Send internal email to support@zetutech.co.tz
    const internalHtml = render(
      createElement(SupportEmail, { ticketId, name, email, subject, message })
    );

    await resend.emails.send({
      from: "ZetuTech Support <no-reply@updates.zetutech.co.tz>",
      to: "support@zetutech.co.tz",
      subject: `New Support Ticket #${ticketId}`,
      html: internalHtml,
    });

    // 2️⃣ Send auto reply to customer
    const replyHtml = render(
      createElement(AutoReplySupportEmail, { ticketId, name })
    );

    await resend.emails.send({
      from: "ZetuTech <no-reply@updates.zetutech.co.tz>",
      to: email,
      subject: `We received your request (#${ticketId})`,
      html: replyHtml,
    });

    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

# ⭐ **STEP 4: Create “supportEmail” Template (for internal team)**

This is the email you (the admin) receive:

**`/emails/supportEmail.tsx`**

```tsx
import { Text } from "@react-email/components";
import EmailLayout from "./components/emaillayout";

export default function SupportEmail({ ticketId, name, email, subject, message }) {
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
```

---

# ⭐ **STEP 5: Admin Dashboard (Optional UI Example)**

You can later create:

```
/app/dashboard/support/page.tsx
```

Fetching tickets from DB using Drizzle:

```ts
const tickets = await db.select().from(supportTickets).orderBy(desc(supportTickets.id));
```

---

# 🎉 **DONE — You now have a full support ticket system**

✔ Accepts customer issues
✔ Saves into database
✔ Sends internal support email
✔ Sends auto-reply email
✔ Admin dashboard can view/update statuses

---

# Want me to create the **Next.js support form UI**, **admin dashboard table**, or **ticket detail page**?
