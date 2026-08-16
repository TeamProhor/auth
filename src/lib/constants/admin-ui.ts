import type { ComponentType } from "react";
import { Box, Card, Home, ShieldLock, Users } from "@/components/icons";

export interface AdminNavItem {
  title: string;
  url: string;
  icon: ComponentType<{
    size?: number | string;
    className?: string;
    weight?: "Outline" | "Filled";
    color?: string;
  }>;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    title: "অ্যাডমিন ড্যাশবোর্ড",
    url: "/admin",
    icon: Home,
  },
  {
    title: "ব্যবহারকারী ব্যবস্থাপনা",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "সাবস্ক্রিপশন ও বিলিং",
    url: "/admin/subscriptions",
    icon: Card,
  },
  {
    title: "ওঅথ অ্যাপস ও API কী",
    url: "/admin/oauth-apps",
    icon: Box,
  },
  {
    title: "সিকিউরিটি অডিট লগ",
    url: "/admin/audit-logs",
    icon: ShieldLock,
  },
];
