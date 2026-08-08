import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function QuickstartPage() {
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

      <div className="flex overflow-x-auto gap-4 pb-2 border-b border-border">
        <Button
          variant="secondary"
          className="font-bold flex items-center gap-2 shrink-0"
        >
          <Icon icon="logos:nextjs-icon" width="20" height="20" /> Next.js (App
          Router)
        </Button>
        <Button
          variant="ghost"
          className="font-semibold text-muted-foreground flex items-center gap-2 shrink-0"
        >
          <Icon icon="logos:react" width="20" height="20" /> React SPA
        </Button>
        <Button
          variant="ghost"
          className="font-semibold text-muted-foreground flex items-center gap-2 shrink-0"
        >
          <Icon icon="logos:nodejs-icon" width="20" height="20" /> Node.js
          (Express)
        </Button>
        <Button
          variant="ghost"
          className="font-semibold text-muted-foreground flex items-center gap-2 shrink-0"
        >
          <Icon icon="logos:python" width="20" height="20" /> Python
          (Django/FastAPI)
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
            <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              ১
            </span>{" "}
            SDK ইন্সটল করুন
          </h3>
          <InputGroup>
            <InputGroupInput
              readOnly
              defaultValue="npm install @prohor/nextjs"
              className="font-mono text-sm"
            />
            <InputGroupAddon align="inline-end">
              <Button variant="ghost" size="icon" className="size-8">
                <Icon icon="solar:copy-bold-duotone" width="18" height="18" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
            <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              ২
            </span>{" "}
            এনভায়রনমেন্ট ভেরিয়েবল সেট করুন
          </h3>
          <Card className="p-4 font-mono text-sm flex flex-col gap-2 shadow-sm text-muted-foreground">
            <p>
              <span className="text-blue-400">PROHOR_CLIENT_ID</span>
              ="pr_client_1a2b3c4d5e6f"
            </p>
            <p>
              <span className="text-blue-400">PROHOR_CLIENT_SECRET</span>
              ="pr_sec_9x8y7z6w5v4u3t2s1r0q"
            </p>
            <p>
              <span className="text-blue-400">PROHOR_ISSUER_URL</span>
              ="https://auth.prohor.app"
            </p>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
            <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              ৩
            </span>{" "}
            অ্যাপ রাউটারে মিডলওয়্যার যোগ করুন
          </h3>
          <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-2xl font-mono text-sm shadow-xl overflow-x-auto text-[#d4d4d4]">
            <pre>{`import { withProhorAuth } from '@prohor/nextjs/middleware';

export default withProhorAuth({
  publicRoutes: ['/', '/about'],
  ignoredRoutes: ['/api/webhook']
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
