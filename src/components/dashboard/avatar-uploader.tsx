"use client";

import { Icon } from "@iconify/react";
import { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { uploadAndCompressAvatarAction } from "@/lib/upload";

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  userName: string;
}

export function AvatarUploader({
  currentAvatarUrl,
  userName,
}: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    currentAvatarUrl ?? null,
  );
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const res = await uploadAndCompressAvatarAction(formData);
      if (res.success && res.avatarUrl) {
        setAvatarUrl(res.avatarUrl);
      } else {
        setErrorMsg(res.error || "আপলোড ব্যর্থ হয়েছে।");
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-label="প্রোফাইল ছবি পরিবর্তন করুন"
        onClick={() => !isPending && fileInputRef.current?.click()}
        className="relative group cursor-pointer shrink-0 size-24 rounded-full overflow-hidden border-0 p-0 text-left outline-none"
      >
        <Avatar className="size-24 border border-border">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
          <AvatarFallback className="bg-muted text-muted-foreground font-bold text-2xl">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {isPending ? (
          <div className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center gap-1 text-white text-xs font-semibold">
            <Spinner className="size-5 text-white" />
            <span>প্রসেস হচ্ছে...</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon
              icon="solar:camera-bold"
              width="28"
              height="28"
              className="text-white"
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </button>

      {errorMsg && (
        <p className="text-xs text-destructive font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
