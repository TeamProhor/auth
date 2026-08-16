"use client";

import { useState, useTransition } from "react";
import {
  createOAuthClientAction,
  createPersonalApiKeyAction,
  deleteOAuthClientAction,
  revokePersonalApiKeyAction,
} from "@/actions/oauth";
import {
  AddCircle,
  Box,
  CheckCircle,
  Copy,
  Danger,
  Eye,
  EyeClosed,
  Key,
  Trash,
} from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { OAuthClient, PersonalApiKey } from "@/db/schema";
import { showToast } from "@/lib/toast";

const bnDateFormatter = new Intl.DateTimeFormat("bn", {
  dateStyle: "medium",
  timeStyle: "short",
});

interface OAuthKeysManagerProps {
  initialApps: OAuthClient[];
  initialKeys: PersonalApiKey[];
}

export function OAuthKeysManager({
  initialApps,
  initialKeys,
}: OAuthKeysManagerProps) {
  const [apps, setApps] = useState<OAuthClient[]>(initialApps);
  const [keys, setKeys] = useState<PersonalApiKey[]>(initialKeys);

  // Modal states
  const [openNewApp, setOpenNewApp] = useState(false);
  const [openNewKey, setOpenNewKey] = useState(false);
  const [newlyCreatedClient, setNewlyCreatedClient] = useState<{
    name: string;
    clientId: string;
    clientSecret?: string;
  } | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{
    name: string;
    key: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [isPendingApp, startAppTransition] = useTransition();
  const [isPendingKey, startKeyTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  // Create App Submit
  const handleCreateApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startAppTransition(async () => {
      const res = await createOAuthClientAction(formData);
      if (res.success && res.client) {
        setNewlyCreatedClient(res.client);
        setOpenNewApp(false);
        showToast.success("ওঅথ অ্যাপ্লিকেশন সফলভাবে তৈরি হয়েছে!");
      } else {
        showToast.error(res.error || "অ্যাপ তৈরি করা সম্ভব হয়নি।");
      }
    });
  };

  // Create Key Submit
  const handleCreateKey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startKeyTransition(async () => {
      const res = await createPersonalApiKeyAction(formData);
      if (res.success && res.apiKey) {
        setNewlyCreatedKey({
          name: res.apiKey.name,
          key: res.apiKey.key,
        });
        setOpenNewKey(false);
        showToast.success("নতুন এপিআই কী তৈরি হয়েছে!");
      } else {
        showToast.error(res.error || "এপিআই কী তৈরি করা সম্ভব হয়নি।");
      }
    });
  };

  // Delete App
  const handleDeleteApp = (clientId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ওঅথ অ্যাপ্লিকেশনটি মুছে ফেলতে চান?")) return;
    startDeleteTransition(async () => {
      const res = await deleteOAuthClientAction(clientId);
      if (res.success) {
        setApps((prev) => prev.filter((a) => a.clientId !== clientId));
        showToast.success("অ্যাপ্লিকেশন সফলভাবে মুছে ফেলা হয়েছে।");
      } else {
        showToast.error(res.error || "মুছে ফেলা ব্যর্থ হয়েছে।");
      }
    });
  };

  // Revoke Key
  const handleRevokeKey = (keyId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই API কী-টি বাতিল করতে চান?")) return;
    startDeleteTransition(async () => {
      const res = await revokePersonalApiKeyAction(keyId);
      if (res.success) {
        setKeys((prev) => prev.filter((k) => k.id !== keyId));
        showToast.success("API কী বাতিল করা হয়েছে।");
      } else {
        showToast.error(res.error || "বাতিল করা ব্যর্থ হয়েছে।");
      }
    });
  };

  const copyToClipboard = (text: string, isSecret = false) => {
    navigator.clipboard.writeText(text);
    if (isSecret) {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
    showToast.success("ক্লিপবোর্ডে কপি করা হয়েছে!");
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── OAuth Apps Section ─── */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 border-b border-border">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Box className="text-primary size-5" />
                  ওঅথ অ্যাপ্লিকেশনসমূহ ({apps.length}টি)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  "Continue with Prohor" বাটনের মাধ্যমে লগইন সুবিধা দিতে অ্যাপ তৈরি
                  করুন।
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setOpenNewApp(true)}
                className="rounded-xl cursor-pointer text-xs font-semibold gap-1.5"
              >
                <AddCircle size={14} />
                নতুন অ্যাপ
              </Button>
            </CardHeader>

            <CardContent className="pt-6">
              {apps.length === 0 ? (
                <div className="py-12 px-4 text-center border border-dashed border-border rounded-2xl bg-muted/30 space-y-3">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                    <Box size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      কোনো ওঅথ অ্যাপ পাওয়া যায়নি
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      আপনার প্ল্যাটফর্মে প্রহর লগইন চালু করতে একটি নতুন ক্লায়েন্ট অ্যাপ যোগ
                      করুন।
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOpenNewApp(true)}
                    className="rounded-xl text-xs cursor-pointer"
                  >
                    প্রথম অ্যাপ তৈরি করুন
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-foreground truncate">
                            {app.name}
                          </p>
                          <Badge variant="secondary" className="text-[10px]">
                            {app.appType.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground truncate select-all">
                          Client ID: {app.clientId}
                        </p>
                        {app.redirectUris && app.redirectUris.length > 0 && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            Redirect: {app.redirectUris[0]}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(app.clientId)}
                          title="Client ID কপি করুন"
                          className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          <Copy size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPendingDelete}
                          onClick={() => handleDeleteApp(app.clientId)}
                          title="অ্যাপ্লিকেশন মুছে ফেলুন"
                          className="size-8 rounded-lg cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </Card>

        {/* ─── API Keys Section ─── */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 border-b border-border gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Key className="text-primary size-5 shrink-0" />
                  ব্যক্তিগত API কী ({keys.length}টি)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  আপনার অ্যাকাউন্টের পক্ষে প্রোগ্রামাটিক্যালি প্রহর API ব্যবহারের অনুমতিপত্র।
                </CardDescription>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOpenNewKey(true)}
                className="rounded-xl cursor-pointer text-xs font-semibold gap-1.5"
              >
                <AddCircle size={14} />
                নতুন কী
              </Button>
            </CardHeader>

            <CardContent className="pt-6">
              {keys.length === 0 ? (
                <div className="py-12 px-4 text-center border border-dashed border-border rounded-2xl bg-muted/30 space-y-3">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                    <Key size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      কোনো সক্রিয় API কী নেই
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      স্ক্রিপ্ট বা ব্যাকএন্ড সার্ভিস থেকে ডেটা অ্যাক্সেসের জন্য নতুন সিক্রেট কী
                      তৈরি করুন।
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOpenNewKey(true)}
                    className="rounded-xl text-xs cursor-pointer"
                  >
                    প্রথম API কী তৈরি করুন
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {keys.map((k) => (
                    <div
                      key={k.id}
                      className="p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="font-bold text-sm text-foreground truncate">
                          {k.name}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground truncate select-all">
                          {k.keyPrefix}••••••••••••
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          তৈরি:{" "}
                          {k.createdAt
                            ? bnDateFormatter.format(new Date(k.createdAt))
                            : "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Badge
                          variant="outline"
                          className="text-xs font-mono text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                        >
                          Active
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPendingDelete}
                          onClick={() => handleRevokeKey(k.id)}
                          title="API কী বাতিল করুন"
                          className="size-8 rounded-lg cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>

      {/* ─── Modal: Create OAuth Client ─── */}
      <ResponsiveDialog
        open={openNewApp}
        onOpenChange={setOpenNewApp}
        className="sm:max-w-xl"
        title="নতুন ওঅথ অ্যাপ নিবন্ধন করুন"
        description="আপনার অ্যাপ্লিকেশনের বিস্তারিত তথ্য লিখুন। তৈরি করার পর ক্লায়েন্ট আইডি ও সিক্রেট পাবেন।"
      >
        <form onSubmit={handleCreateApp}>
          <FieldGroup className="py-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="app-name">অ্যাপ্লিকেশনের নাম</FieldLabel>
              <Input
                id="app-name"
                name="name"
                placeholder="যেমন: Prohor Mobile App বা My Portal"
                required
                className="rounded-xl"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="app-type">
                অ্যাপ্লিকেশনের ধরন (Application Type)
              </FieldLabel>
              <Select name="appType" defaultValue="web">
                <SelectTrigger id="app-type" className="w-full rounded-xl">
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="web">
                      Web App (সার্ভার সাইড / Confidential)
                    </SelectItem>
                    <SelectItem value="spa">
                      Single Page App (React / Next.js / Vue)
                    </SelectItem>
                    <SelectItem value="native">
                      Native / Mobile (iOS, Android, Desktop)
                    </SelectItem>
                    <SelectItem value="service">
                      Machine-to-Machine / Service
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="redirect-uris">
                রিডাইরেক্ট URI (Redirect Callback URIs)
              </FieldLabel>
              <Textarea
                id="redirect-uris"
                name="redirectUris"
                rows={3}
                placeholder="https://yourapp.com/api/auth/callback&#10;http://localhost:3000/callback"
                required
                className="rounded-xl font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                একাধিক URI যুক্ত করতে প্রতি লাইনে একটি করে অথবা কমা (,) দিয়ে লিখুন।
              </p>
            </Field>

            <Field>
              <FieldLabel htmlFor="app-desc">বিবরণ (ঐচ্ছিক)</FieldLabel>
              <Input
                id="app-desc"
                name="description"
                placeholder="অ্যাপ সম্পর্কে সংক্ষেপ কিছু লিখুন"
                className="rounded-xl"
              />
            </Field>
          </FieldGroup>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpenNewApp(false)}
            >
              বাতিল
            </Button>
            <SubmitButton type="submit" isPending={isPendingApp}>
              অ্যাপ তৈরি করুন
            </SubmitButton>
          </div>
        </form>
      </ResponsiveDialog>

      {/* ─── Modal: Create Personal API Key ─── */}
      <ResponsiveDialog
        open={openNewKey}
        onOpenChange={setOpenNewKey}
        className="sm:max-w-xl"
        title="নতুন ব্যক্তিগত API কী তৈরি করুন"
        description="এই সিক্রেট কী দিয়ে আপনার অ্যাকাউন্টের বিভিন্ন পরিষেবা প্রোগ্রামাটিক্যালি নিয়ন্ত্রণ করতে পারবেন।"
      >
        <form onSubmit={handleCreateKey}>
          <FieldGroup className="py-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="key-name">কী-এর নাম / লেবেল</FieldLabel>
              <Input
                id="key-name"
                name="name"
                placeholder="যেমন: CLI Tool, CI/CD Deployment, VPS Server"
                required
                className="rounded-xl"
              />
            </Field>
          </FieldGroup>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpenNewKey(false)}
            >
              বাতিল
            </Button>
            <SubmitButton type="submit" isPending={isPendingKey}>
              কী তৈরি করুন
            </SubmitButton>
          </div>
        </form>
      </ResponsiveDialog>

      {/* ─── Modal: Client Credentials Success Alert ─── */}
      {newlyCreatedClient && (
        <ResponsiveDialog
          open={Boolean(newlyCreatedClient)}
          onOpenChange={() => setNewlyCreatedClient(null)}
          className="sm:max-w-xl"
          title={
            <span className="text-emerald-500">ওঅথ অ্যাপ সফলভাবে তৈরি হয়েছে!</span>
          }
          description="নিচের ক্লায়েন্ট ক্রেডেনশিয়ালস নিরাপদে সংরক্ষণ করুন। সিক্রেট কী-টি আর পুনরায় দেখানো হবে না।"
        >
          <div className="space-y-4 py-3">
            <div className="p-3 bg-muted rounded-xl space-y-1.5 border border-border">
              <p className="text-xs font-semibold text-muted-foreground">
                অ্যাপের নাম
              </p>
              <p className="text-sm font-bold text-foreground">
                {newlyCreatedClient.name}
              </p>
            </div>

            <div className="p-3 bg-muted rounded-xl space-y-1.5 border border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground">
                  Client ID
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(newlyCreatedClient.clientId)}
                  className="h-6 px-2 text-xs text-primary hover:text-primary cursor-pointer gap-1"
                >
                  <Copy size={12} />
                  কপি
                </Button>
              </div>
              <p className="text-xs font-mono font-bold text-foreground select-all break-all">
                {newlyCreatedClient.clientId}
              </p>
            </div>

            {newlyCreatedClient.clientSecret && (
              <div className="p-3 bg-muted rounded-xl space-y-1.5 border border-border">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Client Secret
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSecret(!showSecret)}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showSecret ? <EyeClosed size={12} /> : <Eye size={12} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          newlyCreatedClient.clientSecret ?? "",
                          true,
                        )
                      }
                      className="h-6 px-2 text-xs text-primary hover:text-primary cursor-pointer gap-1"
                    >
                      {copiedSecret ? (
                        <CheckCircle size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copiedSecret ? "কপি হয়েছে" : "কপি"}
                    </Button>
                  </div>
                </div>
                <p className="text-xs font-mono font-bold text-foreground select-all break-all">
                  {showSecret
                    ? newlyCreatedClient.clientSecret
                    : "••••••••••••••••••••••••••••••••••••••••"}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
              <Danger size={16} className="shrink-0 mt-0.5" />
              <span>
                সতর্কতা: ক্লায়েন্ট সিক্রেট কী-টি আপনার ব্যাকএন্ডে সাবধানে সংরক্ষণ করুন। ব্রাউজার
                বা পাবলিক রেপোতে প্রকাশ করবেন না।
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="default"
              onClick={() => {
                setNewlyCreatedClient(null);
                window.location.reload();
              }}
              className="w-full rounded-xl cursor-pointer"
            >
              আমি ক্রেডেনশিয়ালস সংরক্ষণ করেছি
            </Button>
          </div>
        </ResponsiveDialog>
      )}

      {/* ─── Modal: Personal API Key Success Alert ─── */}
      {newlyCreatedKey && (
        <ResponsiveDialog
          open={Boolean(newlyCreatedKey)}
          onOpenChange={() => setNewlyCreatedKey(null)}
          className="sm:max-w-xl"
          title={
            <span className="text-emerald-500">API কী তৈরি সম্পন্ন হয়েছে!</span>
          }
          description="নিচের কী-টি এখনি কপি করে রাখুন। নিরাপত্তার স্বার্থে এটি পুনরায় আর দেখানো হবেರಿ হবে না।"
        >
          <div className="space-y-4 py-3">
            <div className="p-3 bg-muted rounded-xl space-y-1.5 border border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground">
                  {newlyCreatedKey.name}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(newlyCreatedKey.key)}
                  className="h-6 px-2 text-xs text-primary hover:text-primary cursor-pointer gap-1"
                >
                  {copiedKey ? <CheckCircle size={12} /> : <Copy size={12} />}
                  {copiedKey ? "কপি হয়েছে" : "কপি করুন"}
                </Button>
              </div>
              <p className="text-xs font-mono font-bold text-foreground select-all break-all">
                {newlyCreatedKey.key}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
              <Danger size={16} className="shrink-0 mt-0.5" />
              <span>
                এই সিক্রেট টোকেনটি আপনার প্রোফাইলের সকল অ্যাক্সেস বহন করে। কাউকে শেয়ার
                করবেন না।
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={() => {
                setNewlyCreatedKey(null);
                window.location.reload();
              }}
              className="w-full rounded-xl cursor-pointer"
            >
              ঠিক আছে, বুঝেছি
            </Button>
          </div>
        </ResponsiveDialog>
      )}
    </>
  );
}
