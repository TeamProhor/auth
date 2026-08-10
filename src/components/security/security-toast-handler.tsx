"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MESSAGES, showToast } from "@/lib/toast";

export function SecurityToastHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "github_linked") {
      showToast.success(MESSAGES.SECURITY.LINK_SUCCESS_GITHUB);
    } else if (success === "google_linked") {
      showToast.success(MESSAGES.SECURITY.LINK_SUCCESS_GOOGLE);
    } else if (error === "link_state_invalid") {
      showToast.error(MESSAGES.SECURITY.LINK_ERROR_STATE);
    } else if (error === "provider_already_linked") {
      showToast.error(MESSAGES.SECURITY.LINK_ERROR_TAKEN);
    }
  }, [searchParams]);

  return null;
}
