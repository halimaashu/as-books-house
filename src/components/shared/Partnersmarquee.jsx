import Link from "next/link";
import { FaArrowRight, FaGlobeAsia, FaBook, FaGraduationCap, FaSpellCheck } from "react-icons/fa";

// Languages show their own script; topic categories show an icon.
const categories = [
  { name: "Japanese", native: "日本語" },
  { name: "German", native: "Deutsch" },
  { name: "English", native: "Aa" },
  { name: "Bangla", native: "বাংলা" },
  { name: "Korean", native: "한국어" },
  { name: "Arabic", native: "العربية" },
  { name: "Chinese", native: "中文" },
  { name: "Grammar & Vocabulary", icon: FaSpellCheck },
  { name: "Exam Preparation", icon: FaGraduationCap },
  { name: "Dictionaries", icon: FaBook },
];

export default function LanguageCategories() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f4ee] to-[#fdf1e4] px-5 py-14 dark:from-[#121d29] dark:to-[#0f1923] sm:px-8 sm:py-20">
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#f8913e]/20 blur-3xl dark:bg-[#f8913e]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#4f86c6]/15 blur-3xl dark:bg-[#4f86c6]/10" />

      <div className="container relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#123252] to-[#1b4268] text-2xl text-[#ffd1a8] shadow-lg shadow-[#123252]/30 ring-4 ring-white dark:ring-[#121d29]">
            <FaGlobeAsia />
          </span>
          <p className="mx-auto mt-5 w-fit rounded-full border border-[#cf6410]/30 bg-[#cf6410]/10 px-3.5 py-1 text-sm font-semibold text-[#cf6410] dark:text-[#f8913e]">
            Choose your next language
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10283f] dark:text-white sm:text-5xl">
            A bookshelf for{" "}
            <span className="bg-gradient-to-r from-[#cf6410] to-[#f8913e] bg-clip-text text-transparent">curious minds</span>
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            Explore language learning, grammar, exam preparation, and reference books from the collection.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {categories.map(({ name, native, icon: Icon }) => (
            <Link
              key={name}
              href={`/allBooks?category=${encodeURIComponent(name)}`}
              className="group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border border-[#e3ded5] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl hover:shadow-[#123252]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e87817] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/10 dark:bg-[#172330] dark:focus-visible:ring-offset-[#121d29] sm:min-h-40 sm:p-5"
            >
              {/* Fill that sweeps in on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-gradient-to-br from-[#123252] via-[#1b4268] to-[#cf6410] transition-transform duration-500 ease-out group-hover:scale-y-100 motion-reduce:transition-none"
              />

              {/* Script or icon */}
              <span
                className={`relative z-10 leading-none transition-colors duration-300 group-hover:text-white ${
                  native
                    ? "text-3xl font-bold text-[#123252] dark:text-[#d4e2f1] sm:text-4xl"
                    : "flex h-11 w-11 items-center justify-center rounded-xl bg-[#cf6410]/10 text-xl text-[#cf6410] group-hover:bg-white/15 dark:bg-[#f8913e]/15 dark:text-[#f8913e]"
                }`}
              >
                {native ? native : <Icon />}
              </span>

              <span className="relative z-10 mt-6 flex items-end justify-between gap-2">
                <span className="min-w-0 text-sm font-semibold leading-snug text-[#10283f] transition-colors duration-300 group-hover:text-white dark:text-white sm:text-base">
                  {name}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#123252]/5 text-xs text-slate-500 transition duration-300 group-hover:bg-white group-hover:text-[#cf6410] dark:bg-white/10 dark:text-slate-300">
                  <FaArrowRight className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}