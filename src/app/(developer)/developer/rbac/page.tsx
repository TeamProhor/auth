import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        <Dialog>
          <DialogTrigger
            render={
              <Button className="rounded-xl px-5 py-6 text-sm font-semibold cursor-pointer shrink-0">
                <Icon
                  icon="solar:add-circle-bold"
                  width="20"
                  height="20"
                  className="mr-2"
                />
                নতুন রোল
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>নতুন কাস্টম রোল তৈরি করুন</DialogTitle>
              <DialogDescription>
                সিস্টেম অ্যাক্সেস নিয়ন্ত্রণের জন্য রোল এবং পারমিশন স্কোপ নির্দিষ্ট করুন।
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-2">
              <Field>
                <FieldLabel htmlFor="role-name">রোলের নাম</FieldLabel>
                <Input id="role-name" placeholder="যেমন: Moderator" />
              </Field>
              <Field>
                <FieldLabel htmlFor="role-desc">বিবরণ</FieldLabel>
                <Textarea
                  id="role-desc"
                  placeholder="রোলের দায়িত্ব সম্পর্কে লিখুন..."
                  rows={2}
                />
              </Field>
              <FieldSet>
                <FieldLegend>পারমিশন স্কোপ সমূহ</FieldLegend>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label
                    htmlFor="scope-users-read"
                    className="flex items-center gap-2 text-sm text-foreground font-medium cursor-pointer"
                  >
                    <Checkbox id="scope-users-read" defaultChecked /> users:read
                  </label>
                  <label
                    htmlFor="scope-users-write"
                    className="flex items-center gap-2 text-sm text-foreground font-medium cursor-pointer"
                  >
                    <Checkbox id="scope-users-write" defaultChecked />{" "}
                    users:write
                  </label>
                  <label
                    htmlFor="scope-billing-manage"
                    className="flex items-center gap-2 text-sm text-foreground font-medium cursor-pointer"
                  >
                    <Checkbox id="scope-billing-manage" /> billing:manage
                  </label>
                  <label
                    htmlFor="scope-settings-all"
                    className="flex items-center gap-2 text-sm text-foreground font-medium cursor-pointer"
                  >
                    <Checkbox id="scope-settings-all" /> settings:all
                  </label>
                </div>
              </FieldSet>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                বাতিল
              </DialogClose>
              <Button>সংরক্ষণ করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
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
