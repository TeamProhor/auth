import { Icon } from "@iconify/react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function ServicesGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {[
        {
          title: "Prohor Mail",
          desc: "২টি নতুন ইমেইল",
          icon: "solar:inbox-bold-duotone",
          color: "text-chart-1 bg-chart-1/10",
        },
        {
          title: "Prohor Drive",
          desc: "৩২০টি ফাইল",
          icon: "solar:folder-with-files-bold-duotone",
          color: "text-chart-2 bg-chart-2/10",
        },
        {
          title: "Prohor Notes",
          desc: "১৪টি নোট",
          icon: "solar:notes-bold-duotone",
          color: "text-chart-3 bg-chart-3/10",
        },
        {
          title: "Calendar",
          desc: "আজ ১টি মিটিং",
          icon: "solar:calendar-date-bold-duotone",
          color: "text-chart-4 bg-chart-4/10",
        },
        {
          title: "Prohor Meet",
          desc: "ভিডিও কল শুরু করুন",
          icon: "solar:videocamera-record-bold-duotone",
          color: "text-chart-5 bg-chart-5/10",
        },
      ].map((item) => (
        <Link key={item.title} href="#">
          <Card className="p-5 hover:border-primary/50 hover:shadow-md transition-[border-color,box-shadow] group flex flex-col items-center text-center gap-3">
            <div
              className={`size-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}
            >
              <Icon icon={item.icon} width="32" height="32" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.desc}
              </p>
            </div>
          </Card>
        </Link>
      ))}

      <Link href="#">
        <Card className="p-5 hover:border-primary/50 hover:shadow-md transition-[border-color,box-shadow] group flex flex-col items-center text-center gap-3 bg-muted/50">
          <div className="size-14 rounded-2xl bg-background border border-border text-muted-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon icon="solar:widget-add-bold-duotone" width="32" height="32" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">আরও এক্সপ্লোর</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              নতুন সার্ভিস দেখুন
            </p>
          </div>
        </Card>
      </Link>
    </div>
  );
}
