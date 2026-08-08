"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserActionModals } from "./user-action-modals";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  joined: string;
  lastLogin: string;
  status: "active" | "banned";
  avatarText: string;
  avatarColorClass: string;
}

const initialUsers: UserItem[] = [
  {
    id: "1",
    name: "Hasan Mahmud",
    email: "hasan@example.com",
    joined: "১২ মে, ২০২৪",
    lastLogin: "২ মিনিট আগে",
    status: "active",
    avatarText: "H",
    avatarColorClass: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "2",
    name: "Farjana Akter",
    email: "farjana@example.com",
    joined: "০১ জুন, ২০২৪",
    lastLogin: "৩ দিন আগে",
    status: "active",
    avatarText: "F",
    avatarColorClass: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "3",
    name: "Spammer Account",
    email: "spam@tempmail.com",
    joined: "আজ",
    lastLogin: "-",
    status: "banned",
    avatarText: "S",
    avatarColorClass: "bg-muted text-muted-foreground",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [activeDialog, setActiveDialog] = useState<
    "profile" | "access" | "ban" | null
  >(null);

  const handleOpenDialog = (
    user: UserItem,
    dialogType: "profile" | "access" | "ban",
  ) => {
    setSelectedUser(user);
    setActiveDialog(dialogType);
  };

  const handleBanToggle = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, status: u.status === "active" ? "banned" : "active" }
          : u,
      ),
    );
    setActiveDialog(null);
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            ইউজার ডিরেক্টরি
          </h2>
          <p className="text-muted-foreground text-sm">
            আপনার অ্যাপ্লিকেশনে সাইন আপ করা ব্যবহারকারীদের পরিচালনা করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InputGroup className="w-64">
            <InputGroupAddon align="inline-start">
              <Icon
                icon="solar:magnifer-linear"
                width="18"
                height="18"
                className="text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupInput placeholder="ইমেইল বা নাম খুঁজুন..." />
          </InputGroup>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-5 py-3.5 font-bold">
                ইউজার (User)
              </TableHead>
              <TableHead className="px-5 py-3.5 font-bold">
                সাইন আপ (Joined)
              </TableHead>
              <TableHead className="px-5 py-3.5 font-bold">
                শেষ লগইন (Last Login)
              </TableHead>
              <TableHead className="px-5 py-3.5 font-bold">
                স্ট্যাটাস (Status)
              </TableHead>
              <TableHead className="px-5 py-3.5 font-bold text-right">
                অ্যাকশন
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className={user.status === "banned" ? "opacity-60" : ""}
              >
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback
                        className={`${user.avatarColorClass} font-bold text-xs`}
                      >
                        {user.avatarText}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p
                        className={`font-semibold text-foreground ${
                          user.status === "banned" ? "line-through" : ""
                        }`}
                      >
                        {user.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-4 text-muted-foreground">
                  {user.joined}
                </TableCell>
                <TableCell className="px-5 py-4 text-muted-foreground">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="px-5 py-4">
                  {user.status === "active" ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-500 font-bold"
                    >
                      অ্যাক্টিভ
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="font-bold">
                      ব্যানড (Banned)
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                        />
                      }
                    >
                      <Icon
                        icon="solar:menu-dots-bold"
                        width="18"
                        height="18"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(user, "profile")}
                        >
                          ভিউ প্রোফাইল
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(user, "access")}
                        >
                          এডিট অ্যাক্সেস
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleOpenDialog(user, "ban")}
                        >
                          {user.status === "active" ? "ব্যান করুন" : "অনব্যান করুন"}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-muted/20 border-t border-border">
            <TableRow>
              <TableCell
                colSpan={3}
                className="px-5 py-4 text-sm text-muted-foreground font-normal"
              >
                মোট {users.length} জন ব্যবহারকারী
              </TableCell>
              <TableCell colSpan={2} className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" disabled>
                    আগের
                  </Button>
                  <Button variant="outline" size="sm">
                    পরের
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>

      <UserActionModals
        selectedUser={selectedUser}
        activeDialog={activeDialog}
        setActiveDialog={setActiveDialog}
        handleBanToggle={handleBanToggle}
      />
    </div>
  );
}
