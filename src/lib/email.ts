import "server-only";

interface SendMagicLinkParams {
  to: string;
  token: string;
  appUrl: string;
}

interface SendResult {
  success: boolean;
  error?: string;
}

// ─── Magic Link Email ─────────────────────────────────────────────────────────

export async function sendMagicLinkEmail({
  to,
  token,
  appUrl,
}: SendMagicLinkParams): Promise<SendResult> {
  const magicUrl = `${appUrl}/auth/magic-link/verify?token=${token}`;

  // If Resend API key is configured, send a real email
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && !apiKey.startsWith("re_placeholder")) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      const from = process.env.EMAIL_FROM ?? "Prohor Auth <auth@prohor.dev>";

      const { error } = await resend.emails.send({
        from,
        to,
        subject: "প্রহর অ্যাকাউন্টে লগইন করুন",
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
            <h1 style="font-size: 24px; font-weight: 700; color: #111;">প্রহর অ্যাকাউন্টে লগইন</h1>
            <p style="color: #555;">নিচের বাটনে ক্লিক করে লগইন করুন। এই লিংকটি ১৫ মিনিট পর মেয়াদোত্তীর্ণ হবে।</p>
            <a href="${magicUrl}"
              style="display: inline-block; margin-top: 16px; padding: 14px 24px; background: #18181b; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600;">
              লগইন করুন →
            </a>
            <p style="margin-top: 24px; font-size: 12px; color: #999;">
              আপনি এই ইমেইল অনুরোধ না করলে এটি উপেক্ষা করুন।<br/>
              লিংক: <a href="${magicUrl}" style="color: #555;">${magicUrl}</a>
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("[email] Resend error:", error);
        return { success: false, error: "ইমেইল পাঠাতে সমস্যা হয়েছে।" };
      }

      return { success: true };
    } catch (err) {
      console.error("[email] Failed to send via Resend:", err);
      return { success: false, error: "ইমেইল পাঠাতে সমস্যা হয়েছে।" };
    }
  }

  // Development fallback: log to console
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║          MAGIC LINK (dev mode — no Resend)           ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║ To:  ${to.padEnd(48)} ║`);
  console.log(`║ URL: ${magicUrl.substring(0, 48).padEnd(48)} ║`);
  if (magicUrl.length > 48) {
    console.log(`║      ${magicUrl.substring(48, 96).padEnd(48)} ║`);
  }
  console.log("╚══════════════════════════════════════════════════════╝\n");

  return { success: true };
}
