"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiBookOpen,
  FiUser,
  FiArrowRight,
  FiTruck,
  FiAlertCircle,
} from "react-icons/fi";

const money = (amount) => `৳${Number(amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const amountForOrder = (order) => {
  const savedTotal = Number(order?.totalAmount ?? order?.totalPrice);
  if (Number.isFinite(savedTotal) && savedTotal >= 0) return savedTotal;
  return Number(order?.price || 0) * Number(order?.quantity || 1) + Number(order?.deliveryCharge || 0);
};
const orderStatus = (order) => {
  if (order?.isPaid === true) return "Paid";
  const status = String(order?.paymentStatus || "").toLowerCase();
  if (["cancelled", "canceled"].includes(status)) return "Cancelled";
  if (["failed", "init_failed"].includes(status)) return "Failed";
  return "Pending";
};
const statusStyle = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
  Cancelled: "bg-slate-100 text-slate-700",
};
const formatDate = (date) => {
  const parsed = date ? new Date(date) : null;
  return parsed && !Number.isNaN(parsed.getTime())
    ? parsed.toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })
    : "—";
};
const orderIdentifier = (order) => String(order?.orderId || order?.transitionId || order?._id || "").slice(-12);

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] || "Reader";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (sessionPending) return;
    if (!user?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }
    let active = true;
    const loadOrders = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL;
        if (!apiBase) throw new Error("The order service is not configured.");
        const { data, error } = await authClient.token();
        if (error || !data?.token) throw new Error("Your session could not be verified. Please sign in again.");
        const base = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
        const response = await fetch(`${base}order/${encodeURIComponent(user.email)}`, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${data.token}` },
        });
        if (!response.ok) throw new Error("Could not load your order history.");
        const payload = await response.json();
        if (!Array.isArray(payload?.data)) throw new Error("The order history response was invalid.");
        if (active) {
          setOrders(payload.data.sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0)));
        }
      } catch (error) {
        if (active) setLoadError(error?.message || "Could not load your order history.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadOrders();
    return () => { active = false; };
  }, [sessionPending, user?.email]);

  const paidOrders = useMemo(() => orders.filter((order) => order.isPaid === true), [orders]);
  const pendingOrders = useMemo(() => orders.filter((order) => orderStatus(order) === "Pending"), [orders]);
  const totalSpent = paidOrders.reduce((sum, order) => sum + amountForOrder(order), 0);
  const recentOrders = orders.slice(0, 4);
  const latestOrder = orders[0];
  const stats = [
    { label: "Total orders", value: orders.length, icon: FiShoppingBag, color: "bg-blue-100 text-blue-600" },
    { label: "Paid orders", value: paidOrders.length, icon: FiCheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Awaiting payment", value: pendingOrders.length, icon: FiClock, color: "bg-amber-100 text-amber-600" },
    { label: "Total spent", value: money(totalSpent), icon: FiDollarSign, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-green-700 to-slate-900 p-6 text-white shadow-xl sm:p-10">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-red-500/30 blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl font-extrabold sm:text-4xl">Hi {firstName}, welcome back!</h1>
          <p className="mt-2 max-w-xl text-sm text-green-50/90 sm:text-base">
            Track your real orders, discover books and manage your account, all in one place.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/allBooks" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-green-700 shadow-lg transition hover:bg-green-50">
              <FiBookOpen /> Browse books
            </Link>
            <Link href="/dashboard/profile" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <FiUser /> Edit profile
            </Link>
          </div>
        </div>
      </section>

      {loadError && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle className="mt-0.5 shrink-0 text-xl" /> {loadError}
        </div>
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${color}`}><Icon /></span>
            <p className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">{loading ? "…" : value}</p>
            <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] sm:gap-8">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Recent orders</h2>
            <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline">View all <FiArrowRight /></Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3 font-semibold">Order</th><th className="pb-3 font-semibold">Book</th><th className="pb-3 font-semibold">Date</th><th className="pb-3 font-semibold">Total</th><th className="pb-3 font-semibold">Payment</th>
              </tr></thead>
              <tbody>
                {recentOrders.map((order) => {
                  const status = orderStatus(order);
                  return <tr key={order._id || order.orderId || order.transitionId} className="border-b border-slate-50 last:border-0">
                    <td className="py-4 font-semibold text-slate-900">{orderIdentifier(order)}</td>
                    <td className="py-4 text-slate-700">{order.bookTitle || "Book title unavailable"}</td>
                    <td className="py-4 text-slate-500">{formatDate(order.createdAt)}</td>
                    <td className="py-4 font-semibold text-slate-900">{money(amountForOrder(order))}</td>
                    <td className="py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[status]}`}>{status}</span></td>
                  </tr>;
                })}
                {!recentOrders.length && <tr><td colSpan={5} className="py-10 text-center text-slate-500">{loading ? "Loading your orders…" : loadError ? "Order data is unavailable." : "You have not placed an order yet."}</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900"><FiTruck className="text-green-600" /> Latest order</h2>
            {latestOrder ? <>
              <p className="mt-2 font-semibold text-slate-800">{latestOrder.bookTitle || "Book title unavailable"}</p>
              <p className="mt-1 text-sm text-slate-500">Order {orderIdentifier(latestOrder)} · {formatDate(latestOrder.createdAt)}</p>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="text-sm text-slate-600">Payment status</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[orderStatus(latestOrder)]}`}>{orderStatus(latestOrder)}</span>
              </div>
              <Link href="/dashboard/orders" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline">View order details <FiArrowRight /></Link>
            </> : <p className="mt-3 text-sm text-slate-500">{loading ? "Loading your latest order…" : "Your latest order will appear here."}</p>}
          </section>

          <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-8">
            <h2 className="text-lg font-extrabold">Find your next read</h2>
            <p className="mt-2 text-sm text-slate-300">Explore the current AS Books House catalogue and find a book for your learning journey.</p>
            <Link href="/allBooks" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#cf6410] px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">Explore books <FiArrowRight /></Link>
          </section>
        </div>
      </div>
    </div>
  );
}
