import "server-only";
import {
  and,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  like,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import type { AuditLog } from "@/db/schema";
import {
  accounts,
  auditLogs,
  invoices,
  oauthClients,
  personalApiKeys,
  sessions,
  subscriptions,
  users,
} from "@/db/schema";

// ─── Overview Stats ──────────────────────────────────────────────────────────

export async function getAdminOverviewStats() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsersRes,
      newUsers30dRes,
      bannedUsersRes,
      activeSubsRes,
      totalInvoicesRes,
      totalAppsRes,
      activeSessionsRes,
      auditEventsRes,
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db
        .select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(users).where(eq(users.isBanned, true)),
      db
        .select({ count: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, "active")),
      db
        .select({
          totalRevenue: sql<number>`coalesce(sum(${invoices.amount}), 0)`,
          count: count(),
        })
        .from(invoices)
        .where(eq(invoices.status, "paid")),
      db.select({ count: count() }).from(oauthClients),
      db
        .select({ count: count() })
        .from(sessions)
        .where(gt(sessions.expiresAt, new Date())),
      db.select({ count: count() }).from(auditLogs),
    ]);

    // Plan distribution
    const planCounts = await db
      .select({
        planId: subscriptions.planId,
        count: count(),
      })
      .from(subscriptions)
      .groupBy(subscriptions.planId);

    // Recent 10 audit logs
    const recentActivity = await db
      .select({
        id: auditLogs.id,
        eventType: auditLogs.eventType,
        ipAddress: auditLogs.ipAddress,
        details: auditLogs.details,
        createdAt: auditLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    return {
      totalUsers: totalUsersRes[0]?.count ?? 0,
      newUsers30d: newUsers30dRes[0]?.count ?? 0,
      bannedUsers: bannedUsersRes[0]?.count ?? 0,
      activeSubscriptions: activeSubsRes[0]?.count ?? 0,
      totalRevenue: totalInvoicesRes[0]?.totalRevenue ?? 0,
      paidInvoicesCount: totalInvoicesRes[0]?.count ?? 0,
      totalOAuthApps: totalAppsRes[0]?.count ?? 0,
      activeSessions: activeSessionsRes[0]?.count ?? 0,
      totalAuditLogs: auditEventsRes[0]?.count ?? 0,
      planDistribution: planCounts,
      recentActivity,
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch overview stats:", error);
    return {
      totalUsers: 0,
      newUsers30d: 0,
      bannedUsers: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
      paidInvoicesCount: 0,
      totalOAuthApps: 0,
      activeSessions: 0,
      totalAuditLogs: 0,
      planDistribution: [],
      recentActivity: [],
    };
  }
}

// ─── Users List with Filtering and Pagination ────────────────────────────────

export interface GetAdminUsersParams {
  search?: string;
  filter?: "all" | "admin" | "banned" | "unverified" | "verified";
  page?: number;
  limit?: number;
}

export async function getAdminUsers({
  search = "",
  filter = "all",
  page = 1,
  limit = 20,
}: GetAdminUsersParams) {
  try {
    const offset = (page - 1) * limit;

    const conditions = [];

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          like(users.name, term),
          like(users.email, term),
          like(users.phone, term),
        ),
      );
    }

    if (filter === "admin") {
      conditions.push(eq(users.isAdmin, true));
    } else if (filter === "banned") {
      conditions.push(eq(users.isBanned, true));
    } else if (filter === "unverified") {
      conditions.push(eq(users.emailVerified, false));
    } else if (filter === "verified") {
      conditions.push(eq(users.emailVerified, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [userRows, totalCountRes] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          emailVerified: users.emailVerified,
          avatarUrl: users.avatarUrl,
          phone: users.phone,
          isAdmin: users.isAdmin,
          isBanned: users.isBanned,
          twoFactorEnabled: users.twoFactorEnabled,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          subscription: {
            planId: subscriptions.planId,
            status: subscriptions.status,
          },
        })
        .from(users)
        .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(users).where(whereClause),
    ]);

    const total = totalCountRes[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      users: userRows,
      total,
      page,
      totalPages,
      limit,
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch users:", error);
    return { users: [], total: 0, page: 1, totalPages: 0, limit };
  }
}

// ─── Single User Full Details ────────────────────────────────────────────────

