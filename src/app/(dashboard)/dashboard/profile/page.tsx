import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          ব্যক্তিগত তথ্য
        </h2>
        <p className="text-muted-foreground text-sm">
          প্রহর পরিষেবাগুলোতে আপনার প্রাথমিক পরিচিতি এবং প্রোফাইল পরিচালনা করুন।
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-6 border-b border-border pb-6">
          <div className="relative group cursor-pointer shrink-0">
            <Avatar className="size-24 border border-border">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <Icon icon="solar:user-bold" width="48" height="48" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon
                icon="solar:camera-bold"
                width="28"
                height="28"
                className="text-white"
              />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">প্রোফাইল ছবি</CardTitle>
            <CardDescription className="text-xs">
              আপনার ছবি অন্যান্য প্রহর পরিষেবাতে দৃশ্যমান হবে। (সর্বোচ্চ ২ মেগাবাইট)
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <FieldGroup>
            <div className="grid gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="fullname">পুরো নাম</FieldLabel>
                <Input id="fullname" defaultValue="ব্যবহারকারীর নাম" />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">ইমেইল ঠিকানা (প্রাথমিক)</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  defaultValue="user@example.com"
                  disabled
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">ফোন নম্বর</FieldLabel>
                <Input id="phone" type="tel" placeholder="+880 1..." />
              </Field>
              <Field>
                <FieldLabel htmlFor="dob">জন্ম তারিখ</FieldLabel>
                <Input id="dob" type="date" />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="gender">লিঙ্গ (Gender)</FieldLabel>
              <Select defaultValue="unspecified">
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="unspecified">নির্বাচন করুন</SelectItem>
                    <SelectItem value="male">পুরুষ</SelectItem>
                    <SelectItem value="female">মহিলা</SelectItem>
                    <SelectItem value="other">অন্যান্য</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="about">সম্পর্কে (About)</FieldLabel>
              <Textarea
                id="about"
                rows={3}
                placeholder="আপনার সম্পর্কে কিছু লিখুন..."
              />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex justify-end border-t border-border pt-4">
          <Button className="rounded-xl px-6 py-6 text-sm font-semibold cursor-pointer">
            সেভ করুন
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
