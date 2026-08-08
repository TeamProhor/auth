import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  API_DOCS_ENDPOINTS,
  CURL_TOKEN_EXCHANGE_CODE,
  CURL_TOKEN_EXCHANGE_RESPONSE,
} from "@/lib/constants/docs";

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
          {API_DOCS_ENDPOINTS.map((item, idx) => (
            <div
              key={item.step}
              className={
                idx > 0 ? "space-y-4 pt-4 border-t border-border" : "space-y-4"
              }
            >
              <h3 className="text-xl font-bold text-foreground">{item.step}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              <Card className="p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">
                  এন্ডপয়েন্ট (Endpoint)
                </p>
                <Badge
                  variant="secondary"
                  className="font-mono text-primary bg-primary/10"
                >
                  {item.endpoint}
                </Badge>
              </Card>
            </div>
          ))}
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
            <pre>{CURL_TOKEN_EXCHANGE_CODE}</pre>
          </div>
          <div className="border-t border-[#222] bg-[#111] px-4 py-2 text-xs font-mono text-[#888]">
            রেসপন্স (Response)
          </div>
          <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-[#050505] text-[#86efac]">
            <pre>{CURL_TOKEN_EXCHANGE_RESPONSE}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
