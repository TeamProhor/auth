import { Icon } from "@iconify/react/dist/iconify.js";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db";
import { oauthClients } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { QuickstartCopyButton } from "./quickstart-copy-button";

const ISSUER_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://accounts.prohor.dev";

export default async function QuickstartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Fetch developer's most recently created app
  const apps = await db.query.oauthClients.findMany({
    where: eq(oauthClients.createdByUserId, user.id),
    orderBy: [desc(oauthClients.createdAt)],
    limit: 1,
  });

  const firstApp = apps[0];
  const clientId = firstApp?.clientId ?? "pr_client_your_id_here";
  const hasApp = !!firstApp;

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          কুইকস্টার্ট ও SDK
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার পছন্দের ফ্রেমওয়ার্ক নির্বাচন করুন এবং ৫ মিনিটের মধ্যে প্রহর অথ যুক্ত করুন।
        </p>
      </div>

      {!hasApp && (
        <Card className="p-5 border-amber-500/30 bg-amber-500/5 flex items-start gap-4">
          <Icon
            icon="solar:danger-triangle-bold"
            width="20"
            height="20"
            className="text-amber-500 mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-bold text-foreground">
              প্রথমে একটি অ্যাপ তৈরি করুন
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client ID এবং Secret পেতে{" "}
              <Link href="/developer/apps" className="text-primary underline">
                অ্যাপস পেজে
              </Link>{" "}
              একটি OAuth ক্লায়েন্ট নিবন্ধন করুন।
            </p>
          </div>
        </Card>
      )}

      {hasApp && (
        <div className="rounded-xl border border-border bg-card/50 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {firstApp.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {firstApp.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {clientId}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            render={<Link href="/developer/apps" />}
            nativeButton={false}
            className="rounded-xl text-xs px-4 py-2"
          >
            অ্যাপ ম্যানেজ
          </Button>
        </div>
      )}

      <Tabs defaultValue="nextjs" className="w-full space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="w-full sm:w-auto h-11 p-1 bg-muted/60 rounded-xl gap-1 justify-start">
            <TabsTrigger
              value="nextjs"
              className="gap-2 px-4 py-2 text-sm font-semibold cursor-pointer"
            >
              <Icon icon="logos:nextjs-icon" width="18" height="18" /> Next.js
              (App Router)
            </TabsTrigger>
            <TabsTrigger
              value="react"
              className="gap-2 px-4 py-2 text-sm font-semibold cursor-pointer"
            >
              <Icon icon="logos:react" width="18" height="18" /> React SPA
            </TabsTrigger>
            <TabsTrigger
              value="node"
              className="gap-2 px-4 py-2 text-sm font-semibold cursor-pointer"
            >
              <Icon icon="logos:nodejs-icon" width="18" height="18" /> Node.js
            </TabsTrigger>
            <TabsTrigger
              value="python"
              className="gap-2 px-4 py-2 text-sm font-semibold cursor-pointer"
            >
              <Icon icon="logos:python" width="18" height="18" /> Python
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ─── Next.js ─── */}
        <TabsContent value="nextjs" className="space-y-6">
          <Step num="১" title="SDK ইন্সটল করুন">
            <CopyInput value="npm install @prohor/nextjs" />
          </Step>

          <Step num="২" title="এনভায়রনমেন্ট ভেরিয়েবল সেট করুন">
            <Card className="p-4 font-mono text-sm flex flex-col gap-2 shadow-sm text-muted-foreground">
              <p>
                <span className="text-blue-400">PROHOR_CLIENT_ID</span>
                {`="`}
                <span className="text-emerald-400">{clientId}</span>
                {`"`}
              </p>
              <p>
                <span className="text-blue-400">PROHOR_CLIENT_SECRET</span>
                {`="`}
                <span className="text-amber-400">
                  {"••••••••••• (Apps পেজ থেকে কপি করুন)"}
                </span>
                {`"`}
              </p>
              <p>
                <span className="text-blue-400">PROHOR_ISSUER_URL</span>
                {`="`}
                <span className="text-muted-foreground">{ISSUER_URL}</span>
                {`"`}
              </p>
            </Card>
          </Step>

          <Step num="৩" title="প্রক্সি (Middleware) যোগ করুন">
            <CodeBlock>{`import { withProhorAuth } from '@prohor/nextjs/proxy';

export default withProhorAuth({
  clientId: process.env.PROHOR_CLIENT_ID,
  issuerUrl: process.env.PROHOR_ISSUER_URL,
  publicRoutes: ['/', '/about'],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`}</CodeBlock>
          </Step>

          <Step num="৪" title="ব্যবহারকারীর তথ্য পড়ুন">
            <CodeBlock>{`import { getSession } from '@prohor/nextjs';

export default async function Page() {
  const session = await getSession();
  if (!session) return <div>লগইন করুন</div>;

  return <div>স্বাগতম, {session.user.name}!</div>;
}`}</CodeBlock>
          </Step>

          <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-start gap-3 text-sm">
            <Icon
              icon="solar:info-circle-bold"
              width="18"
              height="18"
              className="text-primary mt-0.5 shrink-0"
            />
            <p className="text-muted-foreground">
              Redirect URI হিসেবে{" "}
              <code className="bg-background px-1.5 py-0.5 rounded text-xs text-foreground">
                http://localhost:3000/api/auth/callback
              </code>{" "}
              আপনার অ্যাপে যুক্ত করুন।
            </p>
          </div>
        </TabsContent>

        {/* ─── React SPA ─── */}
        <TabsContent value="react" className="space-y-6">
          <Step num="১" title="React Provider ইন্সটল করুন">
            <CopyInput value="npm install @prohor/react" />
          </Step>
          <Step num="২" title="Provider যুক্ত করুন">
            <CodeBlock>{`import { ProhorProvider } from '@prohor/react';

export default function App() {
  return (
    <ProhorProvider
      clientId="${clientId}"
      issuerUrl="${ISSUER_URL}"
    >
      <YourApp />
    </ProhorProvider>
  );
}`}</CodeBlock>
          </Step>
          <Step num="৩" title="Login Button ব্যবহার করুন">
            <CodeBlock>{`import { useProhorAuth } from '@prohor/react';

export function LoginButton() {
  const { login, logout, user } = useProhorAuth();
  if (user) return <button onClick={logout}>লগআউট ({user.name})</button>;
  return <button onClick={login}>লগইন করুন</button>;
}`}</CodeBlock>
          </Step>
        </TabsContent>

        {/* ─── Node.js ─── */}
        <TabsContent value="node" className="space-y-6">
          <Step num="১" title="Express Middleware ইন্সটল করুন">
            <CopyInput value="npm install @prohor/node express" />
          </Step>
          <Step num="২" title="JWT Verification Middleware">
            <CodeBlock>{`import { verifyProhorToken } from '@prohor/node';

const auth = verifyProhorToken({
  issuerUrl: '${ISSUER_URL}',
  audience: '${clientId}',
});

app.get('/api/protected', auth, (req, res) => {
  res.json({ user: req.prohorUser });
});`}</CodeBlock>
          </Step>
        </TabsContent>

        {/* ─── Python ─── */}
        <TabsContent value="python" className="space-y-6">
          <Step num="১" title="Python SDK ইন্সটল করুন">
            <CopyInput value="pip install prohor-py" />
          </Step>
          <Step num="২" title="FastAPI Dependency">
            <CodeBlock>{`from prohor import verify_token, ProhorUser
from fastapi import Depends

async def get_current_user(token: str = Depends(oauth2_scheme)):
    return await verify_token(
        token,
        issuer="${ISSUER_URL}",
        audience="${clientId}",
    )

@app.get("/protected")
async def protected(user: ProhorUser = Depends(get_current_user)):
    return {"name": user.name}`}</CodeBlock>
          </Step>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Step({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
        <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">
          {num}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function CopyInput({ value }: { value: string }) {
  return (
    <InputGroup>
      <InputGroupInput
        readOnly
        defaultValue={value}
        className="font-mono text-sm"
      />
      <InputGroupAddon align="inline-end">
        <QuickstartCopyButton value={value} />
      </InputGroupAddon>
    </InputGroup>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-2xl font-mono text-sm shadow-xl overflow-x-auto text-[#d4d4d4]">
      <pre>{children}</pre>
    </div>
  );
}
