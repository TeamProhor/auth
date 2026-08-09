import { LoginForm } from "@/components/landing/login-form";

export default function LoginPage() {
  return (
    <main className="w-full flex min-h-dvh flex-col items-center justify-center p-6 sm:p-10 relative z-10">
      <div className="w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </main>
  );
}
