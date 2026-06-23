"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import type { FooterLinkItem } from "@/components/landing/footer/footer-links";

type FooterLinkProps = {
  link: FooterLinkItem;
  column: string;
  className?: string;
};

const LINK_CLASS =
  "inline-flex min-h-[44px] items-center text-base font-medium leading-5 tracking-[0.32px] text-white/60 transition-colors hover:text-white";

function trackFooterClick(link: FooterLinkItem, column: string) {
  track(ANALYTICS_EVENTS.FOOTER_LINK_CLICKED, {
    link_label: link.label,
    link_href: link.href,
    column,
  });
}

export function FooterLink({ link, column, className }: FooterLinkProps) {
  const classes = [
    LINK_CLASS,
    link.variant === "poppins" ? "font-normal" : "font-archivo",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={() => trackFooterClick(link, column)}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      className={classes}
      onClick={() => trackFooterClick(link, column)}
    >
      {link.label}
    </Link>
  );
}

type FooterAttributionLinkProps = {
  label: string;
  href: string;
  external?: boolean;
} & Pick<ComponentProps<"a">, "className">;

export function FooterAttributionLink({
  label,
  href,
  external,
  className,
}: FooterAttributionLinkProps) {
  const classes = [
    "text-base font-normal leading-5 tracking-[0.32px] text-white/60 transition-colors hover:text-white",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={() =>
          track(ANALYTICS_EVENTS.FOOTER_LINK_CLICKED, {
            link_label: label,
            link_href: href,
            column: "attribution",
          })
        }
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      onClick={() =>
        track(ANALYTICS_EVENTS.FOOTER_LINK_CLICKED, {
          link_label: label,
          link_href: href,
          column: "attribution",
        })
      }
    >
      {label}
    </Link>
  );
}