export async function getAdminUserDetail(userId: string) {
  try {
    const [
      user,
      userAccounts,
      userSessions,
      userSub,
      userInvoices,
      userApps,
      userKeys,
      userActivity,
    ] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, userId),
      }),
      db.select().from(accounts).where(eq(accounts.userId, userId)),
      db
        .select()
        .from(sessions)
        .where(
          and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())),
        )
        .orderBy(desc(sessions.createdAt)),
      db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
      }),
      db
        .select()
        .from(invoices)
        .where(eq(invoices.userId, userId))
        .orderBy(desc(invoices.createdAt))
        .limit(10),
      db.select().from(oauthClients).where(eq(oauthClients.ownerId, userId)),
      db
        .select()
        .from(personalApiKeys)
        .where(eq(personalApiKeys.userId, userId)),
      db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.userId, userId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(20),
    ]);

    if (!user) return null;

    return {
      user,
      accounts: userAccounts,
      sessions: userSessions,
      subscription: userSub,
      invoices: userInvoices,
      oauthClients: userApps,
      personalApiKeys: userKeys,
      recentActivity: userActivity,
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch user detail:", error);
    return null;
  }
}

// ─── Subscriptions List ──────────────────────────────────────────────────────

export async function getAdminSubscriptions({
  filter = "all",
  search = "",
  page = 1,
  limit = 20,
}: {
  filter?: "all" | "pending" | "active" | "canceled" | "rejected" | "past_due";
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filter !== "all") {
      conditions.push(eq(subscriptions.status, filter));
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          like(users.name, term),
          like(users.email, term),
          like(subscriptions.paymentMethod, term),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRes, pendingRes] = await Promise.all([
      db
        .select({
          subscription: subscriptions,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(subscriptions)
        .innerJoin(users, eq(subscriptions.userId, users.id))
        .where(whereClause)
        .orderBy(desc(subscriptions.updatedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(subscriptions)
        .innerJoin(users, eq(subscriptions.userId, users.id))
        .where(whereClause),
      db
        .select({ count: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, "pending")),
    ]);

    const userIds = rows.map((r) => r.user.id);
    const invoiceList =
      userIds.length > 0
        ? await db
            .select()
            .from(invoices)
            .where(inArray(invoices.userId, userIds))
            .orderBy(desc(invoices.createdAt))
        : [];

    const itemsWithInvoices = rows.map((r) => {
      const latestInv =
        invoiceList.find((inv) => inv.userId === r.user.id) || null;
      return {
        ...r,
        latestInvoice: latestInv,
      };
    });

    const total = totalRes[0]?.count ?? 0;
    const pendingCount = pendingRes[0]?.count ?? 0;

    return {
      items: itemsWithInvoices,
      total,
      pendingCount,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch subscriptions:", error);
    return { items: [], total: 0, pendingCount: 0, page: 1, totalPages: 0 };
  }
}

// ─── Invoices List ───────────────────────────────────────────────────────────

export async function getAdminInvoices({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const offset = (page - 1) * limit;

    const [rows, totalRes] = await Promise.all([
      db
        .select({
          invoice: invoices,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(invoices)
        .innerJoin(users, eq(invoices.userId, users.id))
        .orderBy(desc(invoices.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(invoices),
    ]);

    const total = totalRes[0]?.count ?? 0;
    return {
      items: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch invoices:", error);
    return { items: [], total: 0, page: 1, totalPages: 0 };
  }
}

// ─── OAuth Clients & API Keys ────────────────────────────────────────────────

export async function getAdminOAuthClients({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const offset = (page - 1) * limit;

    const [rows, totalRes] = await Promise.all([
      db
        .select({
          client: oauthClients,
          owner: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(oauthClients)
        .innerJoin(users, eq(oauthClients.ownerId, users.id))
        .orderBy(desc(oauthClients.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(oauthClients),
    ]);

    const total = totalRes[0]?.count ?? 0;
    return {
      items: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch OAuth clients:", error);
    return { items: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getAdminApiKeys({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const offset = (page - 1) * limit;

    const [rows, totalRes] = await Promise.all([
      db
        .select({
          key: personalApiKeys,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(personalApiKeys)
        .innerJoin(users, eq(personalApiKeys.userId, users.id))
        .orderBy(desc(personalApiKeys.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(personalApiKeys),
    ]);

    const total = totalRes[0]?.count ?? 0;
    return {
      items: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch API keys:", error);
    return { items: [], total: 0, page: 1, totalPages: 0 };
  }
}

// ─── System Audit Logs ───────────────────────────────────────────────────────

export async function getAdminAuditLogs({
  eventType = "",
  search = "",
  page = 1,
  limit = 30,
}: {
  eventType?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (eventType) {
      conditions.push(
        eq(auditLogs.eventType, eventType as AuditLog["eventType"]),
      );
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          like(auditLogs.ipAddress, term),
          like(auditLogs.details, term),
          like(users.email, term),
          like(users.name, term),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRes] = await Promise.all([
      db
        .select({
          log: auditLogs,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.userId, users.id))
        .where(whereClause)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.userId, users.id))
        .where(whereClause),
    ]);

    const total = totalRes[0]?.count ?? 0;
    return {
      items: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("[admin-queries] Failed to fetch audit logs:", error);
    return { items: [], total: 0, page: 1, totalPages: 0 };
  }
}
