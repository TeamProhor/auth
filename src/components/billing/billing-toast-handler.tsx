"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { showToast } from "@/lib/toast";

export function BillingToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasShownToast = useRef(false);

  useEffect(() => {
    const subscribed = searchParams.get("subscribed");

    if (subscribed === "true" && !hasShownToast.current) {
      hasShownToast.current = true;
      showToast.success("অভিনন্দন! আপনার সাবস্ক্রিপশন সফলভাবে আপডেট করা হয়েছে।");

      // Clean up ?subscribed=true from the URL so it doesn't show again on reload
      const params = new URLSearchParams(searchParams.toString());
      params.delete("subscribed");
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}
