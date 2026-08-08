import { BackgroundGlows } from "@/components/shared/background-glows";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundGlows />
      {children}
    </>
  );
}
