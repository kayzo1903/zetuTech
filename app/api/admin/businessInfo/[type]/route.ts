import { db } from "@/db";
import { businessInfo } from "@/db/schema";
import { getServerSession } from "@/lib/server-session";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ type : string }>  }
) {
  try {
     const { type } = await params;

    const { session, isAdmin } = await getServerSession();

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const existing = await db.select().from(businessInfo).limit(1);

    const id = existing.length ? existing[0].id : undefined;
    let updateData = {};

    // Update based on section type
    switch (type) {
      case "contact":
        updateData = {
          address: data.address,
          phone: data.phone,
          email: data.email,
          businessHours: data.businessHours,
          whatsappNumber: data.whatsappNumber,
          whatsappMessage: data.whatsappMessage,
          mapEmbedUrl: data.mapEmbedUrl,
        };
        break;

      case "support":
        updateData = {
          supportEmail: data.supportEmail,
          supportPhone: data.supportPhone,
          liveChatHours: data.liveChatHours,
          warrantyPeriod: data.warrantyPeriod,
          shippingInfo: data.shippingInfo,
          returnPolicy: data.returnPolicy,
          faq: data.faq,
        };
        break;

      case "site_settings":
        updateData = {
          siteName: data.siteName,
          siteDescription: data.siteDescription,
          currency: data.currency,
          maintenanceMode: data.maintenanceMode,
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          error: "Invalid section type",
        });
    }

    if (id) {
      await db
        .update(businessInfo)
        .set(updateData)
        .where(eq(businessInfo.id, id));
    } else {
      await db.insert(businessInfo).values(updateData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to save data" });
  }
}
