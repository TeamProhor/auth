"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { User } from "@/db/schema";

const bnDateOnlyFormatter = new Intl.DateTimeFormat("bn-BD", {
  dateStyle: "medium",
  timeZone: "UTC",
});

interface UserRowProps {
  user: User;
  consentClientId: string;
  appName: string;
  onBanAction: (user: User) => void;
}

export function UserRow({
  user,
  consentClientId,
  appName,
  onBanAction,
}: UserRowProps) {
  return (
    <TableRow
      key={`${user.id}-${consentClientId}`}
      className={user.isBanned ? "opacity-60" : ""}
    >
      <TableCell className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {user.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p
              className={`font-semibold text-foreground text-sm ${
                user.isBanned ? "line-through" : ""
              }`}
            >
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-muted-foreground text-xs">
        {user.createdAt
          ? bnDateOnlyFormatter.format(new Date(user.createdAt))
          : "—"}
      </TableCell>
      <TableCell className="px-5 py-4">
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg">
          {appName}
        </span>
      </TableCell>
      <TableCell className="px-5 py-4">
        {user.isBanned ? (
          <Badge variant="destructive" className="font-bold">
            ব্যানড
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="text-emerald-500 bg-emerald-500/10 font-bold"
          >
            সক্রিয়
          </Badge>
        )}
      </TableCell>
      <TableCell className="px-5 py-4 text-right">
        {user.isBanned ? (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onBanAction(user)}
          >
            আনব্যান করুন
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-destructive hover:bg-destructive/10"
            onClick={() => onBanAction(user)}
          >
            ব্যান করুন
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
