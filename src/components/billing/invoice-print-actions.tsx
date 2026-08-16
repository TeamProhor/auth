"use client";

import { ArrowLeft, CloudDownload } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function InvoicePrintActions() {
  return (
    <div className="flex items-center gap-3 print:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.history.back()}
        className="rounded-xl text-xs gap-1.5 cursor-pointer"
      >
        <ArrowLeft size={14} />
        ফিরে যান
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => window.print()}
        className="rounded-xl text-xs gap-1.5 cursor-pointer bg-primary text-primary-foreground shadow-sm"
      >
        <CloudDownload size={14} />
        প্রিন্ট / PDF সংরক্ষণ
      </Button>
    </div>
  );
}
