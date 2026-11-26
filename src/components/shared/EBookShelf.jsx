import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";

const isEBook = (book) => {
  const format = [book?.format, book?.book_type, book?.bookType, book?.type, book?.medium]
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();
  return book?.is_ebook === true || book?.isEbook === true || book?.digital === true || /e-?book|digital/.test(format);
};

const firstNumber = (values) => {
  const value = values.find((entry) => entry !== undefined && entry !== null && entry !== "");
  return value === undefined ? NaN : Number(value);
};

export default function EBookShelf({ books = [] }) {
  const eBooks = books.filter((book) => isEBook(book) && book?.image_url);
  if (eBooks.length === 0) return null;

  return (
    <section className="bg-[#fffaf3] px-5 py-14 dark:bg-[#172330] sm:px-8 sm:py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#cf6410]"><FaBookOpen /> Digital shelf</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#10283f] dark:text-white sm:text-4xl">E-books for learning anywhere</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">Read and study from the digital titles available in our collection.</p>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">{eBooks.length} {eBooks.length === 1 ? "title" : "titles"}</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {eBooks.map((book) => {
            // `price` is what the existing checkout charges; show other fields only as a comparison.
            const currentPrice = firstNumber([book.price]);
            const originalPrice = firstNumber([book.original_price, book.originalPrice, book.list_price, book.listPrice, book.mrp]);
            const discounted = Number.isFinite(originalPrice) && Number.isFinite(currentPrice) && originalPrice > currentPrice && currentPrice > 0;
            const discount = discounted ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;
            return (
              <article key={String(book._id)} className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#101923]">
                <div className="relative aspect-[4/5] bg-[#f3f1ec] dark:bg-[#202d3a]">
                  <Image src={book.image_url} alt={book.title || "E-book cover"} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-contain p-4" />
                  {discounted && <span className="absolute left-3 top-3 rounded-full bg-[#cf6410] px-3 py-1 text-xs font-bold text-white">{discount}% off</span>}
                </div>
                <div className="flex min-h-[13rem] flex-col p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6685a8]">{book.category || "E-book"}</p>
                  <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-snug text-[#10283f] dark:text-white">{book.title}</h3>
                  <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
                  <div className="mt-4 flex min-h-8 items-baseline gap-2">
                    {Number.isFinite(currentPrice) && currentPrice > 0 ? <span className="text-xl font-bold text-[#cf6410]">৳{currentPrice.toLocaleString("en-US")}</span> : <span className="text-sm text-slate-500">Price not listed</span>}
                    {discounted && <span className="text-sm text-slate-400 line-through">৳{originalPrice.toLocaleString("en-US")}</span>}
                  </div>
                  <Link href={`/book/${book._id}`} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#123252] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2944]">
                    View details <FaArrowRight className="text-xs" />
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
