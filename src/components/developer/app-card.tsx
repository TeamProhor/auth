"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { OAuthClient } from "@/db/schema";

interface AppCardProps {
  app: OAuthClient;
  newUriInput: string;
  onRotate: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  onAddUri: (clientId: string) => void;
  onRemoveUri: (clientId: string, uri: string) => void;
  onUriInputChange: (clientId: string, val: string) => void;
}

export function AppCard({
  app,
  newUriInput,
  onRotate,
  onDelete,
  onAddUri,
  onRemoveUri,
  onUriInputChange,
}: AppCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm p-0">
      <CardHeader className="p-5 flex flex-col md:flex-row md:items-center gap-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-sm">
            {app.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              {app.name}
            </CardTitle>
            <Badge
              variant="secondary"
              className={`mt-0.5 ${app.isActive ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground"}`}
            >
              {app.isActive ? "● সক্রিয়" : "● নিষ্ক্রিয়"}
            </Badge>
          </div>
        </div>
        <div className="md:ml-auto flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="rounded-xl px-4 py-5 text-sm font-medium"
            onClick={() => onRotate(app.clientId)}
          >
            সিক্রেট রোটেট করুন
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl px-4 py-5 text-sm text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(app.clientId)}
          >
            মুছুন
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
              ক্লায়েন্ট আইডি (Client ID)
            </span>
            <InputGroup className="mt-2">
              <InputGroupInput
                readOnly
                defaultValue={app.clientId}
                className="font-mono text-sm"
              />
              <InputGroupAddon align="inline-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => navigator.clipboard.writeText(app.clientId)}
                >
                  <Icon icon="solar:copy-bold" width="18" height="18" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
              ক্লায়েন্ট সিক্রেট (Client Secret)
            </span>
            <InputGroup className="mt-2">
              <InputGroupInput
                readOnly
                defaultValue="••••••••••••••••••••••••••••••••"
                className="font-mono text-sm"
              />
              <InputGroupAddon align="inline-end">
                <Button variant="ghost" size="icon" className="size-8">
                  <Icon icon="solar:eye-bold" width="18" height="18" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        {/* Redirect URIs */}
        <div className="pt-4 border-t border-border">
          <span className="text-sm font-semibold text-foreground block">
            অনুমোদিত রিডাইরেক্ট ইউআরআই
          </span>
          <div className="mt-2 flex flex-col gap-2">
            {app.redirectUris.map((uri) => (
              <div
                key={uri}
                className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg"
              >
                <span className="text-sm font-mono text-muted-foreground">
                  {uri}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveUri(app.clientId, uri)}
                >
                  <Icon
                    icon="solar:trash-bin-trash-bold"
                    width="16"
                    height="16"
                  />
                </Button>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="https://example.com/callback"
                className="text-sm"
                value={newUriInput}
                onChange={(e) => onUriInputChange(app.clientId, e.target.value)}
              />
              <Button
                variant="outline"
                className="shrink-0"
                onClick={() => onAddUri(app.clientId)}
              >
                + যোগ করুন
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
