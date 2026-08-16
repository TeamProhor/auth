"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { revokeApiKeyByAdminAction } from "@/actions/admin-oauth";
import { Key } from "@/components/icons";
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

interface ApiKeyItem {
  key: {
    id: string;
    userId: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
    lastUsedAt: Date | null;
    expiresAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface ApiKeysTableProps {
  items: ApiKeyItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function ApiKeysTable({
  items,
  total,
  page,
  totalPages,
}: ApiKeysTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyItem | null>(null);

  const handleRevokeConfirm = () => {
    if (!keyToRevoke) return;
    startTransition(async () => {
      await revokeApiKeyByAdminAction(keyToRevoke.key.id);
      setKeyToRevoke(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-bold">কী-এর নাম</TableHead>
              <TableHead className="text-xs font-bold">ব্যবহারকারী</TableHead>
              <TableHead className="text-xs font-bold">Prefix</TableHead>
              <TableHead className="text-xs font-bold">স্কোপ</TableHead>
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
                  কোনো পার্সোনাল API Key পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const { key: k, user } = item;
                const initial = (
                  user.name[0] ||
                  user.email[0] ||
                  "U"
                ).toUpperCase();
                const isRevoked = !!k.revokedAt;

                return (
                  <TableRow
                    key={k.id}
                    className="hover:bg-accent/40 transition-colors text-xs"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-primary shrink-0" />
                        <span className="font-semibold text-foreground">
                          {k.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 border border-border shrink-0">
                          {user.avatarUrl ? (
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                          ) : null}
                          <AvatarFallback className="text-[9px] font-bold bg-primary/20 text-primary">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground truncate">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-[11px] bg-accent/60 px-2 py-0.5 rounded text-foreground">
                        {k.keyPrefix}...
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {k.scopes.map((s) => (
                          <Badge
                            key={s}
                            variant="outline"
                            className="text-[9px] px-1 py-0"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      {isRevoked ? (
                        <Badge variant="destructive" className="text-[10px]">
                          Revoked
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-emerald-600 border-emerald-500/30"
                        >
                          Active
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      {!isRevoked && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setKeyToRevoke(item)}
                          className="h-7 text-xs rounded-lg cursor-pointer"
                        >
                          বাতিল করুন
                        </Button>
                      )}
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
            মোট {total.toLocaleString("bn-BD")} টি API Key • পৃষ্ঠা {page} /{" "}
            {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() =>
                router.push(`/admin/oauth-apps?tab=keys&page=${page - 1}`)
              }
              className="text-xs rounded-xl cursor-pointer"
            >
              পূর্ববর্তী
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                router.push(`/admin/oauth-apps?tab=keys&page=${page + 1}`)
              }
              className="text-xs rounded-xl cursor-pointer"
            >
              পরবর্তী
            </Button>
          </div>
        </div>
      )}

      {/* Responsive Revoke Dialog */}
      <ResponsiveDialog
        open={!!keyToRevoke}
        onOpenChange={(open) => {
          if (!open) setKeyToRevoke(null);
        }}
        title="API কী বাতিল করবেন?"
        description={`আপনি কি নিশ্চিত যে আপনি "${keyToRevoke?.key.name}" (${keyToRevoke?.user.email}) এর API কী বাতিল করতে চান? এটি বাতিল করার পর এই কী দিয়ে আর কোনো অনুরোধ করা যাবে না।`}
        trigger={null}
        className="sm:max-w-md"
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button
            variant="ghost"
            onClick={() => setKeyToRevoke(null)}
            disabled={isPending}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            ফিরে যান
          </Button>
          <SubmitButton
            variant="destructive"
            onClick={handleRevokeConfirm}
            isPending={isPending}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            হ্যাঁ, বাতিল করুন
          </SubmitButton>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
