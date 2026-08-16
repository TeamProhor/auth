"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleOAuthClientActiveAction } from "@/actions/admin-oauth";
import { Code } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OAuthClientItem {
  client: {
    id: string;
    ownerId: string;
    clientId: string;
    name: string;
    description: string | null;
    appType: string;
    redirectUris: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface OAuthAppsTableProps {
  items: OAuthClientItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function OAuthAppsTable({
  items,
  total,
  page,
  totalPages,
}: OAuthAppsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmApp, setConfirmApp] = useState<OAuthClientItem | null>(null);

  const handleConfirmToggle = () => {
    if (!confirmApp) return;
    startTransition(async () => {
      await toggleOAuthClientActiveAction(
        confirmApp.client.clientId,
        !confirmApp.client.isActive,
      );
      setConfirmApp(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-bold">
                অ্যাপ্লিকেশনের নাম
              </TableHead>
              <TableHead className="text-xs font-bold">মালিক (Owner)</TableHead>
              <TableHead className="text-xs font-bold">টাইপ</TableHead>
              <TableHead className="text-xs font-bold">Client ID</TableHead>
              <TableHead className="text-xs font-bold">স্ট্যাটাস</TableHead>
              <TableHead className="text-xs font-bold text-right">
                অ্যাকশন
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-xs text-muted-foreground"
                >
                  কোনো OAuth অ্যাপ্লিকেশন পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const { client, owner } = item;
                const initial = (
                  owner.name[0] ||
                  owner.email[0] ||
                  "U"
                ).toUpperCase();

                return (
                  <TableRow
                    key={client.id}
                    className="hover:bg-accent/40 transition-colors text-xs"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          <Code size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground truncate">
                            {client.name}
                          </span>
                          {client.description && (
                            <span className="text-[10px] text-muted-foreground truncate">
                              {client.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 border border-border shrink-0">
                          {owner.avatarUrl ? (
                            <AvatarImage
                              src={owner.avatarUrl}
                              alt={owner.name}
                            />
                          ) : null}
                          <AvatarFallback className="text-[9px] font-bold bg-primary/20 text-primary">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground truncate">
                            {owner.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {owner.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-semibold"
                      >
                        {client.appType}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-[10.5px] text-muted-foreground bg-accent/60 px-2 py-0.5 rounded">
                        {client.clientId}
                      </span>
                    </TableCell>

                    <TableCell>
                      {client.isActive ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-emerald-600 border-emerald-500/30"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">
                          Suspended
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant={client.isActive ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setConfirmApp(item)}
                        className="h-7 text-xs rounded-lg cursor-pointer"
                      >
                        {client.isActive ? "স্থগিত করুন" : "সক্রিয় করুন"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>
            মোট {total.toLocaleString("bn-BD")} টি অ্যাপ্লিকেশন • পৃষ্ঠা {page} /{" "}
            {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => router.push(`/admin/oauth-apps?page=${page - 1}`)}
              className="text-xs rounded-xl cursor-pointer"
            >
              পূর্ববর্তী
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => router.push(`/admin/oauth-apps?page=${page + 1}`)}
              className="text-xs rounded-xl cursor-pointer"
            >
              পরবর্তী
            </Button>
          </div>
        </div>
      )}

      {/* Responsive Confirmation Dialog */}
      <ResponsiveDialog
        open={!!confirmApp}
        onOpenChange={(open) => {
          if (!open) setConfirmApp(null);
        }}
        title={
          confirmApp?.client.isActive ? "অ্যাপ স্থগিত করবেন?" : "অ্যাপ সক্রিয় করবেন?"
        }
        description={
          confirmApp?.client.isActive
            ? `আপনি কি "${confirmApp.client.name}" অ্যাপ্লিকেশনটির এক্সেস স্থগিত করতে চান? স্থগিত অবস্থায় কোনো ইউজার এতে লগইন করতে পারবে না।`
            : `আপনি কি "${confirmApp?.client.name}" অ্যাপ্লিকেশনটি পুনরায় সক্রিয় করতে চান?`
        }
        trigger={null}
        className="sm:max-w-md"
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button
            variant="ghost"
            onClick={() => setConfirmApp(null)}
            disabled={isPending}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            বাতিল
          </Button>
          <SubmitButton
            variant={confirmApp?.client.isActive ? "destructive" : "default"}
            onClick={handleConfirmToggle}
            isPending={isPending}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            {confirmApp?.client.isActive ? "হ্যাঁ, স্থগিত করুন" : "হ্যাঁ, সক্রিয় করুন"}
          </SubmitButton>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
