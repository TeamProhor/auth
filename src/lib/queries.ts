import "server-only";
import { and, count, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  accessTokens,
  auditLogs,
  oauthClients,
  sessions,
  userConsents,
  users,
} from "@/db/schema";

// ─── Dashboard: current user stats ───────────────────────────────────────────

export async function getDashboardStats(userId: string) {
  try {
    const [sessionCount, consentCount, auditCount] = await Promise.all([
      db
        .select({ count: count() })
        .from(sessions)
        .where(
          and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())),
        ),
      db
        .select({ count: count() })
        .from(userConsents)
        .where(eq(userConsents.userId, userId)),
      db
        .select({ count: count() })
        .from(auditLogs)
        .where(eq(auditLogs.userId, userId)),
    ]);
    return {
      activeSessions: sessionCount[0]?.count ?? 0,
      connectedApps: consentCount[0]?.count ?? 0,
      auditEvents: auditCount[0]?.count ?? 0,
    };
  } catch {
    return { activeSessions: 0, connectedApps: 0, auditEvents: 0 };
  }
}

export async function getRecentActivity(userId: string, limit = 5) {
  try {
    return db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getConnectedApps(userId: string) {
  try {
    return db
      .select({ consent: userConsents, client: oauthClients })
      .from(userConsents)
      .innerJoin(oauthClients, eq(userConsents.clientId, oauthClients.clientId))
      .where(eq(userConsents.userId, userId));
  } catch {
    return [];
  }
}

// ─── Developer: aggregate stats ───────────────────────────────────────────────

export async function getDeveloperStats(userId: string) {
  try {
    const myApps = await db
      .select({ clientId: oauthClients.clientId })
      .from(oauthClients)
      .where(eq(oauthClients.ownerId, userId));
    if (myApps.length === 0)
      return { totalApps: 0, totalUsers: 0, totalTokens: 0, activeTokens: 0 };

    const clientIds = myApps.map((a) => a.clientId);
    const [userCount, tokenCount, activeTokenCount] = await Promise.all([
      db
        .select({ count: count() })
        .from(userConsents)
        .where(inArray(userConsents.clientId, clientIds)),
      db
        .select({ count: count() })
        .from(accessTokens)
        .where(inArray(accessTokens.clientId, clientIds)),
      db
        .select({ count: count() })
        .from(accessTokens)
        .where(
          and(
            inArray(accessTokens.clientId, clientIds),
            gt(accessTokens.expiresAt, new Date()),
            eq(accessTokens.isRevoked, false),
          ),
        ),
    ]);

    return {
      totalApps: myApps.length,
      totalUsers: userCount[0]?.count ?? 0,
      totalTokens: tokenCount[0]?.count ?? 0,
      activeTokens: activeTokenCount[0]?.count ?? 0,
    };
  } catch {
    return { totalApps: 0, totalUsers: 0, totalTokens: 0, activeTokens: 0 };
  }
}

// ─── Developer: users who have consented to developer's apps ──────────────────

export async function getDeveloperUsers(
  developerUserId: string,
  limit = 50,
  offset = 0,
) {
  try {
    const myApps = await db
      .select({ clientId: oauthClients.clientId, name: oauthClients.name })
      .from(oauthClients)
      .where(eq(oauthClients.ownerId, developerUserId));
    if (myApps.length === 0) return { users: [], total: 0, apps: [] };

    const clientIds = myApps.map((a) => a.clientId);
    const [consents, totalRow] = await Promise.all([
      db
        .select({ user: users, consent: userConsents })
        .from(userConsents)
        .innerJoin(users, eq(userConsents.userId, users.id))
        .where(inArray(userConsents.clientId, clientIds))
        .orderBy(desc(userConsents.updatedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(userConsents)
        .where(inArray(userConsents.clientId, clientIds)),
    ]);

    return { users: consents, total: totalRow[0]?.count ?? 0, apps: myApps };
  } catch {
    return { users: [], total: 0, apps: [] };
  }
}

// ─── Developer: API usage (last 7 days per day) ───────────────────────────────

export async function getDeveloperDailyUsage(developerUserId: string) {
  try {
    const myApps = await db
      .select({ clientId: oauthClients.clientId })
      .from(oauthClients)
      .where(eq(oauthClients.ownerId, developerUserId));
    if (myApps.length === 0) return [];

    const clientIds = myApps.map((a) => a.clientId);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return db
      .select({
        day: sql<string>`date_trunc('day', ${accessTokens.createdAt})::date`,
        count: count(),
      })
      .from(accessTokens)
      .where(
        and(
          inArray(accessTokens.clientId, clientIds),
          gt(accessTokens.createdAt, sevenDaysAgo),
        ),
      )
      .groupBy(sql`date_trunc('day', ${accessTokens.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${accessTokens.createdAt})::date`);
  } catch {
    return [];
  }
}
