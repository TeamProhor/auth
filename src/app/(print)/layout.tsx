import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ইনভয়েস রসিদ | Prohor Accounts",
  description: "প্রহর অ্যাকাউন্টস পেমেন্ট ইনভয়েস রসিদ",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground print:bg-white print:text-black">
      {children}
    </div>
  );
}
