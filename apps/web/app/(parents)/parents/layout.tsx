import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Parents | Shiksha",
    default: "Parent Dashboard | Shiksha",
  },
  description: "Track your ward's medical admission application",
};

export default function ParentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
