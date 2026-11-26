import React from "react";
import Book from "../ui/Book";

export default function SpeachileBooks({ books = [] }) {
  const specialBooks = books.slice(7, 12);
  return (
    <section className="container mx-auto px-5 py-14 sm:px-8 sm:py-20">
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#cf6410]">From our shelves</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#10283f] dark:text-white md:text-4xl">A few good reads</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400 md:text-base">Take a closer look at a selection from the collection. Your next favorite may be here.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {specialBooks.map((book) => (
          <Book key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
}
