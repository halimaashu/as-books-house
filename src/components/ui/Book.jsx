import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineExplore } from "react-icons/md";
import { FaArrowRight, FaUserEdit } from "react-icons/fa";

export default function Book({ book }) {
  const qty = Number(book?.available_quantity ?? 0);
  const stock =
    qty === 0
      ? {
          text: "Out of stock",
          style: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/30",
          dot: "bg-red-500",
        }
      : qty <= 5
        ? {
            text: `Only ${qty} left`,
            style: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30",
            dot: "bg-amber-500 animate-pulse motion-reduce:animate-none",
          }
        : {
            text: "In stock",
            style: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30",
            dot: "bg-emerald-500",
          };

  const price = Number(book?.price);
  const hasPrice =
    book?.price !== undefined &&
    book?.price !== null &&
    book?.price !== "" &&
    !Number.isNaN(price) &&
    price > 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#e6e9ec] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#f2b47c] hover:shadow-2xl hover:shadow-[#cf6410]/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/10 dark:bg-[#172330] dark:hover:border-[#f8913e]/50 dark:hover:shadow-black/40">
      {/* Accent line that grows in on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#cf6410] via-[#f8913e] to-[#123252] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
      />

      {/* Cover stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#fdf1e4] via-[#f6efe6] to-[#e4ecf5] dark:from-[#22313f] dark:via-[#1c2a37] dark:to-[#142031]">
        {/* Soft glow behind the book */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f8913e]/25 blur-3xl transition duration-500 group-hover:bg-[#f8913e]/40 dark:bg-[#f8913e]/15"
        />

        {book?.image_url ? (
          <Image
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={book.image_url}
            fill
            alt={book?.title || "Book cover"}
            className="object-contain p-6 drop-shadow-[0_14px_16px_rgba(16,40,63,0.35)] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:-rotate-2 group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            No cover
          </div>
        )}

        {/* Category */}
        <span className="absolute left-3 top-4 z-10 max-w-[55%] truncate rounded-full bg-[#123252] px-3 py-1 text-xs font-semibold text-white shadow-md dark:bg-white dark:text-[#123252]">
          {book?.category}
        </span>

        {/* Stock */}
        <span
          className={`absolute right-3 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ${stock.style}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} />
          {stock.text}
        </span>

        {/* Price tag overlapping the cover */}
        <div className="absolute bottom-3 left-3 z-10">
          {hasPrice ? (
            <p className="rounded-2xl bg-gradient-to-br from-[#e87817] to-[#cf6410] px-4 py-1.5 text-lg font-extrabold tracking-tight text-white shadow-lg shadow-[#cf6410]/40">
              <span className="mr-1 text-base font-bold">৳</span>
              {price.toLocaleString("en-US")}
            </p>
          ) : (
            <p className="rounded-2xl bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-500 shadow-sm dark:bg-[#101923]/90 dark:text-slate-400">
              Price coming soon
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-[#10283f] transition-colors group-hover:text-[#cf6410] dark:text-white dark:group-hover:text-[#f8913e]">
          {book?.title}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#123252]/10 text-[#123252] dark:bg-white/10 dark:text-[#9bb7d4]">
            <FaUserEdit className="text-xs" />
          </span>
          <span className="truncate font-medium">{book?.author}</span>
        </p>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {book?.description}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Link
            href={`/book/${book?._id}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#e87817] to-[#cf6410] px-2 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#cf6410]/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#cf6410]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e87817] focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-[#172330]"
          >
            <MdOutlineExplore className="text-base" />
            Explore now
          </Link>
          <Link
            href={`/allBooks?category=${encodeURIComponent(book?.category || "")}`}
            className="group/btn inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#123252]/20 bg-[#123252]/5 px-2 py-2.5 text-sm font-semibold text-[#123252] transition hover:border-[#123252] hover:bg-[#123252] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6685a8] focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-[#123252] dark:focus-visible:ring-offset-[#172330]"
          >
            More like this
            <FaArrowRight className="text-xs transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </div>
      </div>
    </article>
  );
}