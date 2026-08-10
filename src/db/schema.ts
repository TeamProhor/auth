import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  dob: text("dob"), // ISO date string
  gender: text("gender"),
  bio: text("bio"),
  totpSecret: text("totp_secret"),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" })
    .notNull()
    .default(false),
  isDeveloper: integer("is_developer", { mode: "boolean" })
    .notNull()
    .default(false),
  isBanned: integer("is_banned", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Authentication Accounts ──────────────────────────────────────────────────

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider", {
      enum: ["email", "google", "github"],
    }).notNull(),
    // NULL for email provider, required for OAuth providers
    providerAccountId: text("provider_account_id"),
    passwordHash: text("password_hash"), // Only for email provider
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [
    uniqueIndex("accounts_provider_account_idx").on(
      t.provider,
      t.providerAccountId,
    ),
  ],
);

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(), // Opaque random token stored in DB
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── OAuth Link Requests (CSRF-safe account linking state) ──────────────────

export const oauthLinkRequests = sqliteTable("oauth_link_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider", { enum: ["google", "github"] }).notNull(),
  // SHA-256 hash of the random state token
  stateHash: text("state_hash").notNull().unique(),
  usedAt: integer("used_at", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Magic Link Tokens ────────────────────────────────────────────────────────

export const magicLinkTokens = sqliteTable("magic_link_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── OAuth Clients (Developer Apps) ──────────────────────────────────────────

export const oauthClients = sqliteTable("oauth_clients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id").notNull().unique(),
  clientSecretHash: text("client_secret_hash").notNull(),
  name: text("name").notNull(),
  appType: text("app_type", { enum: ["web", "native", "service"] })
    .notNull()
    .default("web"),
  redirectUris: text("redirect_uris", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  logoUrl: text("logo_url"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdByUserId: text("created_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Authorization Codes ──────────────────────────────────────────────────────

export const authorizationCodes = sqliteTable("authorization_codes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  clientId: text("client_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  redirectUri: text("redirect_uri").notNull(),
  scope: text("scope").notNull().default("openid profile email"),
  codeChallenge: text("code_challenge"), // PKCE S256 challenge
  codeChallengeMethod: text("code_challenge_method"), // S256
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Access Tokens ────────────────────────────────────────────────────────────

export const accessTokens = sqliteTable("access_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tokenHash: text("token_hash").notNull().unique(),
  clientId: text("client_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  scope: text("scope").notNull(),
  isRevoked: integer("is_revoked", { mode: "boolean" })
    .notNull()
    .default(false),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Refresh Tokens ───────────────────────────────────────────────────────────

export const refreshTokens = sqliteTable("refresh_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tokenHash: text("token_hash").notNull().unique(),
  clientId: text("client_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  scope: text("scope").notNull(),
  isRevoked: integer("is_revoked", { mode: "boolean" })
    .notNull()
    .default(false),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── User Consents ────────────────────────────────────────────────────────────

export const userConsents = sqliteTable("user_consents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id").notNull(),
  grantedScopes: text("granted_scopes").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  eventType: text("event_type", {
    enum: [
      "login",
      "logout",
      "register",
      "password_change",
      "magic_link_sent",
      "app_approved",
      "app_revoked",
      "session_revoked",
      "all_sessions_revoked",
      "profile_updated",
      "user_banned",
      "user_unbanned",
      "oauth_account_linked",
      "oauth_account_unlinked",
      "oauth_link_failed",
    ],
  }).notNull(),
  ipAddress: text("ip_address"),
  details: text("details"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  oauthClients: many(oauthClients),
  userConsents: many(userConsents),
  auditLogs: many(auditLogs),
  oauthLinkRequests: many(oauthLinkRequests),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const oauthLinkRequestsRelations = relations(
  oauthLinkRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [oauthLinkRequests.userId],
      references: [users.id],
    }),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const oauthClientsRelations = relations(oauthClients, ({ one }) => ({
  creator: one(users, {
    fields: [oauthClients.createdByUserId],
    references: [users.id],
  }),
}));

export const userConsentsRelations = relations(userConsents, ({ one }) => ({
  user: one(users, { fields: [userConsents.userId], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  planId: text("plan_id").notNull().default("prohor-free"), // prohor-free, prohor-pro, prohor-plus, prohor-elite
  status: text("status").notNull().default("active"), // active, canceled, past_due
  paymentMethod: text("payment_method").default("N/A"), // bKash, Nagad, Mastercard ••• 4242
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Invoices (Payment Receipts) ──────────────────────────────────────────────

export const invoices = sqliteTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // amount in BDT (e.g. 299, 599, 999)
  planName: text("plan_name").notNull(), // Prohor Pro, Prohor Plus, Prohor Elite
  paymentMethod: text("payment_method").notNull(), // bKash, Nagad, Card
  status: text("status").notNull().default("paid"), // paid, failed
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
}));

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type OAuthClient = typeof oauthClients.$inferSelect;
export type NewOAuthClient = typeof oauthClients.$inferInsert;
export type AuthorizationCode = typeof authorizationCodes.$inferSelect;
export type AccessToken = typeof accessTokens.$inferSelect;
export type UserConsent = typeof userConsents.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type OAuthLinkRequest = typeof oauthLinkRequests.$inferSelect;
