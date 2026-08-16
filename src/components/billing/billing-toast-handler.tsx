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
    const pending = searchParams.get("pending");

    if (subscribed === "true" && !hasShownToast.current) {
      hasShownToast.current = true;
      showToast.success("অভিনন্দন! আপনার সাবস্ক্রিপশন সফলভাবে আপডেট করা হয়েছে।");

      const params = new URLSearchParams(searchParams.toString());
      params.delete("subscribed");
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    } else if (pending === "true" && !hasShownToast.current) {
      hasShownToast.current = true;
      showToast.info(
        "আপনার সাবস্ক্রিপশন অনুরোধটি জমা হয়েছে। অ্যাডমিন পেমেন্ট যাচাই করার পর প্ল্যানটি সক্রিয় হবে।",
      );

      const params = new URLSearchParams(searchParams.toString());
      params.delete("pending");
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}
