import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function RbacPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            রোল ও পারমিশন (RBAC)
          </h2>
          <p className="text-muted-foreground text-sm">
            ব্যবহারকারীদের জন্য কাস্টম রোল তৈরি করুন (যেমন: Admin, Editor) যা JWT টোকেনে
            যুক্ত হবে।
          </p>
        </div>
        <Button className="rounded-xl px-5 py-6 text-sm font-semibold cursor-pointer shrink-0">
          <Icon
            icon="solar:add-circle-bold-duotone"
            width="20"
            height="20"
            className="mr-2"
          />
          নতুন রোল
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">Admin</CardTitle>
              <CardDescription className="text-sm mt-1">
                সিস্টেমের পূর্ণ নিয়ন্ত্রণ
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-500/10 text-blue-500 font-bold"
            >
              ১২ ইউজার
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">users:write</Badge>
            <Badge variant="outline">billing:manage</Badge>
            <Badge variant="outline">settings:all</Badge>
          </div>
          <div className="flex gap-2 mt-2 pt-4 border-t border-border">
            <Button
              variant="link"
              className="text-xs font-semibold text-primary p-0 h-auto"
            >
              এডিট রোল
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">Editor</CardTitle>
              <CardDescription className="text-sm mt-1">
                কন্টেন্ট তৈরি ও সম্পাদনা
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-500 font-bold"
            >
              ৪৫ ইউজার
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">content:write</Badge>
            <Badge variant="outline">content:read</Badge>
          </div>
          <div className="flex gap-2 mt-2 pt-4 border-t border-border">
            <Button
              variant="link"
              className="text-xs font-semibold text-primary p-0 h-auto"
            >
              এডিট রোল
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-muted"></div>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Viewer{" "}
                <Badge variant="secondary" className="text-[10px]">
                  ডিফল্ট
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                শুধুমাত্র দেখার অনুমতি
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-bold">
              ১,১৪৭ ইউজার
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">content:read</Badge>
          </div>
          <div className="flex gap-2 mt-2 pt-4 border-t border-border">
            <Button
              variant="link"
              className="text-xs font-semibold text-primary p-0 h-auto"
            >
              এডিট রোল
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
