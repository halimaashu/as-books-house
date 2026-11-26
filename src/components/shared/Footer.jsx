"use client"
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MdOutgoingMail } from "react-icons/md";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { FiGlobe, FiMail } from "react-icons/fi";
import { usePathname } from "next/navigation";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/allBooks" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "New books",
  "New collections",
  "Library updated every week",
  "Affordable prices",
];

const socials = [
  { label: "Email", href: "mailto:halima520ashu@gmail.com", icon: MdOutgoingMail, hover: "hover:bg-orange-700" },
];

export default  function Footer() {
  const pathname=usePathname()

  return (
    <footer className={`${pathname.startsWith("/dashboard")?"hidden":"relative bg-slate-950 text-slate-300"}`}>
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#cf6410] via-white/30 to-green-500" />

      <div className="container mx-auto px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/as-books-house-logo.jpg" width={44} height={44} alt="" className="h-10 w-10 rounded-lg object-cover" />
              <span className="text-xl font-extrabold tracking-tight text-white">AS Books <span className="text-orange-200">House</span></span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Your trusted online bookstore for original books across every genre,
              with secure payment and tracked delivery.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map(({ label, href, icon: Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:-translate-y-1 hover:text-white ${hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-base font-bold text-white">Quick links</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition hover:pl-1 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-bold text-white">Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold text-white">Contact us</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMagnifyingGlassLocation className="mt-0.5 shrink-0 text-red-500" />
                Satrasta, Dhaka
              </li>
              <li>
                <a
                  href="mailto:halima520ashu@gmail.com"
                  className="flex items-start gap-3 transition hover:text-white"
                >
                  <FiMail className="mt-0.5 shrink-0 text-red-500" />
                  halima520ashu@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiGlobe className="mt-0.5 shrink-0 text-red-500" />
                AS Books House · Dhaka
              </li>
              <li>
                <a
                  href="https://wa.me/8801975665249"
                  className="flex items-start gap-3 transition hover:text-white"
                >
                  <IoLogoWhatsapp className="mt-0.5 shrink-0 text-green-500" />
                  01975665249
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left sm:text-sm">
          <p>© {new Date().getFullYear()} AS Books House. All rights reserved.</p>
          <p>Made for book lovers in Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
