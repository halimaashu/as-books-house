"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"; // npm i recharts
import { authClient } from "@/lib/auth-client";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBook,
  FiArrowRight,
  FiPlusCircle,
  FiAlertTriangle,
} from "react-icons/fi";
const statusStyle = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  Failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  Cancelled: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

const CATEGORY_COLORS = ["#cf6410", "#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#0891b2"];
const money = (amount) => `৳${Number(amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const validDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};
const orderAmount = (order) => {
  const savedTotal = Number(order?.totalAmount ?? order?.totalPrice);
  if (Number.isFinite(savedTotal) && savedTotal >= 0) return savedTotal;
  return Number(order?.price || 0) * Number(order?.quantity || 1) + Number(order?.deliveryCharge || 0);
};
const orderStatus = (order) => {
  if (order?.isPaid === true) return "Paid";
  const status = String(order?.paymentStatus || "").toLowerCase();
  if (status === "cancelled" || status === "canceled") return "Cancelled";
  if (status === "failed" || status === "init_failed") return "Failed";
  return "Pending";
};
const orderIdentifier = (order) => String(order?.orderId || order?.transitionId || order?._id || "").slice(-12);
const emptyMessage = "No recorded data yet";
const localDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

// Counts a number up from 0 when the page loads
function useCountUp(target, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

// Fades and slides its children in, one after another
function Reveal({ delay = 0, className = "", children }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 30);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`min-w-0 transition-all duration-700 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color || p.stroke || p.fill }} />
          {p.name}: {money && p.dataKey === "revenue" ? `৳${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

function StatCard({ stat, delay }) {
  const count = useCountUp(stat.value || 0);
  const Icon = stat.icon;

  return (
    <Reveal delay={delay}>
      <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
        <div className="flex items-start justify-between">
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${stat.soft}`}>
            <Icon />
          </span>
          <span className="text-xs text-slate-400">Live data</span>
        </div>

        <p className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          {stat.loading ? "…" : stat.value == null ? "—" : `${stat.prefix || ""}${count.toLocaleString()}`}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{stat.label}</p>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{stat.description}</p>
      </div>
    </Reveal>
  );
}

