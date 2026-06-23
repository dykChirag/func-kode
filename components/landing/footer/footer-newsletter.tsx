"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { LANDING_ASSETS } from "@/lib/landing-assets";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      return;
    }

    track(ANALYTICS_EVENTS.FOOTER_NEWSLETTER_SUBMITTED, {
      email_domain: trimmed.split("@")[1] ?? "unknown",
    });
    setEmail("");
  }

  return (
    <div className="flex w-full flex-col items-start gap-6 min-[1440px]:w-auto">
      <div className="inline-flex items-center gap-3">
        <Image
          src={LANDING_ASSETS.logo}
          alt="Patch ID logo"
          width={57}
          height={51}
          className="h-[51px] w-[57px] object-contain"
        />
        <span className="text-base font-extrabold leading-[17.28px] text-white">
          PATCH ID
        </span>
      </div>

      <p className="w-full text-sm font-light leading-5 tracking-[0.28px] text-white/60">
        Get latest updates
      </p>

      <form onSubmit={handleSubmit} className="w-full" aria-label="Newsletter signup">
        <label className="sr-only" htmlFor="footer-newsletter-email">
          Your email
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email"
          className="
            h-11 w-full rounded-[24px] border-[1.62px] border-landing-card-border
            bg-[#0F0F0F] px-[13px] text-[13px] font-normal leading-[16px]
            tracking-[0.26px] text-white outline-none
            placeholder:text-white/80
            focus-visible:ring-2 focus-visible:ring-white/20
            min-[1440px]:max-w-[260px]
          "
        />
      </form>
    </div>
  );
}
