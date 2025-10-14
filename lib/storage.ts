export async function uploadImageToStorage(file: File, path: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Step 1: Get presigned URL
    const resp = await fetch(`${baseUrl}/api/r2-presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        key: path, 
        contentType: file.type 
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.text();
      throw new Error(`Failed to get R2 presigned URL: ${resp.status} - ${errorData}`);
    }

    const presignData = await resp.json();
    console.log("Presign response:", presignData);
    
    const { uploadUrl, publicUrl } = presignData;

    if (!uploadUrl) {
      throw new Error("No upload URL received from presign API");
    }

    // Step 2: Upload to R2 - Fix the headers and method
    const uploadResp = await fetch(uploadUrl, {
      method: "PUT", // Must be PUT for presigned URLs
      headers: { 
        "Content-Type": file.type,
        // Remove any additional headers that might cause issues
      },
      body: file, // Send the file directly
    });

    if (!uploadResp.ok) {
      const errorText = await uploadResp.text();
      console.error("R2 Upload error details:", errorText);
      throw new Error(`R2 upload failed: ${uploadResp.status} - ${uploadResp.statusText}. Details: ${errorText}`);
    }

    return publicUrl;
  } catch (error) {
    console.error("Upload error details:", error);
    throw error;
  }
}