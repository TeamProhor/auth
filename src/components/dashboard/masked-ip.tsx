"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "@/components/icons";

export function MaskedIpAddress({ ip }: { ip: string | null }) {
  const [show, setShow] = useState(false);

  if (!ip) return <span>অজানা</span>;

  const cleaned = ip.replace(/^::ffff:/, "");
  const formattedIp = cleaned === "::1" ? "127.0.0.1" : cleaned;

  const maskIp = (val: string) => {
    const parts = val.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.***.***.${parts[3]}`;
    }
    return "•••.•••.•••.•••";
  };

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
      <span>{show ? formattedIp : maskIp(formattedIp)}</span>
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="p-1 hover:text-foreground transition-colors cursor-pointer rounded hover:bg-muted/60"
        title={show ? "আইপি লুকান" : "আইপি দেখুন"}
      >
        {show ? <EyeClosed size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}
