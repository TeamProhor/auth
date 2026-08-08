import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <div className="max-w-[1200px] space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          এপিআই ডকুমেন্টেশন
        </h2>
        <p className="text-muted-foreground text-sm">
          OAuth 2.1 এবং OIDC ব্যবহার করে আপনার অ্যাপ্লিকেশনে প্রহর অথ যুক্ত করুন।
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start pb-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              ১. অথরাইজেশন কোড ফ্লো
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ব্যবহারকারীকে প্রহর অথরাইজেশন এন্ডপয়েন্টে রিডাইরেক্ট করার মাধ্যমে লগইন প্রক্রিয়া
              শুরু করুন। নিরাপত্তার জন্য আপনাকে অবশ্যই একটি PKCE{" "}
              <code className="text-foreground font-mono">code_challenge</code>{" "}
              অন্তর্ভুক্ত করতে হবে।
            </p>
            <Card className="p-4 text-sm">
              <p className="font-semibold text-foreground mb-2">
                এন্ডপয়েন্ট (Endpoint)
              </p>
              <Badge
                variant="secondary"
                className="font-mono text-primary bg-primary/10"
              >
                GET /oauth/authorize
              </Badge>
            </Card>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-xl font-bold text-foreground">
              ২. টোকেন এক্সচেঞ্জ
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ব্যবহারকারী আপনার অ্যাপ অনুমোদন করলে, তারা একটি{" "}
              <code className="text-foreground font-mono">code</code> সহ ফিরে
              আসবে। এই কোডটি ব্যবহার করে একটি Access Token এবং ID Token গ্রহণ করুন।
            </p>
            <Card className="p-4 text-sm">
              <p className="font-semibold text-foreground mb-2">
                এন্ডপয়েন্ট (Endpoint)
              </p>
              <Badge
                variant="secondary"
                className="font-mono text-primary bg-primary/10"
              >
                POST /oauth/token
              </Badge>
            </Card>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl overflow-hidden shadow-2xl sticky top-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222] bg-[#111]">
            <div className="size-3 rounded-full bg-[#ff5f56]"></div>
            <div className="size-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="size-3 rounded-full bg-[#27c93f]"></div>
            <span className="text-xs text-[#888] font-mono ml-2">
              curl - token exchange
            </span>
          </div>
          <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-[#d4d4d4]">
            <pre>{`curl --request POST \\
  --url https://auth.prohor.app/oauth/token \\
  --header 'Content-Type: application/json' \\
  --data '{
  "grant_type": "authorization_code",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_SECRET",
  "code": "AUTH_CODE_RECEIVED",
  "code_verifier": "PKCE_VERIFIER_STRING"
}'`}</pre>
          </div>
          <div className="border-t border-[#222] bg-[#111] px-4 py-2 text-xs font-mono text-[#888]">
            রেসপন্স (Response)
          </div>
          <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-[#050505] text-[#86efac]">
            <pre>{`{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJhbGciOi..."
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
