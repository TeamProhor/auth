"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useActionState, useState } from "react";
import {
  addRedirectUriAction,
  createAppAction,
  deleteAppAction,
  removeRedirectUriAction,
  rotateClientSecretAction,
} from "@/actions/developer";
import { AppCard } from "@/components/developer/app-card";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OAuthClient } from "@/db/schema";

interface AppsPageClientProps {
  apps: OAuthClient[];
}

export function AppsPageClient({ apps }: AppsPageClientProps) {
  const [newSecretData, setNewSecretData] = useState<{
    clientId: string;
    secret: string;
  } | null>(null);
  const [newUriInputs, setNewUriInputs] = useState<Record<string, string>>({});
  const [createState, createFormAction, _createPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await createAppAction(null, formData);
      if (result.success && result.data) {
        setNewSecretData({
          clientId: result.data.clientId,
          secret: result.data.clientSecret,
        });
      }
      return result;
    },
    null,
  );

  const handleRotate = async (clientId: string) => {
    const result = await rotateClientSecretAction(clientId);
    if (result.success && result.data) {
      setNewSecretData({ clientId, secret: result.data.clientSecret });
    }
  };

  const handleAddUri = async (clientId: string) => {
    const uri = newUriInputs[clientId];
    if (!uri) return;
    await addRedirectUriAction(clientId, uri);
    setNewUriInputs((prev) => ({ ...prev, [clientId]: "" }));
  };

  const handleRemoveUri = async (clientId: string, uri: string) => {
    await removeRedirectUriAction(clientId, uri);
  };

  const handleDelete = async (clientId: string) => {
    await deleteAppAction(clientId);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            অ্যাপস ও OAuth ক্লায়েন্ট
          </h2>
          <p className="text-muted-foreground text-sm">
            OAuth 2.1 অ্যাপ্লিকেশন নিবন্ধন এবং কনফিগার করুন।
          </p>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button className="rounded-xl px-5 py-6 text-sm font-semibold cursor-pointer shrink-0">
                <Icon
                  icon="solar:add-square-bold"
                  width="20"
                  height="20"
                  className="mr-2"
                />
                নতুন অ্যাপ
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>নতুন অ্যাপ্লিকেশন নিবন্ধন</DialogTitle>
              <DialogDescription>
                OAuth 2.1 ক্লায়েন্ট ক্রেডেনশিয়াল তৈরি করতে তথ্য প্রদান করুন।
              </DialogDescription>
            </DialogHeader>
            {createState && !createState.success && (
              <p className="text-sm text-destructive">{createState.error}</p>
            )}
            {newSecretData && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-2">
                <p className="text-xs font-bold text-emerald-500">
                  অ্যাপ তৈরি হয়েছে! এই সিক্রেটটি একবারই দেখা যাবে:
                </p>
                <code className="block text-xs font-mono break-all text-foreground">
                  {newSecretData.secret}
                </code>
              </div>
            )}
            <form action={createFormAction}>
              <FieldGroup className="py-2">
                <Field>
                  <FieldLabel htmlFor="app-name">অ্যাপের নাম</FieldLabel>
                  <Input
                    id="app-name"
                    name="name"
                    placeholder="যেমন: My Custom App"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="app-type">অ্যাপ্লিকেশনের ধরন</FieldLabel>
                  <Select name="appType" defaultValue="web">
                    <SelectTrigger id="app-type" className="w-full">
                      <SelectValue placeholder="ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="web">
                          Web Application (PKCE)
                        </SelectItem>
                        <SelectItem value="native">
                          Mobile / Native App
                        </SelectItem>
                        <SelectItem value="service">
                          Machine to Machine (M2M)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="redirect-uri">রিডাইরেক্ট URI</FieldLabel>
                  <Input
                    id="redirect-uri"
                    name="redirectUri"
                    placeholder="https://example.com/callback"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline" type="button" />}
                >
                  বাতিল
                </DialogClose>
                <SubmitButton pendingText="তৈরি হচ্ছে...">তৈরি করুন</SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── New Secret Modal ─── */}
      {newSecretData && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 flex items-start gap-4">
          <Icon
            icon="solar:check-circle-bold"
            width="20"
            height="20"
            className="text-emerald-500 mt-0.5 shrink-0"
          />
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">
              নতুন সিক্রেট তৈরি হয়েছে — এটি এখনই কপি করুন!
            </p>
            <code className="text-xs font-mono break-all text-muted-foreground">
              {newSecretData.secret}
            </code>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(newSecretData.secret);
            }}
          >
            <Icon icon="solar:copy-bold" width="16" height="16" />
          </Button>
        </div>
      )}

      {/* ─── App Cards ─── */}
      {apps.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Icon
            icon="solar:code-bold"
            width="40"
            height="40"
            className="mx-auto mb-4 opacity-50"
          />
          <p className="font-semibold">এখনো কোনো অ্যাপ নেই</p>
          <p className="text-sm mt-1">
            প্রথম OAuth অ্যাপ তৈরি করতে উপরের বাটন ব্যবহার করুন।
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              newUriInput={newUriInputs[app.clientId] ?? ""}
              onRotate={handleRotate}
              onDelete={handleDelete}
              onAddUri={handleAddUri}
              onRemoveUri={handleRemoveUri}
              onUriInputChange={(clientId, val) =>
                setNewUriInputs((prev) => ({ ...prev, [clientId]: val }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
