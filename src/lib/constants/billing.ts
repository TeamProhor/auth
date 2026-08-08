export interface Plan {
  id: string;
  name: string;
  nameBn: string;
  price: number; // in BDT
  priceFormatted: string;
  period: string;
  description: string;
  storage: string;
  badge?: string;
  color: string;
  features: string[];
}

export const PLANS: Record<string, Plan> = {
  "prohor-free": {
    id: "prohor-free",
    name: "Prohor Free",
    nameBn: "প্রহর ফ্রি",
    price: 0,
    priceFormatted: "৳০",
    period: "মাস",
    description: "প্রাথমিক ব্যবহারকারীদের জন্য সাধারণ সুবিধা।",
    storage: "১৫ জিবি",
    color: "border-border bg-card",
    features: [
      "১৫ জিবি ক্লাউড স্টোরেজ",
      "১টি সেশন ডিভাইস",
      "বেসিক অথেন্টিকেশন",
      "কমিউনিটি সাপোর্ট",
    ],
  },
  "prohor-pro": {
    id: "prohor-pro",
    name: "Prohor Pro",
    nameBn: "প্রহর প্রো",
    price: 299,
    priceFormatted: "৳২৯৯",
    period: "মাস",
    description: "ব্যক্তিগত এবং ফ্যামিলি ব্যবহারের জন্য সর্বাধিক জনপ্রিয় প্ল্যান।",
    storage: "২ টিবি",
    badge: "জনপ্রিয়",
    color: "border-primary bg-primary/5 text-primary",
    features: [
      "২ টিবি ক্লাউড স্টোরেজ",
      "ফ্যামিলি শেয়ারিং (সর্বোচ্চ ৫ জন)",
      "আনলিমিটেড ডিভাইস সেশন",
      "৫টি ওঅথ (OAuth) অ্যাপস কানেকশন",
      "২৪/৭ প্রায়োরিটি সাপোর্ট",
    ],
  },
  "prohor-plus": {
    id: "prohor-plus",
    name: "Prohor Plus",
    nameBn: "প্রহর প্লাস",
    price: 599,
    priceFormatted: "৳৫৯৯",
    period: "মাস",
    description: "এডভান্সড ব্যবহারকারী এবং প্রফেশনাল টিমগুলোর জন্য।",
    storage: "৫ টিবি",
    badge: "উন্নত",
    color: "border-sky-500 bg-sky-500/5 text-sky-500",
    features: [
      "৫ টিবি হাই-স্পিড ক্লাউড স্টোরেজ",
      "২০টি ওঅথ (OAuth) ডেভেলপার অ্যাপস",
      "অ্যাডভান্সড বট প্রোটেকশন ও রেট লিমিটিং",
      "কাস্টম সিকিউরিটি পলিসি",
      "ভিআইপি টেকনিক্যাল সাপোর্ট",
    ],
  },
  "prohor-elite": {
    id: "prohor-elite",
    name: "Prohor Elite",
    nameBn: "প্রহর এলিট",
    price: 999,
    priceFormatted: "৳৯৯৯",
    period: "মাস",
    description: "বৃহৎ প্রতিষ্ঠান এবং এন্টারপ্রাইজ লেভেল সার্ভিসের জন্য।",
    storage: "আনলিমিটেড",
    badge: "এন্টারপ্রাইজ",
    color: "border-purple-500 bg-purple-500/5 text-purple-500",
    features: [
      "আনলিমিটেড ক্লাউড স্টোরেজ",
      "কাস্টম ডোমেইন ডিরেক্টরি কানেকশন",
      "আনলিমিটেড ওঅথ (OAuth) অ্যাপস ও ওয়েবহুক",
      "ডেডিকেটেড একাউন্ট ম্যানেজার",
      "৯৯.৯৯% এসএলএ (SLA) গ্যারান্টি",
    ],
  },
};
