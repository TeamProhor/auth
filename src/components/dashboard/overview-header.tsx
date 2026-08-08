import { Icon } from "@iconify/react";

export function OverviewHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          স্বাগতম, ব্যবহারকারী 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার প্রহর ইকোসিস্টেমের সবকিছু এক নজরে দেখে নিন।
        </p>
      </div>
      <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
        <Icon
          icon="solar:star-fall-minimalistic-2-bold-duotone"
          width="18"
          height="18"
        />{" "}
        প্রহর প্রো মেম্বার
      </div>
    </div>
  );
}
