Here’s a **comprehensive documentation** for integrating **Cloudflare R2 Object Storage** with your **Next.js project**.
This document covers everything from initial bucket setup to uploading and serving images securely.
You can copy and save it as a guide for your team or future reference.

---

# **Cloudflare R2 + Next.js Integration Guide**

This guide explains how to set up **Cloudflare R2** to store and serve files (e.g., images) directly from your Next.js application.
We’ll cover:

1. [What is Cloudflare R2](#1-what-is-cloudflare-r2)
2. [Project Overview](#2-project-overview)
3. [Step 1: Create an R2 Bucket](#3-step-1-create-an-r2-bucket)
4. [Step 2: Create an API Token](#4-step-2-create-an-api-token)
5. [Step 3: Configure CORS](#5-step-3-configure-cors)
6. [Step 4: Add Environment Variables](#6-step-4-add-environment-variables)
7. [Step 5: Install Required Packages](#7-step-5-install-required-packages)
8. [Step 6: Create a Presigned URL API Route](#8-step-6-create-a-presigned-url-api-route)
9. [Step 7: Update Client Code (`lib/storage.ts`)](#9-step-7-update-client-code-libstoragets)
10. [Step 8: Testing the Flow](#10-step-8-testing-the-flow)
11. [Step 9: Security Best Practices](#11-step-9-security-best-practices)
12. [Next Steps](#12-next-steps)

---

## **1. What is Cloudflare R2**

[Cloudflare R2](https://developers.cloudflare.com/r2/) is a **cloud object storage service** similar to Amazon S3 but with **zero egress fees**.
It allows you to:

* Store any type of file (images, videos, documents, etc.).
* Serve files directly via public URLs or through signed URLs.
* Integrate with existing S3 tools using an S3-compatible API.
* Deliver files quickly using Cloudflare’s global CDN.

---

## **2. Project Overview**

**Goal:**
Enable your Next.js project to upload images to Cloudflare R2 using a **secure, presigned URL flow**.

**Architecture:**

```
Client (Browser)
   |
   |--- POST /api/r2-presign (asks for upload URL)
   |
Next.js API (Vercel)
   |
   |--- Creates a signed PUT URL using R2 credentials
   |
Cloudflare R2 (S3-compatible)
   |
   |--- Browser PUTs file directly to R2
```

This ensures:

* Sensitive credentials stay on the server.
* The client uploads files **directly to R2**, reducing server load.

---

## **3. Step 1: Create an R2 Bucket**

1. **Log in to Cloudflare Dashboard:**
   [https://dash.cloudflare.com](https://dash.cloudflare.com)

2. **Go to R2 Section:**

   * Navigate to **R2 → Buckets**.

3. **Create a New Bucket:**

   * Click **"Create Bucket"**.
   * Bucket name must be **globally unique**:

     ```
     muuza-uploads
     ```
   * Use only lowercase letters, numbers, and hyphens.

4. **Finalize Creation:**

   * Region: Keep as **Auto**.
   * Click **Create Bucket**.

✅ **Result:** You now have a bucket ready to store files.

---

## **4. Step 2: Create an API Token**

Your Next.js API will use this token to securely create presigned URLs.

1. **Go to R2 API Tokens:**

   * Cloudflare Dashboard → **R2 → Manage R2 API Tokens**.

2. **Create a Custom Token:**

   * Click **Create API Token**.
   * Name: `Muuza R2 Token`.

3. **Assign Permissions:**

   * Object → **Read and Write**.
   * List → Optional but useful for listing files.

4. **Restrict to a Single Bucket:**

   * Select **only the bucket you just created**, e.g., `muuza-uploads`.

5. **Create Token and Copy Credentials:**

   * Save the following:

     * **Access Key ID**
     * **Secret Access Key**

⚠️ **Important:**
This is the **only time** you’ll see the secret key.
Store it securely (e.g., password manager).

---

## **5. Step 3: Configure CORS**

Your browser must be allowed to PUT files directly to R2.

1. **Open your bucket settings.**
2. Navigate to **CORS Configuration**.
3. Paste the following JSON:

```json
[
  {
    "AllowedOrigins": [
      "https://muuza.vercel.app",
      "https://zetutech.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

4. **Save the configuration.**

✅ This ensures your Vercel apps and local dev environment can upload files.

---

## **6. Step 4: Add Environment Variables**

Add the following to Vercel under:

> **Settings → Environment Variables**

| Name                   | Value (Example)                            |
| ---------------------- | ------------------------------------------ |
| `CF_ACCOUNT_ID`        | `1234567890abcdef`                         |
| `R2_BUCKET`            | `muuza-uploads`                            |
| `R2_ACCESS_KEY_ID`     | `AKIAIOSFODNN7EXAMPLE`                     |
| `R2_ACCESS_KEY_SECRET` | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

---

## **7. Step 5: Install Required Packages**

In your Next.js project folder, run:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

These packages allow you to interact with R2 using S3-compatible commands.

---

## **8. Step 6: Create a Presigned URL API Route**

This route generates short-lived URLs so the browser can upload securely.

**File:** `pages/api/r2-presign.ts`

```ts
import type { NextApiRequest, NextApiResponse } from "next";
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { key, contentType } = req.body as { key: string; contentType: string };

  if (!key || !contentType) return res.status(400).json({ error: "Missing key or contentType" });

  try {
    const putCmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, putCmd, { expiresIn: 300 }); // expires in 5 min

    return res.status(200).json({
      uploadUrl,
      publicUrl: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${encodeURIComponent(key)}`,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create signed URL" });
  }
}
```

---

## **9. Step 7: Update Client Code (`lib/storage.ts`)**

Replace your placeholder code with this production-ready version:

```ts
// lib/storage.ts
export async function uploadImageToStorage(file: File, path: string): Promise<string> {
  // 1. Request a presigned upload URL
  const resp = await fetch("/api/r2-presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: path, contentType: file.type }),
  });

  if (!resp.ok) throw new Error("Failed to get upload URL");
  const { uploadUrl, publicUrl } = await resp.json();

  // 2. Upload file directly to Cloudflare R2
  const uploadResp = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResp.ok) throw new Error("Failed to upload file");

  // 3. Return the permanent file URL
  return publicUrl;
}
```

---

## **10. Step 8: Testing the Flow**

1. **Run Next.js locally:**

   ```bash
   npm run dev
   ```

2. **Upload a test file using your UI.**

3. **Verify upload:**

   * Go to Cloudflare R2 dashboard → Buckets → `muuza-uploads`.
   * You should see the file listed.

4. **Test the URL:**

   * Copy the `publicUrl` returned from the API.
   * Paste it into your browser — you should see your uploaded image.

---

## **11. Step 9: Security Best Practices**

* **Never expose your R2 secret key** in client-side code.
* **Short expiration** for presigned URLs (e.g., 5–15 minutes).
* **Validate files server-side** before issuing presigned URLs:

  * Limit file size.
  * Restrict file types (e.g., images only).
* **Restrict API Token scope**:

  * Access only specific buckets.
  * Allow only required permissions.

---

## **12. Next Steps**

Now that you have basic uploads working, you can:

* **Store file metadata in your database** (e.g., file name, path, owner ID).
* **Generate presigned GET URLs** for private downloads.
* **Integrate with Drizzle ORM + Neon database** to track files.
* **Add image processing** using Cloudflare Images or Workers.

---

## **Summary**

| Step               | Result                                                 |
| ------------------ | ------------------------------------------------------ |
| Create R2 bucket   | Dedicated storage for your app files                   |
| Create API token   | Secure credentials for programmatic access             |
| Configure CORS     | Allow browser uploads from your Vercel domains         |
| Add env vars       | Store sensitive credentials securely in Vercel         |
| Create API route   | Backend endpoint for generating presigned URLs         |
| Update client code | Upload directly to R2 using the signed URL             |
| Test & verify      | Ensure uploads are visible in the Cloudflare dashboard |

With this setup, your Next.js project is now **production-ready for scalable file storage** using Cloudflare R2.
