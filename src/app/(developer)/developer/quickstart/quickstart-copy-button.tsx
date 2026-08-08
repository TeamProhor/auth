"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

export function QuickstartCopyButton({ value }: { value: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={() => navigator.clipboard.writeText(value)}
      title="কপি করুন"
    >
      <Icon icon="solar:copy-bold" width="18" height="18" />
    </Button>
  );
}
