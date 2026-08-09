import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ConsentCard } from "@/components/landing/consent-card";
import { db } from "@/db";
import { oauthClients } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";

interface ConsentPageProps {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    scope?: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
  }>;
}

export default async function ConsentPage({ searchParams }: ConsentPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    redirect("/login?return_to=/oauth/consent");
  }

  const {
    client_id,
    redirect_uri,
    scope,
    state,
    code_challenge,
    code_challenge_method,
  } = params;

  if (!client_id || !redirect_uri) {
    redirect("/login?error=invalid_request");
  }

  const client = await db.query.oauthClients.findFirst({
    where: and(
      eq(oauthClients.clientId, client_id),
      eq(oauthClients.isActive, true),
    ),
  });

  if (!client?.redirectUris.includes(redirect_uri)) {
    redirect("/login?error=invalid_client");
  }

  const requestedScopes = (scope ?? "openid profile email").split(" ");

  return (
    <main className="w-full flex min-h-dvh items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md rounded-[24px] bg-card/80 backdrop-blur-xl border border-border p-6 md:p-8 shadow-2xl">
        <ConsentCard
          client={{
            name: client.name,
            logoUrl: client.logoUrl,
            clientId: client.clientId,
          }}
          user={{ name: user.name, email: user.email }}
          requestedScopes={requestedScopes}
          redirectUri={redirect_uri}
          state={state}
          codeChallenge={code_challenge}
          codeChallengeMethod={code_challenge_method}
        />
      </div>
    </main>
  );
}
