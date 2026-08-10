"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useTransition } from "react";
import { unlinkAccountAction } from "@/actions/user";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface ConnectedAccountsSectionProps {
  linkedProviders: string[];
}

export function ConnectedAccountsSection({
  linkedProviders,
}: ConnectedAccountsSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hasGoogle = linkedProviders.includes("google");
  const hasGitHub = linkedProviders.includes("github");

  const handleUnlink = (provider: "google" | "github") => {
    setError(null);
    startTransition(async () => {
      const res = await unlinkAccountAction(provider);
      if (!res.success) {
        setError(res.error);
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

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg font-medium">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {/* Google Provider */}
        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center">
              <Icon icon="logos:google-icon" width="20" height="20" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Google</p>
              <p className="text-xs text-muted-foreground">
                {hasGoogle ? "সংযুক্ত আছে" : "সংযুক্ত নেই"}
              </p>
            </div>
          </div>
          {hasGoogle ? (
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
            <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center">
              <Icon icon="logos:github-icon" width="20" height="20" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">GitHub</p>
              <p className="text-xs text-muted-foreground">
                {hasGitHub ? "সংযুক্ত আছে" : "সংযুক্ত নেই"}
              </p>
            </div>
          </div>
          {hasGitHub ? (
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
