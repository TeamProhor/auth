import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import type { User } from "@/db/schema";
import { sessions, users } from "@/db/schema";

const SESSION_COOKIE = "prohor_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function generateToken(): string {
  return randomBytes(48).toString("hex");
}

function getExpiresAt(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

// ─── Create Session ───────────────────────────────────────────────────────────

export async function createSession(
  userId: string,
  request?: { ip?: string; userAgent?: string; location?: string },
): Promise<void> {
  const token = generateToken();
  const expiresAt = getExpiresAt();
  const cookieStore = await cookies();
  const oldToken = cookieStore.get(SESSION_COOKIE)?.value;

  // 1. Delete expired sessions for this user
  await db
    .delete(sessions)
    .where(
      and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())),
    );

  // 2. If this browser already had a previous session token, clean it up
  if (oldToken) {
    await db.delete(sessions).where(eq(sessions.token, oldToken));
  }

  // 3. Remove existing sessions from the same device / browser (same userAgent) to prevent ghost duplicates
  if (request?.userAgent) {
    await db
      .delete(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.userAgent, request.userAgent),
        ),
      );
  }

  // 4. Insert new active session
  await db.insert(sessions).values({
    userId,
    token,
    ipAddress: request?.ip,
    userAgent: request?.userAgent,
    location: request?.location,
    expiresAt,
  });

  const isHttps =
    process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false;

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && isHttps,
    sameSite: "lax",
    expires: expiresAt,
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
    path: "/",
  });
}

// ─── Get Current Session & User ───────────────────────────────────────────────

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const result = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!result[0]) return null;

  const user = result[0].user;
  if (user.isBanned) return null;

  return user;
}

export async function getCurrentSession(): Promise<
  typeof sessions.$inferSelect | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const result = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return result[0] ?? null;
}

// ─── Delete Session (Logout) ──────────────────────────────────────────────────

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
    cookieStore.delete(SESSION_COOKIE);
  }
}

// ─── Revoke a Specific Session by ID ─────────────────────────────────────────

export async function revokeSession(
  sessionId: string,
  userId: string,
): Promise<void> {
  await db
    .delete(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
}

// ─── Revoke All Sessions for a User ──────────────────────────────────────────

export async function revokeAllSessions(
  userId: string,
  exceptToken?: string,
): Promise<void> {
  const cookieStore = await cookies();
  const currentToken = exceptToken ?? cookieStore.get(SESSION_COOKIE)?.value;

  // Delete all other sessions
  if (currentToken) {
    const allSessions = await db
      .select({ id: sessions.id, token: sessions.token })
      .from(sessions)
      .where(eq(sessions.userId, userId));

    const toRevokeIds: string[] = [];
    for (const s of allSessions) {
      if (s.token !== currentToken) toRevokeIds.push(s.id);
    }
    if (toRevokeIds.length > 0) {
      const { inArray } = await import("drizzle-orm");
      await db.delete(sessions).where(inArray(sessions.id, toRevokeIds));
    }
  } else {
    await db.delete(sessions).where(eq(sessions.userId, userId));
    cookieStore.delete(SESSION_COOKIE);
  }
}

// ─── Get All Active Sessions for a User ──────────────────────────────────────

export async function getUserSessions(userId: string) {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(SESSION_COOKIE)?.value;

  const allSessions = await db
    .select()
    .from(sessions)
    .where(
      and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())),
    );

  return allSessions.map((session) => ({
    ...session,
    isCurrent: session.token === currentToken,
  }));
}

// ─── Admin Check & Guard ─────────────────────────────────────────────────────

export async function getAdminUser(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isWhitelisted = adminEmails.includes(user.email.toLowerCase());

  if (user.isAdmin || isWhitelisted) {
    return user;
  }

  return null;
}
