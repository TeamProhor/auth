"use client";

import { Icon } from "@iconify/react";
import { useTransition } from "react";
import { approveConsentAction, denyConsentAction } from "@/actions/oauth";
import { ProhorLogo } from "@/components/shared/prohor-logo";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";

interface ConsentCardProps {
  client: {
    name: string;
    logoUrl: string | null;
    clientId: string;
  };
  user: { name: string; email: string };
  requestedScopes: string[];
  redirectUri: string;
  state?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

const SCOPE_LABELS: Record<
  string,
  { label: string; description: string; icon: string }
> = {
  openid: {
    label: "প্রাথমিক পরিচয়",
    description: "আপনার প্রহর ব্যবহারকারী আইডি",
    icon: "solar:fingerprint-bold",
  },
  profile: {
    label: "প্রাথমিক প্রোফাইল",
    description: "আপনার নাম ও প্রোফাইল ছবি",
    icon: "solar:user-id-bold",
  },
  email: {
    label: "ইমেইল ঠিকানা",
    description: "আপনার অ্যাকাউন্টের ইমেইল",
    icon: "solar:letter-bold",
  },
  offline_access: {
    label: "অফলাইন অ্যাক্সেস",
    description: "আপনার অনুপস্থিতিতে অ্যাপ অ্যাক্সেস করতে পারবে",
    icon: "solar:refresh-bold",
  },
};

export function ConsentCard({
  client,
  user,
  requestedScopes,
  redirectUri,
  state,
  codeChallenge,
  codeChallengeMethod,
}: ConsentCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await approveConsentAction({
        clientId: client.clientId,
        redirectUri,
        scope: requestedScopes.join(" "),
        state,
        codeChallenge,
        codeChallengeMethod,
      });
    });
  };

  const handleDeny = () => {
    startTransition(async () => {
      await denyConsentAction({ redirectUri, state });
    });
  };

  const _displayScopes = requestedScopes.filter((s) => s !== "openid");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <ProhorLogo className="size-14 rounded-2xl shadow-sm" />
        <Icon
          icon="solar:arrow-right-bold"
          width="24"
          height="24"
          className="text-muted-foreground"
        />
        <div className="bg-primary text-primary-foreground border border-border rounded-2xl w-14 h-14 flex items-center justify-center shadow-sm font-bold text-xl">
          {client.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="text-center flex flex-col gap-2">
        <h1 className="text-xl font-bold text-foreground">
          {client.name} অ্যাক্সেস চাইছে
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{user.name}</span> (
          {user.email}) হিসেবে লগইন করা আছেন।
        </p>
        <p className="text-xs text-muted-foreground">
          অ্যাপ্লিকেশনটি নিচের তথ্যগুলো অ্যাক্সেস করতে পারবে:
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border bg-background overflow-hidden">
        {requestedScopes.map((scope, idx) => {
          const meta = SCOPE_LABELS[scope];
          if (!meta) return null;
          return (
            <div
              key={scope}
              className={`flex items-start gap-4 p-4 ${idx < requestedScopes.length - 1 ? "border-b border-border" : ""}`}
            >
              <Icon
                icon={meta.icon}
                width="24"
                height="24"
                className="text-foreground mt-0.5"
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-foreground">
                  {meta.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {meta.description}
                </p>
              </div>
            </div>
          );
        })}
        <div className="flex items-start gap-4 p-4 bg-muted/50">
          <Icon
            icon="solar:danger-circle-bold"
            width="24"
            height="24"
            className="text-destructive mt-0.5"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">
              পাসওয়ার্ড অ্যাক্সেস
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              পাসওয়ার্ড অ্যাক্সেস করতে{" "}
              <span className="font-bold text-destructive">পারবে না</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full pt-2 flex flex-col-reverse sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleDeny}
          disabled={isPending}
          className="flex-1 rounded-xl bg-card hover:bg-accent px-4 py-6 text-sm font-semibold cursor-pointer"
        >
          বাতিল করুন
        </Button>
        <SubmitButton
          onClick={handleApprove}
          type="button"
          isPending={isPending}
          pendingText="অনুমোদন হচ্ছে..."
          className="flex-1 rounded-xl px-4 py-6 text-sm font-semibold cursor-pointer"
        >
          অনুমোদন করুন
        </SubmitButton>
      </div>
    </div>
  );
}
