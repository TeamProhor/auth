"use client";

import { useState, useTransition } from "react";
import { unlinkAccountAction } from "@/actions/user";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { QuickList, QuickListItem } from "@/components/shared/quick-list";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Account } from "@/db/schema";
import { MESSAGES, showToast } from "@/lib/toast";

interface ConnectedAccountsSectionProps {
  userAccounts: Account[];
}

export function ConnectedAccountsSection({
  userAccounts,
}: ConnectedAccountsSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [activeProvider, setActiveProvider] = useState<
    "google" | "github" | null
  >(null);
  const [unlinkTarget, setUnlinkTarget] = useState<"google" | "github" | null>(
    null,
  );

  const googleAccount = userAccounts.find((a) => a.provider === "google");
  const githubAccount = userAccounts.find((a) => a.provider === "github");

  const handleUnlink = () => {
    if (!unlinkTarget) return;
    setActiveProvider(unlinkTarget);
    startTransition(async () => {
      try {
        const res = await unlinkAccountAction(unlinkTarget);
        if (res.success) {
          showToast.success(res.message ?? MESSAGES.SECURITY.UNLINK_SUCCESS);
          setUnlinkTarget(null);
        } else {
          showToast.error(res.error ?? MESSAGES.SECURITY.UNLINK_ERROR);
        }
      } catch {
        showToast.error(MESSAGES.SECURITY.UNLINK_ERROR);
      }
      setActiveProvider(null);
    });
  };

  const handleConnect = (provider: "google" | "github") => {
    setActiveProvider(provider);
    window.location.href = `/api/auth/oauth/${provider}?callbackUrl=/dashboard/security&link=true`;
  };

  return (
    <div className="space-y-4">
      <QuickList
        title="সংযুক্ত সামাজিক অ্যাকাউন্টসমূহ"
        description="এখানে আপনার সোশ্যাল মিডিয়া অ্যাকাউন্ট কানেক্ট বা ডিসকানেক্ট করতে পারেন।"
        variant="list"
      >
        {/* Google Provider */}
        <QuickListItem
          icon={<GoogleIcon className="w-5 h-5" />}
          color={googleAccount ? "blue" : "muted"}
          title={
            <div className="flex items-center gap-2">
              <span>Google</span>
              {googleAccount ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2 py-0.5"
                >
                  সংযুক্ত
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground text-[10px] px-2 py-0.5 font-medium"
                >
                  সংযুক্ত নেই
                </Badge>
              )}
            </div>
          }
          description={
            googleAccount
              ? googleAccount.providerUsername || "Google অ্যাকাউন্ট সক্রিয় আছে"
              : "Google দিয়ে সহজে লগইন করতে অ্যাকাউন্ট লিঙ্ক করুন।"
          }
          action={
            googleAccount ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUnlinkTarget("google")}
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer border-destructive/20 h-8 px-3"
              >
                ডিসকানেক্ট
              </Button>
            ) : (
              <SubmitButton
                type="button"
                variant="outline"
                size="sm"
                isPending={activeProvider === "google"}
                onClick={() => handleConnect("google")}
                className="text-xs cursor-pointer h-8 px-3"
              >
                কানেক্ট করুন
              </SubmitButton>
            )
          }
        />

        {/* GitHub Provider */}
        <QuickListItem
          icon={<GitHubIcon className="w-5 h-5 text-foreground fill-current" />}
          color={githubAccount ? "purple" : "muted"}
          title={
            <div className="flex items-center gap-2">
              <span>GitHub</span>
              {githubAccount ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2 py-0.5"
                >
                  সংযুক্ত
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground text-[10px] px-2 py-0.5 font-medium"
                >
                  সংযুক্ত নেই
                </Badge>
              )}
            </div>
          }
          description={
            githubAccount
              ? `@${githubAccount.providerUsername}`
              : "GitHub দিয়ে ডেভেলপার অ্যাকাউন্ট লিঙ্ক করুন।"
          }
          action={
            githubAccount ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUnlinkTarget("github")}
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer border-destructive/20 h-8 px-3"
              >
                ডিসকানেক্ট
              </Button>
            ) : (
              <SubmitButton
                type="button"
                variant="outline"
                size="sm"
                isPending={activeProvider === "github"}
                onClick={() => handleConnect("github")}
                className="text-xs cursor-pointer h-8 px-3"
              >
                কানেক্ট করুন
              </SubmitButton>
            )
          }
        />
      </QuickList>

      <ResponsiveDialog
        open={!!unlinkTarget}
        onOpenChange={(open) => {
          if (!open) setUnlinkTarget(null);
        }}
        title="অ্যাকাউন্ট ডিসকানেক্ট করবেন?"
        description={`আপনি কি নিশ্চিত যে আপনি ${unlinkTarget === "google" ? "Google" : "GitHub"} অ্যাকাউন্টটি ডিসকানেক্ট করতে চান?`}
        trigger={null}
        className="sm:max-w-xl"
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button
            variant="ghost"
            onClick={() => setUnlinkTarget(null)}
            disabled={isPending}
          >
            বাতিল
          </Button>
          <SubmitButton
            variant="destructive"
            onClick={handleUnlink}
            isPending={isPending}
          >
            হ্যাঁ, ডিসকানেক্ট করুন
          </SubmitButton>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
