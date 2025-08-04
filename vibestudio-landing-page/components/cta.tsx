"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <div className="showcase-gradient-light relative mx-auto flex min-h-[80vh] w-full max-w-full items-center justify-center sm:min-h-[100vh]">
      <div className="mt-12 flex max-w-3xl flex-col items-center px-6 text-center lg:max-w-[1049px]">
        <p className="text-4xl font-semibold text-black lg:text-6xl">
          Transform Your Development Experience.
        </p>

        <p className="mt-1 text-2xl font-medium text-black/50 lg:mt-4 lg:text-[32px] lg:font-semibold">
          Experience VibeStudio&apos;s AI-powered productivity.
        </p>

        <div className="mt-6 flex flex-col p-4 lg:mt-10">
          <Button className="bg-black px-20 py-[22px] text-sm font-semibold hover:bg-black sm:text-base">
            <Link href="/pricing">Get Started</Link>
          </Button>

          <a
            href="https://vibestudio.online/docs/contributors"
            className="mt-1 text-black underline decoration-black/50 underline-offset-1 hover:decoration-black/20"
          >
            Join our developer community
          </a>
        </div>
      </div>
    </div>
  );
}
