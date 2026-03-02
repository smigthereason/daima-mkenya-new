// app/admin/orders/page.tsx
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { Package, CheckCircle } from "lucide-react";

async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await client.patch(id).set({ status }).commit();
  revalidatePath("/admin/orders");
}

export default async function OrderManagementPage() {
  const orders =
    await client.fetch(`*[_type == "order"] | order(_createdAt desc) {
    _id, orderNumber, status, paymentStatus, amount, _createdAt,
    "customer": customer { name, phone, city, address }
  }`);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-10 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="border-b border-neutral-100 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
            Order <span className="font-black">Management</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
            Track, fulfill, and update shipment status
          </p>
        </div>
      </div>

      {/* ── ORDERS LIST ── */}
      <div className="space-y-6">
        {orders.map((order: any) => {
          const isCompleted = order.status === "completed";

          return (
            <div
              key={order._id}
              className="bg-white border border-neutral-100 p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 group hover:border-neutral-200 transition-all"
            >
              {/* Order Info & Details Grid wrapper for alignment */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                {/* Order ID Section */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div
                    className={`p-3 md:p-4 ${isCompleted ? "bg-neutral-900 text-white" : "bg-neutral-50 text-neutral-400"}`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                      Order ID
                    </p>
                    <h3 className="font-black text-base md:text-lg text-neutral-900 tracking-tighter truncate max-w-[150px] md:max-w-none">
                      {order.orderNumber || order._id.slice(0, 8).toUpperCase()}
                    </h3>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:gap-6 flex-1 md:pl-6 md:border-l md:border-neutral-100">
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Customer
                    </p>
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {order.customer?.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-medium truncate">
                      {order.customer?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Destination
                    </p>
                    <p className="text-xs font-medium text-neutral-600 truncate">
                      {order.customer?.address}, {order.customer?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Total
                    </p>
                    <p className="text-xs font-black text-neutral-900 truncate">
                      KES {order.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Payment
                    </p>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 md:py-1 ${order.paymentStatus === "paid" ? "bg-neutral-900 text-white" : "bg-red-50 text-red-600"}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Form */}
              <form
                action={updateStatus}
                className="flex flex-col sm:flex-row items-stretch xl:items-center gap-3 xl:pl-6 xl:border-l xl:border-neutral-100"
              >
                <input type="hidden" name="id" value={order._id} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className="bg-neutral-50 border border-neutral-100 rounded-none text-[11px] font-bold p-4 md:p-3 xl:p-4 uppercase tracking-widest outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all cursor-pointer w-full sm:w-auto"
                >
                  <option value="pending">Processing</option>
                  <option value="completed">Shipped</option>
                  <option value="failed">Cancelled</option>
                </select>
                <button
                  type="submit"
                  className="bg-black text-white p-4 md:p-3 xl:p-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#be1e2d] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <CheckCircle size={14} /> Update
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
