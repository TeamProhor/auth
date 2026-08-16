import Link from "next/link";
import type * as React from "react";
import { ChevronRight } from "@/components/icons";
import { cn } from "@/lib/utils";

export type QuickListVariant = "grid" | "list";
export type QuickListColumns = 1 | 2 | 3 | 4;

export interface QuickListProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: QuickListVariant;
  columns?: QuickListColumns;
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
  containerClassName?: string;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
}

export type ColorPreset =
  | "blue"
  | "purple"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "primary"
  | "muted";

const COLOR_MAP: Record<
  ColorPreset,
  { glow: string; iconBg: string; iconText: string; hoverBg: string }
> = {
  blue: {
    glow: "bg-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-950/50",
    iconText: "text-blue-600 dark:text-blue-400",
    hoverBg: "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50",
  },
  purple: {
    glow: "bg-purple-500",
    iconBg: "bg-purple-50 dark:bg-purple-950/50",
    iconText: "text-purple-600 dark:text-purple-400",
    hoverBg: "group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50",
  },
  emerald: {
    glow: "bg-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconText: "text-emerald-600 dark:text-emerald-400",
    hoverBg: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50",
  },
  amber: {
    glow: "bg-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-950/50",
    iconText: "text-amber-600 dark:text-amber-400",
    hoverBg: "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50",
  },
  rose: {
    glow: "bg-rose-500",
    iconBg: "bg-rose-50 dark:bg-rose-950/50",
    iconText: "text-rose-600 dark:text-rose-400",
    hoverBg: "group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50",
  },
  cyan: {
    glow: "bg-cyan-500",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/50",
    iconText: "text-cyan-600 dark:text-cyan-400",
    hoverBg: "group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50",
  },
  primary: {
    glow: "bg-primary",
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    hoverBg: "group-hover:bg-primary/20",
  },
  muted: {
    glow: "bg-muted-foreground/30",
    iconBg: "bg-muted",
    iconText: "text-foreground",
    hoverBg: "group-hover:bg-muted/80",
  },
};

export interface QuickListItemProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  color?: ColorPreset;
  glowColor?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  href?: string;
  target?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function QuickListItem({
  title,
  description,
  icon,
  badge,
  color = "muted",
  glowColor,
  iconBgColor,
  iconTextColor,
  href,
  target,
  onClick,
  disabled,
  action,
  className,
}: QuickListItemProps) {
  const colorPreset = COLOR_MAP[color] || COLOR_MAP.muted;
  const activeGlow = glowColor || colorPreset.glow;
  const activeIconBg = iconBgColor || colorPreset.iconBg;
  const activeIconText = iconTextColor || colorPreset.iconText;

  const content = (
    <>
      {/* Background Hover Accent Glow */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-500 pointer-events-none",
          activeGlow,
        )}
      />

      {/* Icon */}
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center size-9 sm:size-11 rounded-xl transition-all duration-300 shrink-0 shadow-xs",
            activeIconBg,
            activeIconText,
            colorPreset.hoverBg,
          )}
        >
          {icon}
        </div>
      )}

      {/* Text Content */}
      <div className="flex flex-col items-start flex-1 min-w-0 justify-center gap-0.5">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors leading-tight truncate">
            {title}
          </div>
          {badge && <div className="shrink-0 flex items-center">{badge}</div>}
        </div>
        {description && (
          <div className="text-muted-foreground text-[11px] sm:text-xs font-normal leading-normal truncate w-full">
            {description}
          </div>
        )}
      </div>

      {/* Right Side Action / Caret */}
      <div className="ml-auto shrink-0 flex items-center gap-1.5 sm:gap-2 justify-end text-muted-foreground/60 group-hover:text-primary transition-colors">
        {action !== undefined ? (
          action
        ) : (
          <ChevronRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
          />
        )}
      </div>
    </>
  );

  const sharedClasses = cn(
    "relative flex flex-row items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl gap-3 sm:gap-4 bg-card border border-border/80 shadow-xs transition-all duration-300 w-full text-left group overflow-hidden hover:border-primary/40 hover:shadow-md",
    disabled && "opacity-60 pointer-events-none",
    className,
  );

  if (href && !disabled) {
    const isExternal =
      href.startsWith("http://") || href.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={href}
          target={target || "_blank"}
          rel="noopener noreferrer"
          className={sharedClasses}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={sharedClasses}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(sharedClasses, "cursor-pointer")}
      >
        {content}
      </button>
    );
  }

  return <div className={sharedClasses}>{content}</div>;
}

export function QuickListSkeleton({
  count = 3,
  variant = "grid",
  columns = 3,
}: {
  count?: number;
  variant?: QuickListVariant;
  columns?: QuickListColumns;
}) {
  const gridColClass =
    variant === "list" || columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 4
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("grid gap-2.5 sm:gap-4", gridColClass)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
          key={`quicklist-skeleton-${i}`}
          className="rounded-xl sm:rounded-2xl bg-muted/60 animate-pulse h-16 sm:h-20 border border-border/40"
        />
      ))}
    </div>
  );
}

export function QuickList({
  title,
  description,
  icon,
  variant = "grid",
  columns = 3,
  loading = false,
  skeletonCount = 3,
  className,
  containerClassName,
  headerAction,
  children,
}: QuickListProps) {
  const gridColClass =
    variant === "list" || columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 4
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {/* Header */}
      {(title || description || icon || headerAction) && (
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            {title && (
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
                {icon && <span className="text-primary">{icon}</span>}
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Content or Skeleton */}
      {loading ? (
        <QuickListSkeleton
          count={skeletonCount}
          variant={variant}
          columns={columns}
        />
      ) : (
        <div
          className={cn(
            "w-full grid gap-2.5 sm:gap-3",
            gridColClass,
            containerClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
