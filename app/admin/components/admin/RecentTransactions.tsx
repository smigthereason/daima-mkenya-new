// components/admin/RecentTransactions.tsx
import { ArrowUpRight, ArrowDownLeft, Hash } from "lucide-react";
import Link from "next/link";

export default function RecentTransactions({ orders }: { orders: any[] }) {
  const recentOrders = orders.slice(0, 8);

  return (
    <div className="bg-white border border-neutral-100 overflow-hidden w-full">
      <div className="p-5 md:p-8 border-b border-neutral-100 flex justify-between items-end">
        <div>
          <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-black">
            Registry Logs
          </h3>
          <p className="text-[8px] md:text-[9px] text-neutral-400 uppercase tracking-widest font-bold mt-1">
            Live Transaction Feed
          </p>
        </div>
        <Link
          href="/admin/transactions"
          className="text-[9px] md:text-[10px] font-black text-black border-b border-black pb-0.5 uppercase tracking-widest hover:text-[#be1e2d] hover:border-[#be1e2d] transition-colors"
        >
          Archive
        </Link>
      </div>

      <div className="divide-y divide-neutral-50">
        {recentOrders.map((order: any) => (
          <div
            key={order._id}
            className="p-4 md:p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3 md:gap-5">
              <div
                className={`w-10 h-10 border flex items-center justify-center ${
                  order.paymentStatus === "paid"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-red-50 border-red-100 text-[#be1e2d]"
                }`}
              >
                {order.paymentStatus === "paid" ? (
                  <ArrowDownLeft size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
              </div>
              <div>
                <p className="text-xs md:text-sm font-black tracking-tight flex items-center gap-1">
                  <Hash size={10} className="text-neutral-300" />
                  {order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest hidden sm:block">
                  {new Date(order._createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs md:text-sm font-black tracking-tighter">
                KES {order.amount?.toLocaleString()}
              </p>
              <span
                className={`text-[8px] font-black px-1.5 py-0.5 border uppercase ${
                  order.paymentStatus === "paid"
                    ? "border-emerald-200 text-emerald-700"
                    : "border-red-200 text-[#be1e2d]"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
