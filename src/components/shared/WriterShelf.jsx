import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";

const profileImage = (book) => book?.author_image || book?.authorImage || book?.writer_image || book?.writerImage || book?.author_photo || book?.authorPhoto || null;
const popularity = (book) => Number(book?.sales_count ?? book?.sold_count ?? book?.total_sold ?? book?.copies_sold ?? book?.popularity ?? 0);
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export default function WriterShelf({ books = [] }) {
  const writers = [...books.reduce((groups, book) => {
    const name = typeof book?.author === "string" ? book.author.trim() : "";
    if (!name) return groups;
    const key = name.toLocaleLowerCase();
    const group = groups.get(key) || { name, books: [] };
    group.books.push(book);
    groups.set(key, group);
    return groups;
  }, new Map()).values()]
    .sort((a, b) => b.books.length - a.books.length || a.name.localeCompare(b.name))
    .slice(0, 4);

  if (writers.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fdf6ee] to-white px-5 py-14 dark:from-[#101923] dark:via-[#132130] dark:to-[#101923] sm:px-8 sm:py-20">
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#f8913e]/20 blur-3xl dark:bg-[#f8913e]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#123252]/10 blur-3xl dark:bg-[#6685a8]/10" />

      <div className="container relative mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cf6410]/30 bg-[#cf6410]/10 px-3.5 py-1 text-sm font-semibold text-[#cf6410] dark:text-[#f8913e]">
            <FaBookOpen className="text-xs" /> Meet the authors
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#10283f] dark:text-white sm:text-5xl">
            Writers on our{" "}
            <span className="bg-gradient-to-r from-[#cf6410] to-[#f8913e] bg-clip-text text-transparent">shelves</span>
          </h2>
          <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            Discover authors and browse the books currently available in the collection.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {writers.map((writer) => {
            const featured = [...writer.books].filter((book) => book?.image_url).sort((a, b) => popularity(b) - popularity(a)).slice(0, 2);
            const portrait = writer.books.map(profileImage).find(Boolean);
            return (
              <article
                key={writer.name}
                className="group/card relative overflow-hidden rounded-3xl border border-[#e5e8eb] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#f2b47c] hover:shadow-2xl hover:shadow-[#cf6410]/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/10 dark:bg-[#172330] dark:hover:border-[#f8913e]/50 dark:hover:shadow-black/40"
              >
                {/* Banner */}
                <div className="relative h-20 bg-gradient-to-r from-[#123252] via-[#1c4a78] to-[#cf6410] sm:h-24">
                  <div aria-hidden="true" className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/10" />
                  <div aria-hidden="true" className="absolute right-16 top-8 h-14 w-14 rounded-full bg-[#f8913e]/30 blur-md" />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#123252] shadow-md dark:bg-[#101923]/95 dark:text-[#d4e2f1]">
                    <FaBookOpen className="text-[#cf6410]" />
                    {writer.books.length} {writer.books.length === 1 ? "book" : "books"}
                  </span>
                </div>

                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                  {/* Avatar overlapping banner */}
                  <div className="-mt-9 flex items-end gap-4 sm:-mt-10">
                    <div className="shrink-0 rounded-full bg-gradient-to-br from-[#f8913e] to-[#cf6410] p-[3px] shadow-lg shadow-[#cf6410]/30">
                      <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full bg-[#e7edf5] text-xl font-extrabold text-[#123252] ring-4 ring-white dark:bg-[#24384d] dark:text-[#d4e2f1] dark:ring-[#172330] sm:h-20 sm:w-20">
                        {portrait ? <Image src={portrait} alt={writer.name} fill sizes="80px" className="object-cover" /> : initials(writer.name)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <h3 className="truncate text-xl font-bold text-[#10283f] dark:text-white">{writer.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{writer.books.length} {writer.books.length === 1 ? "book" : "books"} available</p>
                    </div>
                    <Link
                      href={`/allBooks?query=${encodeURIComponent(writer.name)}`}
                      aria-label={`Explore books by ${writer.name}`}
                      className="group/btn hidden shrink-0 items-center gap-2 rounded-xl bg-gradient-to-br from-[#e87817] to-[#cf6410] px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-[#cf6410]/30 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e87817] focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-[#172330] sm:inline-flex"
                    >
                      Explore books <FaArrowRight className="text-xs transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none" />
                    </Link>
                  </div>

                  {/* Featured books */}
                  <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                    {featured.map((book) => {
                      const price = Number(book.price);
                      const hasPrice = Number.isFinite(price) && price > 0;
                      return (
                        <Link
                          key={String(book._id)}
                          href={`/book/${book._id}`}
                          className="group flex min-w-0 items-center gap-3 rounded-2xl border border-[#eaedf0] bg-gradient-to-br from-[#fdf6ee] to-white p-2.5 transition hover:-translate-y-0.5 hover:border-[#dba46f] hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/10 dark:from-[#1c2a37] dark:to-[#101923]"
                        >
                          <div className="relative aspect-[4/5] w-16 shrink-0">
                            <Image
                              src={book.image_url}
                              alt={book.title || "Book cover"}
                              fill
                              sizes="64px"
                              className="object-contain drop-shadow-[0_6px_6px_rgba(16,40,63,0.35)] transition duration-300 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#10283f] transition-colors group-hover:text-[#cf6410] dark:text-white">{book.title}</p>
                            <p className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${hasPrice ? "bg-[#cf6410]/10 text-[#cf6410] dark:bg-[#f8913e]/15 dark:text-[#f8913e]" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>
                              {hasPrice ? `৳${price.toLocaleString("en-US")}` : "Price not listed"}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href={`/allBooks?query=${encodeURIComponent(writer.name)}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#cf6410] dark:text-[#f8913e] sm:hidden"
                  >
                    Explore books by {writer.name} <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}