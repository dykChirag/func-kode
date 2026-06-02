import Link from "next/link";
import { HeroEditorMockup } from "@/components/landing/hero-editor-mockup";

export function HeroSection() {
  return (
    <section className="w-full pb-16 lg:pb-24 lg:pt-[180px]">
      {/* Figma @1440: copy x=122 w=459; mockup x=572 w=822 h=590 */}
      <div className="relative flex flex-col items-center gap-10 px-5 pt-10 sm:px-8 min-[1440px]:min-h-[590px] min-[1440px]:items-stretch min-[1440px]:px-0 min-[1440px]:pt-0">
        <div className="relative z-10 mx-auto w-full max-w-[459px] text-center min-[1440px]:absolute min-[1440px]:left-[122px] min-[1440px]:top-0 min-[1440px]:mx-0 min-[1440px]:text-left">
          <p className="mb-[18px] text-sm font-bold uppercase tracking-[-0.48px] text-[#EDFFD7] sm:text-base">
            Trust commits, not cover letters
          </p>

          <h1 className="mx-auto mb-3.5 max-w-[396px] text-[32px] font-bold leading-[1.18] tracking-[-1.38px] text-white sm:text-[40px] sm:leading-[48px] min-[1440px]:mx-0 min-[1440px]:text-[46px] min-[1440px]:leading-[54.1px]">
            Build together.
            <br />
            Ship Faster.
            <br />
            Contribute with purpose.
          </h1>

          <p className="mx-auto mb-[11px] max-w-[456px] text-base leading-[25.4px] tracking-[-0.48px] text-white min-[1440px]:mx-0">
            func(kode) is an open-source developer platform for the Patch ID community.
            Sign up with GitHub, join collaborative builds, and contribute to projects that
            matter.
          </p>

          <div className="mt-[11px] flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center min-[1440px]:items-start min-[1440px]:justify-start min-[1440px]:gap-[47px]">
            <Link
              href="/auth/login"
              className="inline-flex h-[50px] min-w-[156px] items-center justify-center rounded-full bg-white px-6 text-[15px] font-bold tracking-[-0.45px] text-black transition-transform hover:-translate-y-0.5"
            >
              Start Contributing
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-[50px] min-w-[160px] items-center justify-center rounded-full border-2 border-white/[0.13] bg-transparent px-6 text-[15px] font-bold tracking-[-0.45px] text-white transition-colors hover:bg-white/10"
            >
              Explore the project
            </Link>
          </div>
        </div>

        <div className="relative z-0 mx-auto w-full max-w-[822px] min-[1440px]:absolute min-[1440px]:left-[572px] min-[1440px]:top-0 min-[1440px]:mx-0 min-[1440px]:w-[822px]">
          <HeroEditorMockup />
        </div>
      </div>
    </section>
  );
}
