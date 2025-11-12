// app/api/system/maintenance/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { businessInfo } from "@/db/schema";

export async function GET() {
  const result = await db
    .select({ maintenance: businessInfo.maintenanceMode })
    .from(businessInfo)
    .limit(1);

  const maintenance = result[0]?.maintenance ?? false;
  return NextResponse.json({ maintenance });
}