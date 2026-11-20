import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Art of Time | Insights & Editorial Journal | HOROLOGE ROYALE",
  description:
    "Stories, craftsmanship and the world of fine watchmaking. Explore curated editorial essays on mechanical movements, complications, and high horology.",
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

