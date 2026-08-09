"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
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

interface UsersFilterHeaderProps {
  total: number;
  apps: Array<{ clientId: string; name: string }>;
  appFilter: string;
  onAppFilterChange: (val: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export function UsersFilterHeader({
  total,
  apps,
  appFilter,
  onAppFilterChange,
  search,
  onSearchChange,
}: UsersFilterHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          ইউজার ডিরেক্টরি
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার অ্যাপ্লিকেশনে সাইন আপ করা{" "}
          <span className="font-semibold text-foreground">{total}জন</span>{" "}
          ব্যবহারকারী।
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {apps.length > 1 && (
          <Select
            value={appFilter}
            onValueChange={(value) => onAppFilterChange(value ?? "all")}
          >
            <SelectTrigger className="w-44 rounded-xl">
              <SelectValue placeholder="সব অ্যাপ" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">সব অ্যাপ</SelectItem>
                {apps.map((app) => (
                  <SelectItem key={app.clientId} value={app.clientId}>
                    {app.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <InputGroup className="w-64">
          <InputGroupAddon align="inline-start">
            <Icon
              icon="solar:magnifer-linear"
              width="18"
              height="18"
              className="text-muted-foreground"
            />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="ইমেইল বা নাম খুঁজুন..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>
      </div>
    </div>
  );
}
