import { LoginForm } from "@/components/landing/login-form";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; "2fa_user_id"?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  email_account_exists:
    "এই ইমেইলে একটি Prohor অ্যাকাউন্ট আগে থেকেই আছে। ইমেইল বা পাসওয়ার্ড দিয়ে লগইন করুন, তারপর Security → Connected Accounts থেকে Google/GitHub সংযুক্ত করুন।",
  github_no_verified_email: "GitHub অ্যাকাউন্টে কোনো verified ইমেইল পাওয়া যায়নি।",
  github_cancelled: "GitHub লগইন বাতিল করা হয়েছে।",
  github_token_error: "GitHub থেকে token নেওয়া যায়নি। আবার চেষ্টা করুন।",
  github_profile_error: "GitHub প্রোফাইল লোড করা যায়নি।",
  github_server_error: "GitHub লগইনে সার্ভার ত্রুটি হয়েছে।",
  github_not_configured: "GitHub OAuth কনফিগার করা নেই।",
  google_email_not_verified: "Google অ্যাকাউন্টের ইমেইল verified নয়।",
  google_cancelled: "Google লগইন বাতিল করা হয়েছে।",
  google_token_error: "Google থেকে token নেওয়া যায়নি। আবার চেষ্টা করুন।",
  google_profile_error: "Google প্রোফাইল লোড করা যায়নি।",
  google_server_error: "Google লগইনে সার্ভার ত্রুটি হয়েছে।",
  google_not_configured: "Google OAuth কনফিগার করা নেই।",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, "2fa_user_id": initial2FAUserId } = await searchParams;
  const errorMessage = error
    ? (ERROR_MESSAGES[error] ?? "একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।")
    : null;

  return (
    <main className="w-full flex min-h-dvh flex-col items-center justify-center p-6 sm:p-10 relative z-10">
      <div className="w-full max-w-md mx-auto">
        {errorMessage && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm leading-relaxed">
            {errorMessage}
          </div>
        )}
        <LoginForm initial2FAUserId={initial2FAUserId} />
      </div>
    </main>
  );
}
