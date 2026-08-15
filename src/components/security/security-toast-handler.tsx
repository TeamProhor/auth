"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { MESSAGES, showToast } from "@/lib/toast";

export function SecurityToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasShownToast = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if ((success || error) && !hasShownToast.current) {
      hasShownToast.current = true;

      if (success === "github_linked") {
        showToast.success(MESSAGES.SECURITY.LINK_SUCCESS_GITHUB);
      } else if (success === "google_linked") {
        showToast.success(MESSAGES.SECURITY.LINK_SUCCESS_GOOGLE);
      } else if (error === "link_state_invalid") {
        showToast.error(MESSAGES.SECURITY.LINK_ERROR_STATE);
      } else if (error === "provider_already_linked") {
        showToast.error(MESSAGES.SECURITY.LINK_ERROR_TAKEN);
      }

      // Clean up search parameters from the URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      params.delete("error");
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return null;
}
