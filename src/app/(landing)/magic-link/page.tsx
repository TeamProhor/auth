import { MagicLinkCard } from "@/components/landing/magic-link-card";

export default function MagicLinkPage() {
  return (
    <main className="w-full flex min-h-dvh items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-sm rounded-[24px] bg-card/60 backdrop-blur-xl border border-border px-6 py-12 shadow-2xl text-center">
        <MagicLinkCard />
      </div>
    </main>
  );
}
