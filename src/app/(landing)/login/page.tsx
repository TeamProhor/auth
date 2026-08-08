import { LoginForm } from "@/components/landing/login-form";

export default function LoginPage() {
  return (
    <main className="w-full flex min-h-dvh items-center justify-center p-4 relative z-10 transition-opacity duration-500">
      <div className="w-full max-w-sm rounded-[24px] bg-card/60 backdrop-blur-xl border border-border px-6 py-10 pt-14 shadow-2xl">
        <LoginForm />
      </div>
    </main>
  );
}
