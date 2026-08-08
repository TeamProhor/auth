import { ConsentCard } from "@/components/landing/consent-card";

export default function ConsentPage() {
  return (
    <main className="w-full flex min-h-dvh items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md rounded-[24px] bg-card/80 backdrop-blur-xl border border-border p-6 md:p-8 shadow-2xl">
        <ConsentCard />
      </div>
    </main>
  );
}
