"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { FaArrowLeft, FaArrowRight, FaBookOpen } from "react-icons/fa";

const languageSlides = [
  { language: "Japanese", native: "日本語", title: "Learn Japanese, one page at a time.", label: "Japanese language" },
  { language: "German", native: "Deutsch", title: "Find your words in German.", label: "German language" },
  { language: "English", native: "English", title: "Build confidence in English.", label: "English learning" },
  { language: "Korean", native: "한국어", title: "Open a new chapter in Korean.", label: "Korean language" },
  { language: "Bangla", native: "বাংলা", title: "Explore the richness of Bangla.", label: "Bangla language" },
  { language: "Arabic", native: "العربية", title: "Begin your Arabic learning journey.", label: "Arabic language" },
  { language: "Chinese", native: "中文", title: "Take your first steps in Chinese.", label: "Chinese language" },
];

export default function Banner({ books = [] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = useMemo(() => languageSlides.map((slide) => {
    const term = slide.language.toLowerCase();
    const featuredBook = books.find((book) =>
      `${book?.category || ""} ${book?.title || ""} ${book?.description || ""}`.toLowerCase().includes(term) && book?.image_url
    );
    return { ...slide, featuredBook };
  }), [books]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length, paused]);

  const move = (step) => setActive((index) => (index + step + slides.length) % slides.length);

  return (
    <section
      className="overflow-hidden bg-gradient-to-b from-[#f7f4ee] to-[#fdf1e4] dark:from-[#121d29] dark:to-[#0f1923]"
      aria-label="Browse language learning books"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0c2033] via-[#10283f] to-[#1b4268] text-white shadow-2xl shadow-[#10283f]/30 ring-1 ring-white/10 sm:rounded-[2rem]">
          {/* Atmosphere */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-[#e87817]/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-10 h-96 w-96 rounded-full bg-[#4f86c6]/25 blur-3xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          />

          <div className="relative min-h-[36rem] sm:min-h-[34rem] lg:min-h-[37rem]">
            <div
              className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {slides.map((slide, index) => {
                const image = slide.featuredBook?.image_url || heroBg;
                const alt = slide.featuredBook?.title || `${slide.language} language learning books`;
                return (
                  <article
                    key={slide.language}
                    aria-hidden={index !== active}
                    inert={index !== active}
                    className="relative grid min-w-full grid-cols-1 items-center gap-8 overflow-hidden px-6 pb-20 pt-8 sm:px-10 sm:pt-10 md:grid-cols-[1.1fr_.9fr] lg:gap-14 lg:px-16 lg:pt-14"
                  >
                    {/* Giant native-script watermark */}
                    <span
                      aria-hidden="true"
                      lang=""
                      className="pointer-events-none absolute -bottom-6 right-4 select-none whitespace-nowrap text-[7rem] font-bold leading-none text-white/[0.06] sm:text-[10rem] lg:right-10 lg:text-[14rem]"
                    >
                      {slide.native}
                    </span>

                    <div className="relative max-w-2xl self-center">
                      <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-[#ffd1a8] backdrop-blur">
                        <FaBookOpen className="text-xs" /> {slide.label}
                      </p>
                      <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-[-.035em] sm:text-5xl lg:text-6xl">
                        <span className="bg-gradient-to-br from-white via-white to-[#ffd1a8] bg-clip-text text-transparent">
                          {slide.title}
                        </span>
                      </h1>
                      <p className="mt-5 max-w-lg text-sm leading-7 text-[#d5e0eb] sm:text-base">
                        Browse language books, study guides, dictionaries, and reading for every stage of your learning journey.
                      </p>
                      {slide.featuredBook && (
                        <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/70">
                          <span className="h-px w-6 bg-[#f8913e]" />
                          Featured: <span className="font-semibold text-white">{slide.featuredBook.title}</span>
                        </p>
                      )}
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                          href="/allBooks"
                          className="group/cta inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#f8913e] to-[#cf6410] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#e87817]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e87817]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                        >
                          Explore Now <FaArrowRight className="text-xs transition-transform group-hover/cta:translate-x-1 motion-reduce:transition-none" />
                        </Link>
                        <Link
                          href={`/allBooks?category=${encodeURIComponent(slide.language)}`}
                          className="rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white/60 hover:bg-white/15 motion-reduce:transition-none"
                        >
                          Browse {slide.language}
                        </Link>
                      </div>
                    </div>

                    {/* Cover stack */}
                    <div className="relative mx-auto w-full max-w-[19rem] md:max-w-[21rem] lg:max-w-[24rem]">
                      <div aria-hidden="true" className="absolute -inset-6 rounded-full bg-[#f8913e]/25 blur-3xl" />
                      <div aria-hidden="true" className="absolute inset-0 -rotate-6 rounded-[1.25rem] bg-gradient-to-br from-[#f8913e]/60 to-[#cf6410]/40 ring-1 ring-white/20" />
                      <div aria-hidden="true" className="absolute inset-0 rotate-3 rounded-[1.25rem] border border-white/25 bg-white/10 backdrop-blur-sm" />
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#fbf6ee] to-[#ece5d8] p-3 shadow-2xl shadow-black/40">
                        <Image
                          src={image}
                          fill
                          sizes="(max-width: 768px) 75vw, 35vw"
                          alt={alt}
                          className={slide.featuredBook ? "object-contain p-4 drop-shadow-[0_14px_14px_rgba(16,40,63,0.35)]" : "object-cover"}
                          priority={index === 0}
                        />
                        <span className="absolute bottom-4 left-4 rounded-full bg-[#10283f]/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur">
                          AS Books House · {slide.language}
                        </span>
                        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-br from-[#f8913e] to-[#cf6410] px-3 py-1 text-sm font-bold text-white shadow-md">
                          {slide.native}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between gap-4 sm:bottom-6 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
              <div className="flex items-center gap-2" role="group" aria-label="Choose language category">
                {slides.map((slide, index) => (
                  <button
                    key={slide.language}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Show ${slide.language} books`}
                    aria-current={active === index ? "true" : undefined}
                    className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${active === index ? "w-8 bg-gradient-to-r from-[#f8913e] to-[#e87817]" : "w-2 bg-white/35 hover:bg-white/70"}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-sm tabular-nums text-white/60 sm:inline">{active + 1} / {slides.length}</span>
                <button type="button" onClick={() => move(-1)} aria-label="Previous language category" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur transition hover:border-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"><FaArrowLeft className="text-xs" /></button>
                <button type="button" onClick={() => move(1)} aria-label="Next language category" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur transition hover:border-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"><FaArrowRight className="text-xs" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}