const ranges = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "12m", label: "12 months" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminOverviewPage() {
  const [range, setRange] = useState("12m");
  const [orders, setOrders] = useState(null);
  const [books, setBooks] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL;
      if (!apiBase) {
        if (active) setLoadError("The API URL is not configured.");
        return;
      }
      const errors = [];
      try {
        const booksResponse = await fetch(new URL("books", apiBase.endsWith("/") ? apiBase : `${apiBase}/`));
        if (!booksResponse.ok) errors.push("Could not load the live book catalogue.");
        else {
          const booksData = await booksResponse.json();
          if (!Array.isArray(booksData)) errors.push("The book catalogue response was invalid.");
          else if (active) setBooks(booksData);
        }
      } catch (error) {
        errors.push(error?.message || "Could not load the live book catalogue.");
      }
      try {
        const { data: tokenData, error: tokenError } = await authClient.token();
        if (tokenError || !tokenData?.token) throw new Error("Admin authentication is unavailable for order data.");
        const ordersResponse = await fetch(new URL("orders", apiBase.endsWith("/") ? apiBase : `${apiBase}/`), {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        });
        if (!ordersResponse.ok) throw new Error("Could not load live order data.");
        const ordersPayload = await ordersResponse.json();
        if (!Array.isArray(ordersPayload?.data)) throw new Error("The orders response was invalid.");
        if (active) setOrders(ordersPayload.data);
      } catch (error) {
        errors.push(error?.message || "Could not load live order data.");
      }
      if (active) setLoadError(errors.join(" "));
    };
    loadDashboard();
    return () => { active = false; };
  }, []);

  const allOrders = orders || [];
  const allBooks = books || [];
  const paidOrders = allOrders.filter((order) => order?.isPaid === true);
  const now = new Date();
  const rangeStart = new Date(now);
  if (range === "7d") rangeStart.setDate(now.getDate() - 6);
  else if (range === "30d") rangeStart.setDate(now.getDate() - 29);
  else rangeStart.setMonth(now.getMonth() - 11, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangedPaidOrders = paidOrders.filter((order) => {
    const date = validDate(order.createdAt);
    return date && date >= rangeStart && date <= now;
  });
  const data = (() => {
    const buckets = new Map();
    if (range === "7d" || range === "30d") {
      const days = range === "7d" ? 7 : 30;
      for (let offset = days - 1; offset >= 0; offset -= 1) {
        const date = new Date(now);
        date.setDate(now.getDate() - offset);
        const key = localDateKey(date);
        buckets.set(key, { label: date.toLocaleDateString("en", { month: "short", day: "numeric" }), revenue: 0 });
      }
      rangedPaidOrders.forEach((order) => {
        const date = validDate(order.createdAt);
        const bucket = date && buckets.get(localDateKey(date));
        if (bucket) bucket.revenue += orderAmount(order);
      });
    } else {
      for (let offset = 11; offset >= 0; offset -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        buckets.set(key, { label: date.toLocaleDateString("en", { month: "short", year: "2-digit" }), revenue: 0 });
      }
      rangedPaidOrders.forEach((order) => {
        const date = validDate(order.createdAt);
        const key = date && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const bucket = key && buckets.get(key);
        if (bucket) bucket.revenue += orderAmount(order);
      });
    }
    return [...buckets.values()];
  })();
  const totalRevenue = rangedPaidOrders.reduce((sum, order) => sum + orderAmount(order), 0);
  const customersCount = new Set(allOrders.map((order) => String(order.email || "").trim().toLowerCase()).filter(Boolean)).size;
  const stats = [
    { label: "Paid revenue", value: orders ? Math.round(paidOrders.reduce((sum, order) => sum + orderAmount(order), 0)) : null, prefix: "৳", icon: FiDollarSign, soft: "bg-orange-100 text-orange-700", description: "From verified paid orders", loading: orders === null },
    { label: "Orders", value: orders?.length ?? null, icon: FiShoppingBag, soft: "bg-blue-100 text-blue-700", description: "All recorded customer orders", loading: orders === null },
    { label: "Customers with orders", value: orders ? customersCount : null, icon: FiUsers, soft: "bg-violet-100 text-violet-700", description: "Unique customer emails in orders", loading: orders === null },
    { label: "Books in catalogue", value: books?.length ?? null, icon: FiBook, soft: "bg-emerald-100 text-emerald-700", description: "Current catalogue records", loading: books === null },
  ];
  const categorySales = new Map();
  const bookById = new Map(allBooks.map((book) => [String(book._id), book]));
  paidOrders.forEach((order) => {
    const category = bookById.get(String(order.bookId))?.category || "Uncategorized";
    categorySales.set(category, (categorySales.get(category) || 0) + Number(order.quantity || 1));
  });
  const categoryTotal = [...categorySales.values()].reduce((sum, value) => sum + value, 0);
  const categoryData = [...categorySales.entries()].map(([name, value], index) => ({
    name, value: categoryTotal ? Math.round((value / categoryTotal) * 100) : 0, color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weeklyOrders = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const daily = allOrders.filter((order) => {
      const created = validDate(order.createdAt);
      return created && created.toDateString() === date.toDateString();
    });
    return { day: date.toLocaleDateString("en", { weekday: "short" }), placed: daily.length, paid: daily.filter((order) => order.isPaid === true).length };
  });
  const bookSales = new Map();
  paidOrders.forEach((order) => {
    const key = String(order.bookId || order.bookTitle || "unknown");
    const current = bookSales.get(key) || { title: order.bookTitle || "Book title unavailable", author: "", sold: 0 };
    current.sold += Number(order.quantity || 1);
    const book = bookById.get(String(order.bookId));
    if (book?.author) current.author = book.author;
    bookSales.set(key, current);
  });
  const topBooks = [...bookSales.values()].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = Math.max(1, ...topBooks.map((book) => book.sold));
  const recentOrders = [...allOrders].sort((a, b) => (validDate(b.createdAt)?.getTime() || 0) - (validDate(a.createdAt)?.getTime() || 0)).slice(0, 5).map((order) => ({
    id: orderIdentifier(order), customer: order.name || order.email || "Customer", book: order.bookTitle || "Book title unavailable", total: orderAmount(order), status: orderStatus(order),
  }));
  const stockAlerts = [...allBooks].filter((book) => Number.isFinite(Number(book.available_quantity)) && Number(book.available_quantity) <= 5).sort((a, b) => Number(a.available_quantity) - Number(b.available_quantity)).slice(0, 5);
  const rangeOrderCount = rangedPaidOrders.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
      {/* Hero header */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-green-900 to-green-700 p-6 text-white shadow-xl sm:p-10">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-red-500/30 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                Live store overview
              </p>
              <h1 className="mt-4 text-2xl font-extrabold sm:text-4xl">Admin dashboard</h1>
              <p className="mt-2 max-w-xl text-sm text-green-50/90 sm:text-base">
                Live sales, orders, customers and inventory from your store.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/admin/add-book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-green-700 shadow-lg transition hover:bg-green-50"
              >
                <FiPlusCircle />
                Add book
              </Link>
              <Link
                href="/dashboard/admin/books"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Manage books
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {loadError && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Dashboard data could not be fully loaded: {loadError}
        </div>
      )}

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} stat={s} delay={100 + i * 100} />
        ))}
      </section>

      {/* Revenue chart + category donut */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:gap-8">
        <Reveal delay={500}>
          <div className="h-full rounded-3xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Revenue overview</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {money(totalRevenue)}
                  </span>{" "}
                  from {rangeOrderCount.toLocaleString()} paid orders
                </p>
              </div>

              {/* Range tabs */}
              <div className="flex w-fit rounded-xl bg-slate-100 dark:bg-zinc-800 p-1">
                {ranges.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRange(r.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                      range === r.key
                        ? "bg-white text-green-700 shadow dark:bg-zinc-700 dark:text-green-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 h-72 w-full text-slate-200 dark:text-zinc-800 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {/* key makes the chart animate again when the range changes */}
                <AreaChart key={range} data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `৳${v >= 1000 ? v / 1000 + "k" : v}`}
                  />
                  <Tooltip content={<ChartTooltip money />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fill="url(#revGrad)"
                    activeDot={{ r: 6, strokeWidth: 3, stroke: "#fff" }}
                    animationDuration={1400}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal delay={600}>
          <div className="h-full rounded-3xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 shadow-sm sm:p-8">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Sales by category</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Share of total book sales</p>

            <div className="relative mx-auto mt-4 h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={100}
                    paddingAngle={4}
                    cornerRadius={6}
                    stroke="none"
                    animationDuration={1400}
                  >
                    {categoryData.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{categoryTotal ? "100%" : "—"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Paid sales</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {categoryData.length ? categoryData.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{c.value}%</span>
                </li>
              )) : <li className="text-sm text-slate-500 dark:text-slate-400">{orders === null ? "Loading category sales…" : emptyMessage}</li>}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Weekly orders + top books */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 sm:gap-8">
        <Reveal delay={700}>
          <div className="h-full rounded-3xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Orders this week</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Orders placed vs payments confirmed this week</p>
              </div>
              <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#cf6410]" /> Placed
                </span>
                  <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" /> Paid
                </span>
              </div>
            </div>

            <div className="mt-6 h-64 w-full text-slate-100 dark:text-zinc-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOrders} margin={{ top: 10, right: 5, left: -25, bottom: 0 }} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "currentColor", fillOpacity: 0.5 }} />
                  <Bar dataKey="placed" name="Placed" fill="#cf6410" radius={[8, 8, 0, 0]} animationDuration={1300} />
                  <Bar dataKey="paid" name="Paid" fill="#16a34a" radius={[8, 8, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal delay={800}>
          <div className="h-full rounded-3xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 shadow-sm sm:p-8">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Top selling books</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Copies in verified paid orders</p>

            <ul className="mt-6 space-y-5">
              {topBooks.length ? topBooks.map((b, i) => (
                <li key={b.title}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-sm font-extrabold text-slate-600 dark:text-slate-300">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{b.title}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{b.author}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-slate-900 dark:text-white">{b.sold}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-[#cf6410] transition-all duration-1000 ease-out"
                      style={{ width: `${(b.sold / maxSold) * 100}%` }}
                    />
                  </div>
                </li>
              )) : <li className="text-sm text-slate-500 dark:text-slate-400">{orders === null ? "Loading paid book sales…" : emptyMessage}</li>}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Recent orders + activity */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:gap-8">
        <Reveal delay={900}>
          <div className="h-full rounded-3xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent orders</h2>
              <Link
                href="/dashboard/admin/orders"
                className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline"
              >
                View all <FiArrowRight />
              </Link>
            </div>

            {/* Phones: one card per order */}
            <ul className="mt-5 space-y-3 sm:hidden">
              {recentOrders.length ? recentOrders.map((o) => (
                <li key={o.id} className="rounded-2xl border border-slate-100 p-4 dark:border-zinc-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-900 dark:text-white">{o.id}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{o.customer}</p>
                  <div className="mt-1 flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-slate-500 dark:text-slate-400">{o.book}</span>
                    <span className="shrink-0 font-bold text-slate-900 dark:text-white">{money(o.total)}</span>
                  </div>
                </li>
              )) : <li className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-700 dark:text-slate-400">{orders === null ? "Loading recent orders…" : emptyMessage}</li>}
            </ul>

            {/* Tablet and up: the table */}
            <div className="mt-5 hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Book</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-slate-50 dark:border-zinc-800 transition last:border-0 hover:bg-slate-50 dark:hover:bg-zinc-900">
                      <td className="py-4 font-semibold text-slate-900 dark:text-white">{o.id}</td>
                      <td className="py-4 text-slate-700 dark:text-slate-200">{o.customer}</td>
                      <td className="py-4 text-slate-500 dark:text-slate-400">{o.book}</td>
                      <td className="py-4 font-semibold text-slate-900 dark:text-white">{money(o.total)}</td>
                      <td className="py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!recentOrders.length && <tr><td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">{orders === null ? "Loading recent orders…" : emptyMessage}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1000}>
          <div className="h-full rounded-3xl border border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Inventory alerts</h2>
              <Link href="/dashboard/admin/books" className="text-sm font-semibold text-orange-700 hover:underline">Manage books</Link>
            </div>
            <ul className="mt-6 space-y-3">
              {stockAlerts.length ? stockAlerts.map((book) => {
                const quantity = Number(book.available_quantity);
                return <li key={book._id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3 dark:border-zinc-800">
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${quantity === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}><FiAlertTriangle /></span>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{book.title || "Untitled book"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{quantity === 0 ? "Out of stock" : `${quantity} ${quantity === 1 ? "copy" : "copies"} remaining`}</p></div>
                </li>;
              }) : <li className="text-sm text-slate-500 dark:text-slate-400">{books === null ? "Loading inventory…" : "No books at or below 5 copies."}</li>}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
