import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { verifyMagicLinkAction } from "@/actions/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    redirect("/login?error=missing_token");
  }

  // verifyMagicLinkAction redirects to /dashboard on success
  // and throws a navigation error which Next.js will catch.
  const result = await verifyMagicLinkAction(token);

  if (!result.success) {
    // If it didn't throw a redirect, it failed.
    const url = new URL("/login", request.url);
    url.searchParams.set("error", result.error || "invalid_token");
    redirect(url.toString());
  }
}
