import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_ACCESS_KEY_SECRET!,
  },
});

// app/api/r2-presign/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, contentType } = body;

    if (!key || !contentType) {
      return NextResponse.json(
        { error: "Missing key or contentType" },
        { status: 400 }
      );
    }

    const putCmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, putCmd, { expiresIn: 300 });

    // ✅ BEST: Use R2 public domain with clean key
    const publicUrl = `https://pub-${process.env.CF_ACCOUNT_ID}.r2.dev/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Failed to create signed URL" },
      { status: 500 }
    );
  }
}

// Also export OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}