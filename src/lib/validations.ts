import { z } from "zod";

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.email({ message: "একটি বৈধ ইমেইল দিন।" }).trim().toLowerCase(),
  password: z.string().min(1, { message: "পাসওয়ার্ড দিন।" }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "নাম অন্তত ২ অক্ষরের হতে হবে।" }).trim(),
  email: z.email({ message: "একটি বৈধ ইমেইল দিন।" }).trim().toLowerCase(),
  password: z
    .string()
    .min(8, { message: "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।" })
    .regex(/[a-zA-Z]/, { message: "পাসওয়ার্ডে একটি অক্ষর থাকতে হবে।" })
    .regex(/[0-9]/, { message: "পাসওয়ার্ডে একটি সংখ্যা থাকতে হবে।" }),
});

export const MagicLinkSchema = z.object({
  email: z.email({ message: "একটি বৈধ ইমেইল দিন।" }).trim().toLowerCase(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "বর্তমান পাসওয়ার্ড দিন।" }),
    newPassword: z
      .string()
      .min(8, { message: "নতুন পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।" }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না।",
    path: ["confirmPassword"],
  });

export const SetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "নতুন পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।" }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না।",
    path: ["confirmPassword"],
  });

// ─── Profile Schema ───────────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, { message: "নাম অন্তত ২ অক্ষরের হতে হবে।" }).trim(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["unspecified", "male", "female", "other"]).optional(),
  bio: z
    .string()
    .max(300, { message: "বায়ো সর্বোচ্চ ৩০০ অক্ষরের হতে হবে।" })
    .optional(),
});

// ─── OAuth App Schema ─────────────────────────────────────────────────────────

export const CreateAppSchema = z.object({
  name: z
    .string()
    .min(2, { message: "অ্যাপের নাম অন্তত ২ অক্ষরের হতে হবে।" })
    .trim(),
  appType: z.enum(["web", "native", "service"]),
  redirectUri: z
    .url({ message: "একটি বৈধ রিডাইরেক্ট URI দিন।" })
    .optional()
    .or(z.literal("")),
});

export const AddRedirectUriSchema = z.object({
  clientId: z.string(),
  uri: z.url({ message: "একটি বৈধ URI দিন।" }),
});

// ─── OAuth Authorization Schema ───────────────────────────────────────────────

export const OAuthAuthorizeSchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.url(),
  response_type: z.literal("code"),
  scope: z.string().default("openid profile email"),
  state: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.enum(["S256", "plain"]).optional(),
});

export const OAuthTokenSchema = z.object({
  grant_type: z.enum(["authorization_code", "refresh_token"]),
  code: z.string().optional(),
  redirect_uri: z.string().optional(),
  client_id: z.string(),
  client_secret: z.string().optional(),
  code_verifier: z.string().optional(), // PKCE
  refresh_token: z.string().optional(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type MagicLinkInput = z.infer<typeof MagicLinkSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type SetPasswordInput = z.infer<typeof SetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type CreateAppInput = z.infer<typeof CreateAppSchema>;
export type AddRedirectUriInput = z.infer<typeof AddRedirectUriSchema>;
export type OAuthAuthorizeInput = z.infer<typeof OAuthAuthorizeSchema>;
export type OAuthTokenInput = z.infer<typeof OAuthTokenSchema>;
