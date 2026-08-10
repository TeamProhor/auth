"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useTransition } from "react";
import { unlinkAccountAction } from "@/actions/user";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Account } from "@/db/schema";
import { MESSAGES, showToast } from "@/lib/toast";

interface ConnectedAccountsSectionProps {
  userAccounts: Account[];
}

export function ConnectedAccountsSection({
  userAccounts,
}: ConnectedAccountsSectionProps) {
  const [isPending, startTransition] = useTransition();

  const googleAccount = userAccounts.find((a) => a.provider === "google");
  const githubAccount = userAccounts.find((a) => a.provider === "github");

  const handleUnlink = (provider: "google" | "github") => {
    startTransition(async () => {
      const res = await unlinkAccountAction(provider);
      if (res.success) {
        showToast.success(res.message ?? MESSAGES.SECURITY.UNLINK_SUCCESS);
      } else {
        showToast.error(res.error ?? MESSAGES.SECURITY.UNLINK_ERROR);
      }
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <CardTitle className="text-lg font-bold">
          সংযুক্ত সামাজিক অ্যাকাউন্টসমূহ
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          এখানে আপনার সোশ্যাল মিডিয়া অ্যাকাউন্ট কানেক্ট বা ডিসকানেক্ট করতে পারেন।
        </CardDescription>
      </div>

      <div className="space-y-4">
        {/* Google Provider */}
        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
              <Icon icon="logos:google-icon" width="20" height="20" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Google</p>
              <p className="text-xs text-muted-foreground">
                {googleAccount
                  ? googleAccount.providerUsername || "সংযুক্ত আছে"
                  : "সংযুক্ত নেই"}
              </p>
            </div>
          </div>
          {googleAccount ? (
            <SubmitButton
              variant="outline"
              size="sm"
              isPending={isPending}
              onClick={() => handleUnlink("google")}
              className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              ডিসকানেক্ট
            </SubmitButton>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = "/api/auth/google";
              }}
              className="text-xs cursor-pointer"
            >
              কানেক্ট করুন
            </Button>
          )}
        </div>

        {/* GitHub Provider */}
        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
              <Icon icon="logos:github-icon" width="20" height="20" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">GitHub</p>
              <p className="text-xs text-muted-foreground">
                {githubAccount
                  ? `@${githubAccount.providerUsername}` || "সংযুক্ত আছে"
                  : "সংযুক্ত নেই"}
              </p>
            </div>
          </div>
          {githubAccount ? (
            <SubmitButton
              variant="outline"
              size="sm"
              isPending={isPending}
              onClick={() => handleUnlink("github")}
              className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              ডিসকানেক্ট
            </SubmitButton>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = "/api/auth/github";
              }}
              className="text-xs cursor-pointer"
            >
              কানেক্ট করুন
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
