import { redirect } from "next/navigation";
import { revokeAppAccessAction } from "@/actions/oauth";
import { CloudDownload } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/lib/auth/session";
import { getConnectedApps } from "@/lib/queries";

export default async function PrivacyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const connectedApps = await getConnectedApps(user.id);

  return (
    <div className="max-w-5xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          ডেটা ও গোপনীয়তা
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার ডেটা পরিচালনা করুন এবং থার্ড-পার্টি অ্যাপ অ্যাক্সেস নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-border pb-6">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <CloudDownload size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">
              আপনার ডেটা ডাউনলোড করুন (Takeout)
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              প্রহর প্ল্যাটফর্মে থাকা আপনার সমস্ত তথ্যের (মেইল, ড্রাইভ, ছবি) একটি কপি জিপ
              ফাইল হিসেবে তৈরি করুন।
            </p>
          </div>
          <Button className="rounded-xl px-5 py-6 text-sm font-semibold shrink-0 cursor-pointer">
            আর্কাইভ তৈরি করুন
          </Button>
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-bold text-foreground mb-4">
            থার্ড-পার্টি অ্যাপ অ্যাক্সেস ({connectedApps.length}টি সংযুক্ত)
          </h3>
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>অ্যাপ্লিকেশনের নাম</TableHead>
                  <TableHead>অনুমতি ও অ্যাক্সেস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedApps.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-8"
                    >
                      কোনো থার্ড-পার্টি অ্যাপের অ্যাক্সেস দেওয়া নেই।
                    </TableCell>
                  </TableRow>
                ) : (
                  connectedApps.map(({ consent, client }) => (
                    <TableRow key={consent.id}>
                      <TableCell className="font-bold flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-accent font-bold text-foreground text-xs">
                            {client.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{client.name}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {consent.scopes?.join(", ") ?? "বেসিক প্রোফাইল"}
                      </TableCell>
                      <TableCell className="text-right">
                        <form
                          action={revokeAppAccessAction.bind(
                            null,
                            client.clientId,
                          )}
                        >
                          <SubmitButton
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            অ্যাক্সেস বাতিল
                          </SubmitButton>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </Card>

      <div className="space-y-4 pt-6 border-t border-destructive/20 mt-10">
        <h3 className="text-xl font-bold text-destructive">বিপজ্জনক জোন</h3>
        <Card className="border-destructive/30 bg-destructive/5 p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
          <div>
            <p className="text-base font-bold text-foreground">
              অ্যাকাউন্ট মুছে ফেলুন
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              আপনার সমস্ত ডেটা (মেইল, ছবি, ড্রাইভ) স্থায়ীভাবে মুছে ফেলা হবে।
            </p>
          </div>
          <Button
            variant="destructive"
            className="rounded-xl px-6 py-6 text-sm font-semibold shrink-0 cursor-pointer"
          >
            ডিলিট অ্যাকাউন্ট
          </Button>
        </Card>
      </div>
    </div>
  );
}
