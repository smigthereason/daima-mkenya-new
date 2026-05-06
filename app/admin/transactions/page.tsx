// app/admin/transactions/page.tsx
import { client } from "@/sanity/lib/client";
import { CreditCard, ArrowUpRight } from "lucide-react";
import TransactionTable from "../components/transactions/TransactionTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TransactionsPage() {
  const orders = await client.fetch(
    `*[_type == "order"] | order(_createdAt desc) {
      _id,
      orderNumber,
      amount,
      paymentStatus,
      paymentMethod,
      paymentDate,
      transactionId,
      pesapalOrderTrackingId,
      paymentDetails,
      customer {
        name,
        email,
        phone
      },
      _createdAt
    }`,
  );

  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === "paid")
    .reduce((a: number, b: any) => a + (b.amount || 0), 0);

  const successfulTransactions = orders.filter(
    (o: any) => o.paymentStatus === "paid",
  ).length;

  const failedTransactions = orders.filter(
    (o: any) => o.paymentStatus === "unpaid" || o.paymentStatus === "failed",
  ).length;

  const pendingTransactions = orders.filter(
    (o: any) => o.paymentStatus === "pending" || !o.paymentStatus,
  ).length;

  return (
    <div className="max-w-[1700px] mx-auto space-y-12 md:space-y-20 animate-fadeIn pb-12 md:pb-24 px-4 sm:px-6 lg:px-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-neutral-100 pb-8 md:pb-12">
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 md:w-12 h-[1px] bg-[#be1e2d]"></span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-[#be1e2d] font-black">
              Financial Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tighter uppercase leading-[0.9] mb-2">
            Payment <span className="font-black">Transactions</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium">
            Monitor and manage all payment activities
          </p>
        </div>
        <div className="flex border-l border-neutral-100 pl-6 md:pl-8">
          <div>
            <span className="block text-[8px] md:text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
              Total Volume
            </span>
            <span className="text-sm md:text-base font-black flex items-center gap-2 text-emerald-600">
              KES {totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      {/* RESPONSIVE ADJUSTMENTS:
        - grid-cols-1: Mobile
        - sm:grid-cols-2: Tablets
        - lg:grid-cols-4: Laptop/Desktop
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 border border-neutral-100 overflow-hidden">
        {/* Total Revenue Card */}
        <div className="bg-white p-6 md:p-8 lg:p-10">
          <CreditCard size={24} className="mb-6 text-neutral-300" />
          <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] mb-2">
            Total Revenue
          </p>
          {/* FIX: Changed items-baseline to items-center and added flex-wrap to handle iPad space constraints */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter">
              KES {totalRevenue.toLocaleString()}
            </h3>
            <span className="text-emerald-600 text-[10px] font-black flex items-center gap-1 bg-emerald-50 px-2 py-1 shrink-0">
              <ArrowUpRight size={12} /> 100%
            </span>
          </div>
        </div>

        {/* Successful Card */}
        <div className="bg-white p-6 md:p-8 lg:p-10 border-t sm:border-t-0 sm:border-l border-neutral-100">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <span className="text-green-600 font-black text-xl">✓</span>
          </div>
          <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] mb-2">
            Successful
          </p>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter">
            {successfulTransactions}
          </h3>
          <p className="text-[8px] text-neutral-400 mt-2">
            {((successfulTransactions / orders.length) * 100 || 0).toFixed(1)}%
            of total
          </p>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 md:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-neutral-100">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-6">
            <span className="text-orange-600 font-black text-xl">⏳</span>
          </div>
          <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] mb-2">
            Pending
          </p>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter">
            {pendingTransactions}
          </h3>
          <p className="text-[8px] text-neutral-400 mt-2">
            Awaiting confirmation
          </p>
        </div>

        {/* Failed Card */}
        <div className="bg-white p-6 md:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-neutral-100">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <span className="text-[#be1e2d] font-black text-xl">✗</span>
          </div>
          <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] mb-2">
            Failed
          </p>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter">
            {failedTransactions}
          </h3>
          <p className="text-[8px] text-neutral-400 mt-2">Requires attention</p>
        </div>
      </div>

      {/* ── TRANSACTIONS TABLE ── */}
      <section className="pt-8">
        <div className="flex items-end justify-between mb-10">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em]">
            Transaction Ledger
          </h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-[#be1e2d]"></div>
            <div className="w-2 h-2 bg-[#006241]"></div>
          </div>
        </div>
        <TransactionTable orders={orders} />
      </section>
    </div>
  );
}
