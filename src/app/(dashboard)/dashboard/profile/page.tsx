import { redirect } from "next/navigation";
import { updateProfileAction } from "@/actions/user";
import { AvatarUploader } from "@/components/dashboard/avatar-uploader";
import { SubmitButton } from "@/components/submit-button";
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
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

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

      <form
        key={user.updatedAt?.toString()}
        action={updateProfileAction.bind(null, null)}
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-6 border-b border-border pb-6">
            <AvatarUploader
              currentAvatarUrl={user.avatarUrl}
              userName={user.name}
            />
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">প্রোফাইল ছবি</CardTitle>
              <CardDescription className="text-xs">
                ক্লিক করে ছবি আপলোড করুন। Sharp দিয়ে স্বয়ংক্রিয়ভাবে WebP ফরম্যাটে
                কম্প্রেস হবে।
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">পুরো নাম</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user.name}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">ইমেইল ঠিকানা (প্রাথমিক)</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">ফোন নম্বর</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={user.phone ?? ""}
                    placeholder="+880 1..."
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="dob">জন্ম তারিখ</FieldLabel>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    defaultValue={user.dob ?? ""}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="gender">লিঙ্গ (Gender)</FieldLabel>
                <Select
                  name="gender"
                  defaultValue={user.gender ?? "unspecified"}
                >
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
                <FieldLabel htmlFor="bio">সম্পর্কে (About)</FieldLabel>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  defaultValue={user.bio ?? ""}
                  placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                />
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex justify-end border-t border-border pt-4">
            <SubmitButton className="rounded-xl px-6 py-6 text-sm font-semibold cursor-pointer">
              সেভ করুন
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
