import type { ComponentType } from "react";
import {
  Bell,
  Box,
  Calendar,
  DirectInbox,
  FolderFiles,
  Home,
  LockKeyhole,
  Note,
  ShieldCheck,
  User,
  Users,
  Video,
} from "@/components/icons";

export interface NavItem {
  title: string;
  url: string;
  icon: ComponentType<{
    size?: number | string;
    className?: string;
    weight?: "Outline" | "Filled";
    color?: string;
  }>;
}

export const PERSONAL_NAV_ITEMS: NavItem[] = [
  {
    title: "সার্ভিস ও ওভারভিউ",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "প্রোফাইল ও তথ্য",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "নিরাপত্তা ও সেশন",
    url: "/dashboard/security",
    icon: ShieldCheck,
  },
  {
    title: "ডেটা ও গোপনীয়তা",
    url: "/dashboard/privacy",
    icon: LockKeyhole,
  },
  {
    title: "পেমেন্ট ও ফ্যামিলি",
    url: "/dashboard/billing",
    icon: Users,
  },
  {
    title: "ওঅথ ও এপিআই কী",
    url: "/dashboard/oauth-keys",
    icon: Box,
  },
  {
    title: "সেটিংস ও নোটিফিকেশন",
    url: "/dashboard/settings",
    icon: Bell,
  },
];

export interface ServiceItem {
  title: string;
  desc: string;
  icon: ComponentType<{
    size?: number | string;
    className?: string;
    weight?: "Outline" | "Filled";
    color?: string;
  }>;
  color: string;
  href: string;
}

export const PROHOR_SERVICES: ServiceItem[] = [
  {
    title: "Prohor Mail",
    desc: "ইমেইল ও বার্তা",
    icon: DirectInbox,
    color:
      "text-rose-500 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/20",
    href: "#",
  },
  {
    title: "Prohor Drive",
    desc: "ফাইল স্টোরেজ",
    icon: FolderFiles,
    color: "text-sky-500 bg-sky-500/10 dark:text-sky-400 dark:bg-sky-500/20",
    href: "#",
  },
  {
    title: "Prohor Notes",
    desc: "নোটস ও ডকুমেন্ট",
    icon: Note,
    color:
      "text-amber-500 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/20",
    href: "#",
  },
  {
    title: "Calendar",
    desc: "শিডিউল ও মিটিং",
    icon: Calendar,
    color:
      "text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20",
    href: "#",
  },
  {
    title: "Prohor Meet",
    desc: "ভিডিও কনফারেন্স",
    icon: Video,
    color:
      "text-violet-500 bg-violet-500/10 dark:text-violet-400 dark:bg-violet-500/20",
    href: "#",
  },
];

export const STORAGE_BREAKDOWN = [
  {
    title: "Prohor Drive",
    used: "৫.০ জিবি",
    color: "bg-sky-500",
  },
  {
    title: "Prohor Mail",
    used: "২.০ জিবি",
    color: "bg-rose-500",
  },
  {
    title: "Photos & Backup",
    used: "১.৫ জিবি",
    color: "bg-amber-500",
  },
];
