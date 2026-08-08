import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function AppsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            অ্যাপস ও ওয়েবহুক
          </h2>
          <p className="text-muted-foreground text-sm">
            OAuth 2.1 অ্যাপ্লিকেশন নিবন্ধন এবং কনফিগার করুন।
          </p>
        </div>
        <Button className="rounded-xl px-5 py-6 text-sm font-semibold cursor-pointer shrink-0">
          <Icon
            icon="solar:add-square-bold-duotone"
            width="20"
            height="20"
            className="mr-2"
          />
          নতুন অ্যাপ
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden shadow-sm p-0">
          <CardHeader className="p-5 flex flex-col md:flex-row md:items-center gap-5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-sm">
                V
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">
                  Vawzine App
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="mt-0.5 text-emerald-500 bg-emerald-500/10"
                >
                  ● সক্রিয়
                </Badge>
              </div>
            </div>
            <div className="md:ml-auto flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                className="rounded-xl px-4 py-5 text-sm font-medium"
              >
                ওয়েবহুক কনফিগার
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  ক্লায়েন্ট আইডি (Client ID)
                </span>
                <InputGroup className="mt-2">
                  <InputGroupInput
                    readOnly
                    defaultValue="pr_client_1a2b3c4d5e6f"
                    className="font-mono text-sm"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Icon
                        icon="solar:copy-bold-duotone"
                        width="18"
                        height="18"
                      />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  ক্লায়েন্ট সিক্রেট (Client Secret)
                </span>
                <InputGroup className="mt-2">
                  <InputGroupInput
                    readOnly
                    defaultValue="••••••••••••••••••••••••••••••••"
                    className="font-mono text-sm"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Icon
                        icon="solar:eye-bold-duotone"
                        width="18"
                        height="18"
                      />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <span className="text-sm font-semibold text-foreground block">
                অনুমোদিত রিডাইরেক্ট ইউআরআই (Allowed Redirect URIs)
              </span>
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg">
                  <span className="text-sm font-mono text-muted-foreground">
                    https://vawzine.com/api/auth/callback
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-destructive"
                  >
                    <Icon
                      icon="solar:trash-bin-trash-bold-duotone"
                      width="16"
                      height="16"
                    />
                  </Button>
                </div>
              </div>
              <Button
                variant="link"
                className="mt-2 text-xs font-semibold text-primary p-0 h-auto"
              >
                + ইউআরআই যোগ করুন
              </Button>
            </div>
          </CardContent>

          <CardFooter className="p-5 border-t border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Icon
                  icon="solar:palette-bold-duotone"
                  width="20"
                  height="20"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  কনসেন্ট স্ক্রিন কাস্টমাইজেশন
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  লোগো, ব্র্যান্ড কালার এবং মেসেজ সেট করে ইউজার এক্সপেরিয়েন্স উন্নত করুন।
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm shrink-0"
            >
              এডিট করুন
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
