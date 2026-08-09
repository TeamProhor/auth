"use client";

import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";

interface SocialLoginsProps {
  isGooglePending: boolean;
  isGitHubPending: boolean;
  onGoogleClick: () => void;
  onGitHubClick: () => void;
}

export function SocialLogins({
  isGooglePending,
  isGitHubPending,
  onGoogleClick,
  onGitHubClick,
}: SocialLoginsProps) {
  return (
    <>
      <div className="w-full flex items-center gap-4 py-2 opacity-60">
        <div className="h-[1px] flex-1 bg-border" />
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
          অথবা
        </span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      <div className="w-full flex flex-col gap-2">
        <SubmitButton
          type="button"
          variant="outline"
          isPending={isGooglePending}
          onClick={onGoogleClick}
          className="w-full rounded-xl bg-card hover:bg-accent hover:text-foreground px-4 py-6 text-sm font-medium flex items-center justify-center cursor-pointer shadow-sm"
        >
          <GoogleIcon className="w-5 h-5 shrink-0" />
          <span>গুগল দিয়ে চালিয়ে যান</span>
        </SubmitButton>

        <SubmitButton
          type="button"
          variant="outline"
          isPending={isGitHubPending}
          onClick={onGitHubClick}
          className="w-full rounded-xl bg-card hover:bg-accent hover:text-foreground px-4 py-6 text-sm font-medium flex items-center justify-center cursor-pointer shadow-sm"
        >
          <GitHubIcon className="w-5 h-5 shrink-0 fill-current text-foreground" />
          <span>গিটহাব দিয়ে চালিয়ে যান</span>
        </SubmitButton>
      </div>
    </>
  );
}
