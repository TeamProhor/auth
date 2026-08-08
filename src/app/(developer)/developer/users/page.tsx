import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            ইউজার ডিরেক্টরি
          </h2>
          <p className="text-muted-foreground text-sm">
            আপনার অ্যাপ্লিকেশনে সাইন আপ করা ব্যবহারকারীদের পরিচালনা করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InputGroup className="w-64">
            <InputGroupAddon align="inline-start">
              <Icon
                icon="solar:magnifer-linear"
                width="18"
                height="18"
                className="text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupInput placeholder="ইমেইল বা নাম খুঁজুন..." />
          </InputGroup>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ইউজার (User)</TableHead>
              <TableHead>সাইন আপ (Joined)</TableHead>
              <TableHead>শেষ লগইন (Last Login)</TableHead>
              <TableHead>স্ট্যাটাস (Status)</TableHead>
              <TableHead className="text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-blue-500/10 text-blue-500 font-bold text-xs">
                      H
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      Hasan Mahmud
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      hasan@example.com
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                ১২ মে, ২০২৪
              </TableCell>
              <TableCell className="text-muted-foreground">
                ২ মিনিট আগে
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-500 font-bold"
                >
                  অ্যাক্টিভ
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="size-8">
                  <Icon
                    icon="solar:menu-dots-bold-duotone"
                    width="18"
                    height="18"
                  />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-amber-500/10 text-amber-500 font-bold text-xs">
                      F
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      Farjana Akter
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      farjana@example.com
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                ০১ জুন, ২০২৪
              </TableCell>
              <TableCell className="text-muted-foreground">৩ দিন আগে</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-500 font-bold"
                >
                  অ্যাক্টিভ
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="size-8">
                  <Icon
                    icon="solar:menu-dots-bold-duotone"
                    width="18"
                    height="18"
                  />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="opacity-60">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <Icon
                        icon="solar:user-bold-duotone"
                        width="14"
                        height="14"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground line-through">
                      Spammer Account
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      spam@tempmail.com
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">আজ</TableCell>
              <TableCell className="text-muted-foreground">-</TableCell>
              <TableCell>
                <Badge variant="destructive" className="font-bold">
                  ব্যানড (Banned)
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="size-8">
                  <Icon
                    icon="solar:menu-dots-bold-duotone"
                    width="18"
                    height="18"
                  />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/20">
          <span>মোট ১,২০৪ জন ব্যবহারকারী</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              আগের
            </Button>
            <Button variant="outline" size="sm">
              পরের
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
