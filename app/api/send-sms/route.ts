// app/api/send-sms/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    const apiKey = process.env.BEEM_API_KEY!;
    const secretKey = process.env.BEEM_SECRET_KEY!;

    const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

    const res = await fetch("https://apisms.beem.africa/v1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_addr: "BEEM",
        schedule_time: "",
        encoding: 0,
        message,
        recipients: [{ recipient_id: 1, dest_addr: phone }],
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
