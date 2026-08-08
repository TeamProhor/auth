import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              (Express)
            </TabsTrigger>
            <TabsTrigger
              value="python"
              className="gap-2 px-4 py-2 text-sm font-semibold cursor-pointer"
            >
              <Icon icon="logos:python" width="18" height="18" /> Python
              (FastAPI)
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="nextjs" className="space-y-6">
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
                  <Icon icon="solar:copy-bold" width="18" height="18" />
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
        </TabsContent>

        <TabsContent value="react" className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                ১
              </span>{" "}
              React Provider সেটআপ করুন
            </h3>
            <InputGroup>
              <InputGroupInput
                readOnly
                defaultValue="npm install @prohor/react"
                className="font-mono text-sm"
              />
              <InputGroupAddon align="inline-end">
                <Button variant="ghost" size="icon" className="size-8">
                  <Icon icon="solar:copy-bold" width="18" height="18" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </TabsContent>

        <TabsContent value="node" className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                ১
              </span>{" "}
              Express Auth Middleware
            </h3>
            <InputGroup>
              <InputGroupInput
                readOnly
                defaultValue="npm install @prohor/node"
                className="font-mono text-sm"
              />
              <InputGroupAddon align="inline-end">
                <Button variant="ghost" size="icon" className="size-8">
                  <Icon icon="solar:copy-bold" width="18" height="18" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </TabsContent>

        <TabsContent value="python" className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                ১
              </span>{" "}
              Python SDK
            </h3>
            <InputGroup>
              <InputGroupInput
                readOnly
                defaultValue="pip install prohor-py"
                className="font-mono text-sm"
              />
              <InputGroupAddon align="inline-end">
                <Button variant="ghost" size="icon" className="size-8">
                  <Icon icon="solar:copy-bold" width="18" height="18" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
