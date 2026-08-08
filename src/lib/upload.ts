"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { UTApi } from "uploadthing/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getCurrentUser } from "@/lib/auth/session";

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

/**
 * Compresses an uploaded image file using Sharp into WebP format (400x400),
 * uploads it to UploadThing, updates the user's avatarUrl in PostgreSQL,
 * and revalidates dashboard pages.
 */
export async function uploadAndCompressAvatarAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "অনুগ্রহ করে একটি ছবি নির্বাচন করুন।" };
  }

  try {
    // 1. Read input image buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 2. Compress image with Sharp to WebP (400x400 cover crop)
    const compressedWebpBuffer = await sharp(inputBuffer)
      .resize(400, 400, { fit: "cover", position: "center" })
      .webp({ quality: 82 })
      .toBuffer();

    // 3. Create File object for UploadThing
    const webpFile = new File(
      [compressedWebpBuffer],
      `avatar-${user.id}.webp`,
      {
        type: "image/webp",
      },
    );

    // 4. Upload to UploadThing
    const uploadRes = await utapi.uploadFiles([webpFile]);
    const uploadedData = uploadRes[0];

    if (!uploadedData || uploadedData.error) {
      return {
        success: false,
        error: uploadedData?.error?.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে।",
      };
    }

    const avatarUrl = uploadedData.data.url ?? uploadedData.data.ufsUrl;

    // 5. Update user avatarUrl in PostgreSQL
    await db
      .update(users)
      .set({
        avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    await logEvent({
      userId: user.id,
      eventType: "profile_updated",
      details: "Avatar updated via UploadThing + Sharp WebP",
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      avatarUrl,
    };
  } catch (error) {
    console.error("Avatar Upload Error:", error);
    return {
      success: false,
      error: "ছবি প্রসেসিং বা আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    };
  }
}
