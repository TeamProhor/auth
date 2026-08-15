import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { OAuthKeysManager } from "@/components/dashboard/oauth-keys-manager";
import { Code } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { oauthClients, personalApiKeys } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";

export default async function OAuthKeysPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [myApps, myKeys] = await Promise.all([
    db.select().from(oauthClients).where(eq(oauthClients.ownerId, user.id)),
    db
      .select()
      .from(personalApiKeys)
      .where(eq(personalApiKeys.userId, user.id)),
  ]);

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* ─── Header ─── */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          ওঅথ ও এপিআই কী
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার তৈরি করা থার্ড-পার্টি ওঅথ অ্যাপ্লিকেশন এবং প্রহর এপিআই অ্যাক্সেস কী পরিচালনা
          করুন।
        </p>
      </div>

      {/* ─── Interactive Apps and API Keys Manager ─── */}
      <OAuthKeysManager initialApps={myApps} initialKeys={myKeys} />

      {/* ─── Endpoints & Integration Documentation ─── */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Code size={20} className="text-primary" /> ওআইডিসি (OIDC) কনফিগারেশন
          তথ্য
        </h3>
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>পরিষেবা (Service)</TableHead>
                <TableHead>এন্ডপয়েন্ট URL</TableHead>
                <TableHead className="text-right">ধরন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold text-sm text-foreground">
                  OpenID Configuration
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  /.well-known/openid-configuration
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    GET
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-sm text-foreground">
                  Authorization Endpoint
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  /api/oauth/authorize
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    GET / POST
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-sm text-foreground">
                  Token Endpoint
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  /api/oauth/token
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    POST
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-sm text-foreground">
                  UserInfo Endpoint
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  /api/oauth/userinfo
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    GET
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-sm text-foreground">
                  JWKS Key Set
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  /api/jwks.json
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    GET
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
