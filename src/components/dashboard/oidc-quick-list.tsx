"use client";

import { useState } from "react";
import { CheckCircle, Code, Copy } from "@/components/icons";
import { QuickList, QuickListItem } from "@/components/shared/quick-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

interface EndpointItem {
  name: string;
  nameBn: string;
  url: string;
  method: "GET" | "POST" | "GET / POST";
  color: "cyan" | "purple" | "emerald" | "blue" | "amber";
  description: string;
  isPublicGet?: boolean;
}

const OIDC_ENDPOINTS: EndpointItem[] = [
  {
    name: "OpenID Configuration",
    nameBn: "ওপেনআইডি ডিসকভারি",
    url: "/.well-known/openid-configuration",
    method: "GET",
    color: "cyan",
    description: "OAuth 2.0 / OIDC মেটাডেটা এবং প্রোভাইডার কনফিগারেশন।",
    isPublicGet: true,
  },
  {
    name: "Authorization Endpoint",
    nameBn: "অথোরাইজেশন এন্ডপয়েন্ট",
    url: "/api/oauth/authorize",
    method: "GET / POST",
    color: "purple",
    description: "ইউজার অথেন্টিকেশন ও কনসেন্ট পেজে রিডাইরেক্ট করে কোড প্রদান করে।",
  },
  {
    name: "Token Endpoint",
    nameBn: "টোকেন এক্সচেঞ্জ এন্ডপয়েন্ট",
    url: "/api/oauth/token",
    method: "POST",
    color: "emerald",
    description:
      "অথোরাইজেশন কোড এবং রিফ্রেশ টোকেন এক্সচেঞ্জ করে Access / ID Token দেয়।",
  },
  {
    name: "UserInfo Endpoint",
    nameBn: "ইউজার ইনফো এন্ডপয়েন্ট",
    url: "/api/oauth/userinfo",
    method: "GET",
    color: "blue",
    description:
      "Bearer Access Token দিয়ে ব্যবহারকারীর তথ্য (Claims) পাওয়ার এন্ডপয়েন্ট।",
  },
  {
    name: "JWKS Key Set",
    nameBn: "জেডব্লিউকেএস পাবলিক কী",
    url: "/api/jwks.json",
    method: "GET",
    color: "amber",
    description: "ID Token ও Access Token যাচাই করার জন্য পাবলিক কী সেট।",
    isPublicGet: true,
  },
];

export function OidcQuickList() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (path: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(path);
    showToast.success("এন্ডপয়েন্ট URL ক্লিপবোর্ডে কপি করা হয়েছে!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="pt-6 border-t border-border">
      <QuickList
        title="ওআইডিসি (OIDC) কনফিগারেশন তথ্য"
        description="প্রহর অথেন্টিকেশন প্রোভাইডারের স্ট্যান্ডার্ড OIDC এন্ডপয়েন্টসমূহ।"
        icon={<Code size={20} />}
        variant="list"
      >
        {OIDC_ENDPOINTS.map((ep) => {
          const isCopied = copiedUrl === ep.url;
          const methodBadgeClass =
            ep.method === "GET"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : ep.method === "POST"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

          return (
            <QuickListItem
              key={ep.url}
              icon={<Code size={20} />}
              color={ep.color}
              title={
                <div className="flex flex-wrap items-center gap-2">
                  <span>{ep.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({ep.nameBn})
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 ${methodBadgeClass}`}
                  >
                    {ep.method}
                  </Badge>
                </div>
              }
              description={ep.description}
              action={
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2 bg-muted/60 dark:bg-muted/40 border border-border/60 rounded-xl px-2.5 py-1.5">
                    <code className="text-xs font-mono text-foreground font-semibold">
                      {ep.url}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(ep.url)}
                      className="h-6 w-6 p-0 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                      title="URL কপি করুন"
                    >
                      {isCopied ? (
                        <CheckCircle size={13} className="text-emerald-500" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </Button>
                  </div>

                  {ep.isPublicGet && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(ep.url, "_blank")}
                      className="h-8 px-2.5 text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      ওপেন
                    </Button>
                  )}
                </div>
              }
            />
          );
        })}
      </QuickList>
    </div>
  );
}
