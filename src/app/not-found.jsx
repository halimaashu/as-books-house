import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f7f4ee] px-5 text-center dark:bg-[#101923]">
      <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#cf6410]">AS Books House</p>
      <h1 className="text-7xl font-semibold tracking-tight text-[#123252] dark:text-white">404</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300">We couldn’t find that page.</p>
      <Link href="/" className="rounded-xl bg-[#cf6410] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a84e0d]">
        Return to the homepage
      </Link>
    </div>
  )
}
