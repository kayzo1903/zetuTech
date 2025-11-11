import { db } from "@/db";
import { businessInfo } from "@/db/schema";
import { getServerSession } from "@/lib/server-session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { session, isAdmin } = await getServerSession();

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.select().from(businessInfo).limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "No business info found" },
        { status: 404 }
      );
    }

    const data = result[0];

    const responseData = {
      contactInfo: {
        address: data.address,
        phone: data.phone,
        email: data.email,
        businessHours: data.businessHours,
        whatsappNumber: data.whatsappNumber,
        whatsappMessage: data.whatsappMessage,
        mapEmbedUrl: data.mapEmbedUrl,
      },
      supportInfo: {
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        liveChatHours: data.liveChatHours,
        warrantyPeriod: data.warrantyPeriod,
        shippingInfo: data.shippingInfo,
        returnPolicy: data.returnPolicy,
        faq: data.faq || [],
      },
      siteSettings: {
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        currency: data.currency,
        maintenanceMode: data.maintenanceMode || false,
      },
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching business info:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch business info" },
      { status: 500 }
    );
  }
}