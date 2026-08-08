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
          <!DOCTYPE html>
          <html lang="bn">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>প্রহর অ্যাকাউন্টে লগইন করুন</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
                * {
                  box-sizing: border-box;
                }
                body, table, td, p, a, h1, h2, span, div {
                  font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'SolaimanLipi', sans-serif !important;
                }
              </style>
            </head>
            <body style="background-color: #f4f4f5; margin: 0; padding: 48px 16px; -webkit-font-smoothing: antialiased; font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #e4e4e7; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <tr>
                  <td style="padding: 40px 32px; text-align: center; font-family: 'Hind Siliguri', sans-serif;">
                    
                    <!-- Logo Image (Image tag for Gmail/Outlook compatibility) -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 16px auto;">
                      <tr>
                        <td align="center">
                          <img src="${appUrl}/logo.svg" width="56" height="56" alt="Prohor Logo" style="display: block; margin: 0 auto; border: 0; width: 56px; height: 56px; border-radius: 14px;" />
                        </td>
                      </tr>
                    </table>

                    <!-- Brand Header -->
                    <h1 style="font-size: 22px; font-weight: 700; color: #09090b; margin: 0 0 4px 0; font-family: 'Hind Siliguri', sans-serif;">
                      প্রহর অ্যাকাউন্ট (Prohor Auth)
                    </h1>
                    <p style="font-size: 13px; font-weight: 500; color: #71717a; margin: 0 0 28px 0; font-family: 'Hind Siliguri', sans-serif;">
                      নিরাপদ ও নির্ভরযোগ্য অ্যাক্সেস প্ল্যাটফর্ম
                    </p>

                    <!-- Divider -->
                    <div style="height: 1px; background-color: #f4f4f5; width: 100%; margin-bottom: 28px;"></div>

                    <!-- Email Main Title & Subtitle -->
                    <h2 style="font-size: 19px; font-weight: 700; color: #18181b; margin: 0 0 12px 0; font-family: 'Hind Siliguri', sans-serif;">
                      অ্যাকোউন্টে প্রবেশ নিশ্চিত করুন
                    </h2>
                    <p style="font-size: 15px; color: #52525b; line-height: 1.65; margin: 0 0 32px 0; font-family: 'Hind Siliguri', sans-serif;">
                      আপনার পাসওয়ার্ডহীন নিরাপদে লগইন করার জন্য ম্যাজিক লিংক প্রস্তুত। নিচের বাটনে ক্লিক করে সরাসরি অ্যাকাউন্টে প্রবেশ করুন।
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 32px auto;">
                      <tr>
                        <td align="center" style="border-radius: 14px; background-color: #09090b;">
                          <a href="${magicUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; border-radius: 14px; font-family: 'Hind Siliguri', sans-serif;">
                            লগইন করুন &nbsp;→
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Notice Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 16px; margin-bottom: 28px;">
                      <tr>
                        <td style="padding: 14px 18px; text-align: center; font-family: 'Hind Siliguri', sans-serif;">
                          <p style="font-size: 13px; font-weight: 500; color: #71717a; margin: 0; line-height: 1.5; font-family: 'Hind Siliguri', sans-serif;">
                            ⏱️ নিরাপত্তার স্বার্থে এই লিংকটি <strong>১৫ মিনিট</strong> পর্যন্ত কার্যকর থাকবে।
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback URL -->
                    <p style="font-size: 12px; color: #a1a1aa; line-height: 1.5; margin: 0 0 20px 0; font-family: 'Hind Siliguri', sans-serif;">
                      বাটন কাজ না করলে নিচের লিংকটি কপি করে ব্রাউজারে পেস্ট করুন:<br/>
                      <a href="${magicUrl}" style="color: #09090b; word-break: break-all; font-size: 11px; text-decoration: underline; font-family: sans-serif;">${magicUrl}</a>
                    </p>

                    <!-- Footer Info -->
                    <div style="border-top: 1px solid #f4f4f5; padding-top: 20px;">
                      <p style="font-size: 11px; color: #d4d4d8; margin: 0; font-family: sans-serif;">
                        © 2026 Prohor Ecosystem. All rights reserved.
                      </p>
                    </div>

                  </td>
                </tr>
              </table>
            </body>
          </html>
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

  return { success: true };
}
