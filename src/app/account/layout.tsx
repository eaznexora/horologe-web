import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | HOROLOGE ROYALE",
  description: "View and manage your personal profile, orders, and security settings.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
