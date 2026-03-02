// app/admin/page.tsx
import { client } from "@/sanity/lib/client";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  Fingerprint,
} from "lucide-react";
import RevenueChart from "../admin/components/admin/RevenueChart";
import CategoryPieChart from "../admin/components/admin/CategoryPieChart";
import RecentTransactions from "../admin/components/admin/RecentTransactions";

export default async function AdminOverview() {
  const orders = await client.fetch(
    `*[_type == "order"] | order(_createdAt desc) {
      _id, amount, status, paymentStatus, _createdAt,
      items[] { productName, quantity, price, product-> { category } }
    }`,
  );

  const users = await client.fetch(
    `*[_type == "user"] | order(_createdAt desc)`,
  );

  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === "paid")
    .reduce((a: number, b: any) => a + (b.amount || 0), 0);

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div className="space-y-12 md:space-y-20 animate-fadeIn pb-12 md:pb-24 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-neutral-100 pb-8 md:pb-12">
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 md:w-12 h-[1px] bg-[#be1e2d]"></span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-[#be1e2d] font-black">
              System Live
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tighter uppercase leading-[0.9] mb-2">
            Studio <span className="font-black">Intelligence</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium">
            Registry Index / 2026 Edition
          </p>
        </div>
        <div className="flex border-l border-neutral-100 pl-6 md:pl-8">
          <div>
            <span className="block text-[8px] md:text-[9px] uppercase tracking-widest text-neutral-400 font-black mb-1">
              Auth Level
            </span>
            <span className="text-xs md:text-sm font-black flex items-center gap-2 text-emerald-600">
              <Fingerprint size={14} /> SECURED
            </span>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-px bg-neutral-100 border border-neutral-100 overflow-hidden">
        <div className="lg:col-span-6 bg-white p-6 md:p-10">
          <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] mb-4">
            Gross Revenue
          </p>
          <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              KES {totalRevenue.toLocaleString()}
            </h2>
            <span className="text-emerald-600 text-[10px] font-black flex items-center gap-1 bg-emerald-50 px-2 py-1">
              <ArrowUpRight size={12} /> 12.5%
            </span>
          </div>
        </div>
        <div className="lg:col-span-3 bg-white p-6 md:p-10 border-t md:border-t-0 md:border-l border-neutral-100">
          <Users size={20} className="mb-4 text-neutral-300" />
          <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">
            Community
          </p>
          <h3 className="text-xl md:text-2xl font-black mt-1 uppercase">
            {users.length}{" "}
            <span className="text-xs font-light text-neutral-400">Users</span>
          </h3>
        </div>
        <div className="lg:col-span-3 bg-white p-6 md:p-10 border-t lg:border-t-0 lg:border-l border-neutral-100">
          <ShoppingCart size={20} className="mb-4 text-neutral-300" />
          <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">
            Orders
          </p>
          <h3 className="text-xl md:text-2xl font-black mt-1 uppercase">
            {orders.length}{" "}
            <span className="text-xs font-light text-neutral-400">Total</span>
          </h3>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16">
        <div className="xl:col-span-8 space-y-8">
          <div className="flex items-end justify-between">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">
              Revenue Progression
            </h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-[#be1e2d]"></div>
            </div>
          </div>
          <div className="bg-[#fcfcfc] border border-neutral-100 p-6 md:p-10">
            <RevenueChart orders={orders} />
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">
            Portfolio Split
          </h3>
          <div className="bg-white border border-neutral-100 p-8 md:p-12 flex flex-col items-center">
            <CategoryPieChart orders={orders} />
          </div>
          <div className="p-8 bg-white text-black flex justify-between items-center">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-black text-neutral-500 mb-1">
                Avg. Order Value
              </p>
              <p className="text-2xl font-black tracking-tight text-black uppercase">
                KES {avgOrderValue.toFixed(0).toLocaleString()}
              </p>
            </div>
            <TrendingUp size={20} className="text-[#be1e2d]" />
          </div>
        </div>
      </div>

      <section className="pt-8">
        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-10">
          Recent Logs
        </h3>
        <RecentTransactions orders={orders} />
      </section>
    </div>
  );
}
