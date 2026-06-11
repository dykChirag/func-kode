"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type StepData = {
  label: string;
  title: string;
  body: ReactNode;
};

const STEPS: StepData[] = [
  {
    label: "Step 1",
    title: "Connect GitHub",
    body: (
      <>
        Connect your GitHub account with func(kode) in one click. Patch ID reads your public
        contribution activity – PRs, reviews, merges – without touching your private code.
      </>
    ),
  },
  {
    label: "Step 2",
    title: "We analyze your signals",
    body: (
      <>
        <p className="mb-0 whitespace-pre-line">
          We look at the signals that actually matter:{"\n"}
          PR merge rate{"\n"}
          Code survival over time{"\n"}
          Peer review participation{"\n"}
          Recent activity and responsiveness{"\n"}
          Each signal is normalized, weighted, and versioned in our scoring engine.
        </p>
      </>
    ),
  },
  {
    label: "Step 3",
    title: "Get a 0–100 trust score",
    body: (
      <>
        <p className="mb-0 whitespace-pre-line">
          You get:{"\n"}
          A 0–100 trust score{"\n"}
          A clear breakdown by signal{"\n"}
          A Raccoon AI explanation: what you&apos;re strong at, what&apos;s holding you back,
          and what to do next.
        </p>
      </>
    ),
  },
];

/** ProductLandingPage stepper — #495AFF indicators, 20px circles, vertical ladder lines. */
function StepIndicator({
  index,
  visibleCount,
}: {
  index: number;
  visibleCount: number;
}) {
  const isComplete = index < visibleCount - 1;
  const isActive = index === visibleCount - 1 && visibleCount > 0;

  if (isComplete) {
    return (
      <span
        className="
          flex size-5 shrink-0 items-center justify-center rounded-full
          bg-landing-step text-white transition-all duration-500
        "
        aria-hidden="true"
      >
        <Check className="size-3 stroke-[3]" />
      </span>
    );
  }

  if (isActive) {
    return (
      <span
        className="
          flex size-5 shrink-0 items-center justify-center rounded-full
          border border-landing-step transition-all duration-500
        "
        aria-hidden="true"
      >
        <span className="block size-2.5 rounded-full bg-landing-step" />
      </span>
    );
  }

  return (
    <span
      className="
        flex size-5 shrink-0 items-center justify-center rounded-full
        border border-landing-step/35 opacity-50 transition-all duration-500
      "
      aria-hidden="true"
    />
  );
}

function useStepVisibility(count: number) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(() =>
    Array.from({ length: count }, () => false),
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      const prefersReduced = media.matches;
      setReduceMotion(prefersReduced);
      if (prefersReduced) {
        setVisibleSteps(Array.from({ length: count }, () => true));
      }
    };
    applyPreference();
    media.addEventListener("change", applyPreference);
    return () => media.removeEventListener("change", applyPreference);
  }, [count]);

  useEffect(() => {
    if (reduceMotion) return;

    const observers: IntersectionObserver[] = [];

    refs.current.forEach((node, index) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setVisibleSteps((prev) => {
            if (prev[index]) return prev;
            const next = [...prev];
            next[index] = true;
            return next;
          });
          observer.unobserve(node);
        },
        { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
      );

      observer.observe(node);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [reduceMotion]);

  const visibleCount = visibleSteps.filter(Boolean).length;

  return { refs, visibleSteps, visibleCount, reduceMotion };
}

/**
 * Scroll-driven ladder stepper — layout matches scripts/ProductLandingPage.tsx.
 */
export function HowItWorksTimeline() {
  const { refs, visibleSteps, visibleCount, reduceMotion } = useStepVisibility(STEPS.length);

  return (
    <ol className="relative mx-auto mt-[59px] w-full max-w-[400px]">
      {STEPS.map((step, index) => {
        const isVisible = visibleSteps[index] || reduceMotion;
        const connectorActive = index < visibleCount - 1;

        return (
          <li
            key={step.label}
            ref={(node) => {
              refs.current[index] = node;
            }}
            className={`
              relative flex gap-6 px-6 py-4
              transition-all duration-700 ease-out
              ${index > 0 ? "mt-10" : ""}
              ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
            `}
            style={{
              transitionDelay: reduceMotion ? "0ms" : `${index * 80}ms`,
            }}
          >
            {/* Ladder rail — ProductLandingPage left: 34px, 1px connectors */}
            {index < STEPS.length - 1 ? (
              <div
                className={`
                  pointer-events-none absolute left-[34px] top-[52px] h-20 w-px
                  transition-colors duration-500
                  ${connectorActive ? "bg-landing-step" : "bg-[#CFD6DC]/60"}
                `}
                aria-hidden="true"
              />
            ) : null}

            <StepIndicator index={index} visibleCount={visibleCount} />

            <div className="min-w-0 flex-1 text-left">
              <p className="mb-1 text-xs text-white">{step.label}</p>
              <h3 className="mb-2.5 text-sm font-medium text-white">{step.title}</h3>
              <div className="text-sm leading-5 text-white">{step.body}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
