import React from "react";
import Marquee from "react-fast-marquee";
import { FaQuoteLeft, FaRegCommentDots } from "react-icons/fa";
import UserReview from "./UserReview";

export default function UserreviewMarque() {
  return (
    <section className="relative overflow-hidden bg-[#fdf6ee] py-16 text-center dark:bg-[#0f1923] sm:py-20">
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#f8913e]/20 blur-3xl dark:bg-[#f8913e]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#4f86c6]/15 blur-3xl dark:bg-[#4f86c6]/10" />

      {/* Oversized quote mark behind the heading */}
      <FaQuoteLeft
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-[9rem] text-[#cf6410]/[0.07] dark:text-white/[0.05] sm:text-[12rem]"
      />

      <div className="container relative mx-auto px-5 sm:px-8">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#cf6410]/30 bg-[#cf6410]/10 px-3.5 py-1 text-sm font-semibold text-[#cf6410] dark:text-[#f8913e]">
          <FaRegCommentDots className="text-xs" /> Reader reviews
        </span>

        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#10283f] dark:text-white md:text-5xl">
          What our{" "}
          <span className="bg-gradient-to-r from-[#cf6410] to-[#f8913e] bg-clip-text text-transparent">readers</span>{" "}
          are saying
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-400 md:text-lg">
          Real feedback from book lovers who found their next favorite read with us.
        </p>
      </div>

      {/* Marquee with soft edge fades */}
      <div className="relative mt-10 sm:mt-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#fdf6ee] to-transparent dark:from-[#0f1923] sm:w-32" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#fdf6ee] to-transparent dark:from-[#0f1923] sm:w-32" />

        <Marquee pauseOnHover speed={40} className="py-4">
          <div className="mx-3"><UserReview /></div>
          <div className="mx-3"><UserReview /></div>
        </Marquee>
      </div>
    </section>
  );
}