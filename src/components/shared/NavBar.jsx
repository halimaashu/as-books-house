"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import { FiLogOut, FiGrid } from "react-icons/fi";
import { ModeToggle } from "../ui/ModeToggle";

const baseLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/allBooks" },
  { label: "Learning banner", href: "/learning-banner" },
  { label: "Contact", href: "/contact" },
];

function Logo({ onClick }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f8913e]"
    >
      <span className="rounded-xl bg-gradient-to-br from-[#f8913e] to-[#cf6410] p-[2px] shadow-md shadow-[#cf6410]/30 transition group-hover:rotate-3 motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
        <Image src="/as-books-house-logo.jpg" width={44} height={44} alt="" className="h-10 w-10 rounded-[10px] object-cover" />
      </span>
      <span className="text-lg font-extrabold leading-tight tracking-tight text-white sm:text-xl">
        AS Books{" "}
        <span className="bg-gradient-to-r from-[#ffd1a8] to-[#f8913e] bg-clip-text text-transparent">House</span>
      </span>
    </Link>
  );
}

// Shows the user's photo, or the first letter of the name if there is no photo
function UserAvatar({ user, size = "h-10 w-10" }) {
  const [failed, setFailed] = useState(false);
  const letter = (user?.name || user?.email || "U")[0].toUpperCase();
  return (
    <span className="shrink-0 rounded-full bg-gradient-to-br from-[#f8913e] to-[#cf6410] p-[2px] shadow-md shadow-[#cf6410]/30">
      <span
        className={`flex ${size} items-center justify-center overflow-hidden rounded-full bg-[#e7edf5] text-base font-bold text-[#123252] ring-2 ring-[#10283f]`}
      >
        {user?.image && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name || "User"}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          letter
        )}
      </span>
    </span>
  );
}

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Admin goes to /dashboard/admin, everyone else to /dashboard
  const dashboardHref = user?.role === "admin" ? "/dashboard/admin" : "/dashboard";

  // Dashboard link shows in the nav only after login
  const links = user
    ? [...baseLinks, { label: "Dashboard", href: dashboardHref }]
    : baseLinks;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/dashboard")) return pathname.startsWith("/dashboard");
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut();
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const activeStyle =
    "bg-gradient-to-br from-[#f8913e] to-[#cf6410] text-white shadow-md shadow-[#cf6410]/30";

  return (
    <header
      className={
        pathname.startsWith("/dashboard")
          ? "hidden"
          : `sticky top-0 z-50 w-full bg-gradient-to-r from-[#0c2033]/95 via-[#10283f]/95 to-[#16385a]/95 backdrop-blur-xl transition-all duration-300 dark:from-[#08121c]/95 dark:via-[#0b1622]/95 dark:to-[#10202f]/95 ${
              scrolled ? "shadow-xl shadow-black/30" : "shadow-md shadow-black/10"
            }`
      }
    >
      {/* Accent line along the bottom edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#f8913e]/70 to-transparent"
      />

      <nav
        aria-label="Main navigation"
        className={`container mx-auto flex items-center justify-between px-5 transition-all duration-300 sm:px-8 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Logo onClick={() => setOpen(false)} />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 md:flex">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f8913e] motion-reduce:transition-none ${
                  isActive(href)
                    ? activeStyle
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label === "Dashboard" && <FiGrid />}
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />

          {isPending ? (
            // Placeholder while the session loads (no flash of Sign in buttons)
            <div className="h-10 w-40 animate-pulse rounded-xl bg-white/15 motion-reduce:animate-none" />
          ) : user ? (
            <>
              <div className="flex items-center gap-3 rounded-full bg-white/5 py-1 pl-1 pr-4 ring-1 ring-white/10">
                <UserAvatar user={user} size="h-9 w-9" />
                <div className="hidden leading-tight lg:block">
                  <p className="max-w-[140px] truncate text-sm font-bold text-white">
                    {user.name}
                  </p>
                  {user.role === "admin" && (
                    <p className="text-xs font-semibold text-[#f8913e]">Admin</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#123252] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f8913e] disabled:opacity-60 motion-reduce:transition-none"
              >
                <FiLogOut />
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-white/25 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#123252] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f8913e] motion-reduce:transition-none"
              >
                Sign in
              </Link>
              <Link
                href="/signin"
                className="rounded-xl bg-gradient-to-br from-[#f8913e] to-[#cf6410] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#cf6410]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#cf6410]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-2xl text-white ring-1 ring-white/15 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f8913e] motion-reduce:transition-none"
          >
            {open ? <IoClose /> : <IoMenuSharp />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`grid overflow-hidden border-t border-white/10 transition-all duration-300 motion-reduce:transition-none md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] border-transparent opacity-0"
        }`}
      >
        <div className="min-h-0">
          {/* User card (only when logged in) */}
          {user && (
            <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10 sm:mx-8">
              <UserAvatar user={user} size="h-12 w-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{user.name}</p>
                <p className="truncate text-xs text-[#ffd1a8]">
                  {user.role === "admin" ? "Admin" : user.email}
                </p>
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-1 px-5 pb-3 pt-3 sm:px-8">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition motion-reduce:transition-none ${
                    isActive(href) ? activeStyle : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {label === "Dashboard" && <FiGrid />}
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-5 pb-5 sm:px-8">
            {isPending ? (
              <div className="h-12 animate-pulse rounded-xl bg-white/15 motion-reduce:animate-none" />
            ) : user ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#123252] disabled:opacity-60 motion-reduce:transition-none"
              >
                <FiLogOut />
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white hover:text-[#123252] motion-reduce:transition-none"
                >
                  Sign in
                </Link>
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gradient-to-br from-[#f8913e] to-[#cf6410] px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#cf6410]/30 transition hover:shadow-lg motion-reduce:transition-none"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
