import React from "react";
import Link from "next/link";

interface BannerLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function BannerLink({
  href,
  children,
  className = "",
  style,
}: BannerLinkProps) {
  const cleanHref = href?.trim();
  if (!cleanHref) {
    return <>{children}</>;
  }

  if (cleanHref.startsWith("http://") || cleanHref.startsWith("https://")) {
    return (
      <a
        href={cleanHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={cleanHref} className={className} style={style}>
      {children}
    </Link>
  );
}

