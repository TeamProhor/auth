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
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
                * {
                  box-sizing: border-box;
                }
                body, table, td, p, a, h1, h2, span, div {
                  font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
                }
              </style>
            </head>
            <body style="background-color: #f4f4f5; margin: 0; padding: 48px 16px; -webkit-font-smoothing: antialiased;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #e4e4e7; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <tr>
                  <td style="padding: 40px 32px; text-align: center;">
                    
                    <!-- Logo / Emblem -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 16px auto;">
                      <tr>
                        <td align="center">
                          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 259" width="48" height="48" style="display: block; margin: 0 auto;"><path d="M0 29.642C0 13.272 13.271 0 29.642 0h196.716C242.728 0 256 13.271 256 29.642v199.41c0 16.372-13.271 29.643-29.642 29.643H29.642C13.272 258.695 0 245.424 0 229.052V29.642Z" fill="#F6E458"/><path d="M164.056 57.825c-14.124-4.057-28.53-4.609-43.212-3.296-8.216.854-16.114 2.485-23.732 5.347C80.644 66.06 68.28 76.774 60.908 92.904c-5.286 11.564-7.196 23.848-7.395 36.452-.21 13.32 1.459 26.455 4.11 39.478 2.405 11.804 5.607 23.377 10.179 34.55.434 1.06.975 1.418 2.135 1.416 14.461-.031 28.923-.031 43.385-.031h12.843c.328 0 .656-.019 1.033-.04.192-.01.397-.021.622-.031-.087-.207-.164-.397-.238-.575a20.39 20.39 0 0 0-.407-.953c-1.045-2.237-2.113-4.464-3.18-6.692-2.316-4.832-4.63-9.664-6.724-14.591-6.351-14.94-11.215-30.324-12.699-46.608-.654-7.185-.564-14.329 1.43-21.33 2.278-8.003 7.168-13.652 15.274-16.014 7.445-2.168 14.993-2.154 22.396.24 6.608 2.137 10.916 6.65 12.748 13.408 1.408 5.19 1.407 10.436.343 15.669-.82 4.028-2.47 7.705-5.441 10.645-5.33 5.275-11.985 6.489-19.126 6.084-1.27-.072-2.537-.21-3.842-.355-.612-.066-1.231-.134-1.864-.197.018.202.028.388.038.562.018.343.034.64.104.925.305 1.223.595 2.451.885 3.679.699 2.958 1.397 5.915 2.295 8.81a169.782 169.782 0 0 0 6.14 16.654c16.577-1.294 31.843-5.414 48.047-15.141.244-.154.465-.292.687-.43 6.96-4.333 12.593-9.954 16.478-17.213 6.291-11.754 7.518-24.324 5.649-37.299-1.93-13.39-7.938-24.63-18.283-33.445-7.174-6.115-15.47-10.12-24.474-12.706Z"/></svg>
                        </td>
                      </tr>
                    </table>

                    <!-- Brand Header -->
                    <h1 style="font-size: 22px; font-weight: 700; color: #09090b; margin: 0 0 4px 0;">
                      প্রহর অ্যাকাউন্ট (Prohor Auth)
                    </h1>
                    <p style="font-size: 13px; font-weight: 500; color: #71717a; margin: 0 0 28px 0;">
                      নিরাপদ ও নির্ভরযোগ্য অ্যাক্সেস প্ল্যাটফর্ম
                    </p>

                    <!-- Divider -->
                    <div style="height: 1px; background-color: #f4f4f5; width: 100%; margin-bottom: 28px;"></div>

                    <!-- Email Main Title & Subtitle -->
                    <h2 style="font-size: 19px; font-weight: 700; color: #18181b; margin: 0 0 12px 0;">
                      অ্যাকোউন্টে প্রবেশ নিশ্চিত করুন
                    </h2>
                    <p style="font-size: 15px; color: #52525b; line-height: 1.65; margin: 0 0 32px 0;">
                      আপনার পাসওয়ার্ডহীন নিরাপদে লগইন করার জন্য ম্যাজিক লিংক প্রস্তুত। নিচের বাটনে ক্লিক করে সরাসরি অ্যাকাউন্টে প্রবেশ করুন।
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 32px auto;">
                      <tr>
                        <td align="center" style="border-radius: 14px; background-color: #09090b;">
                          <a href="${magicUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; border-radius: 14px;">
                            লগইন করুন &nbsp;→
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Notice Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 16px; margin-bottom: 28px;">
                      <tr>
                        <td style="padding: 14px 18px; text-align: center;">
                          <p style="font-size: 13px; font-weight: 500; color: #71717a; margin: 0; line-height: 1.5;">
                            ⏱️ নিরাপত্তার স্বার্থে এই লিংকটি <strong>১৫ মিনিট</strong> পর্যন্ত কার্যকর থাকবে।
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback URL -->
                    <p style="font-size: 12px; color: #a1a1aa; line-height: 1.5; margin: 0 0 20px 0;">
                      বাটন কাজ না করলে নিচের লিংকটি কপি করে ব্রাউজারে পেস্ট করুন:<br/>
                      <a href="${magicUrl}" style="color: #09090b; word-break: break-all; font-size: 11px; text-decoration: underline;">${magicUrl}</a>
                    </p>

                    <!-- Footer Info -->
                    <div style="border-top: 1px solid #f4f4f5; pt-20px; padding-top: 20px;">
                      <p style="font-size: 11px; color: #d4d4d8; margin: 0;">
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
