import { getAllReview } from "@/lib/data";
import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "R";

export default async function UserReview() {
  const review = await getAllReview();
  const reviews = review?.reviews;

  if (!reviews?.length) {
    return (
      <div className="px-6 py-6 text-center">
        <p className="rounded-2xl border border-dashed border-[#e3ded5] bg-white px-6 py-4 text-sm text-slate-600 dark:border-white/15 dark:bg-[#172330] dark:text-slate-300">
          There are no reviews available
        </p>
      </div>
    );
  }

  return (
    // No section background here, so the marquee's edge fades blend in
    <div className="flex flex-nowrap items-stretch gap-6 py-2">
      {reviews.map((item, index) => {
        const rating = Math.min(5, Math.max(1, Math.round(Number(item.rating) || 5)));
        return (
          <figure
            key={item.id ?? item._id ?? index}
            className="group relative flex w-[290px] shrink-0 flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-[#e3ded5] bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#f2b47c] hover:shadow-xl hover:shadow-[#cf6410]/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/10 dark:bg-[#172330] dark:hover:border-[#f8913e]/50 dark:hover:shadow-black/40 sm:w-[340px]"
          >
            {/* Accent line that grows in on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#cf6410] via-[#f8913e] to-[#123252] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
            />

            {/* Faint oversized quote mark */}
            <FaQuoteLeft
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-2 text-8xl text-[#cf6410]/[0.07] dark:text-white/[0.05]"
            />

            <div className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f8913e] to-[#cf6410] text-sm text-white shadow-md shadow-[#cf6410]/30">
                <FaQuoteLeft />
              </span>

              <div className="mt-4 flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < rating ? "text-[#f5a524]" : "text-slate-300 dark:text-white/20"} />
                ))}
              </div>

              <blockquote className="mt-4 line-clamp-5 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                {item.review_text}
              </blockquote>
            </div>

            <figcaption className="relative flex items-center gap-3 border-t border-[#eee9e0] pt-4 dark:border-white/10">
              <span className="rounded-full bg-gradient-to-br from-[#f8913e] to-[#cf6410] p-[2px]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7edf5] text-sm font-bold text-[#123252] ring-2 ring-white dark:bg-[#24384d] dark:text-[#d4e2f1] dark:ring-[#172330]">
                  {initials(item.user_name)}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate font-bold text-[#10283f] dark:text-white">{item.user_name}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">AS Books House reader</span>
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}