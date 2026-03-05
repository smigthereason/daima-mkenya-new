// app/admin/orders/OrderList.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Package, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface Order {
  _id: string;
  orderNumber?: string;
  status: string;
  paymentStatus: string;
  amount: number;
  customer?: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
}

interface OrderListProps {
  initialOrders: Order[];
}

export default function OrderList({ initialOrders }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use a ref to prevent incoming props from overwriting local state during an update
  const isPendingUpdate = useRef(false);
  const router = useRouter();

  // Update local state when initialOrders changes, but ONLY if we aren't mid-update
  useEffect(() => {
    if (!isPendingUpdate.current) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  async function handleUpdate(formData: FormData) {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;

    const currentOrder = orders.find((o) => o._id === id);

    if (currentOrder?.status === status) {
      setSuccessMessage(`Status Updated`);
      setTimeout(() => setSuccessMessage(null), 2000);
      return;
    }

    const previousStatus = currentOrder?.status;

    setUpdatingId(id);
    setError(null);
    setSuccessMessage(null);
    isPendingUpdate.current = true; // Lock the state

    // Optimistically update UI
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === id ? { ...order, status } : order,
      ),
    );

    try {
      const response = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Show success message
      setSuccessMessage(`✅ Order updated to ${data.verifiedStatus}`);

      // Force state to the verified status from server
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id ? { ...order, status: data.verifiedStatus } : order,
        ),
      );

      // Refresh background data without resetting the lock yet
      router.refresh();

      // Hold the lock for 3 seconds to let Sanity CDN catch up
      setTimeout(() => {
        setSuccessMessage(null);
        isPendingUpdate.current = false;
      }, 3000);
    } catch (error) {
      console.error("❌ Update failed:", error);
      isPendingUpdate.current = false; // Release lock on error

      // Revert to previous status on error
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id
            ? { ...order, status: previousStatus || order.status }
            : order,
        ),
      );

      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      setError(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => {
          const isCompleted = order.status === "completed";
          const isUpdating = updatingId === order._id;

          return (
            <div
              key={order._id}
              className={`bg-white border border-neutral-100 p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 group hover:border-neutral-200 transition-all ${
                isUpdating ? "opacity-60" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
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

                <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:gap-6 flex-1 md:pl-6 md:border-l md:border-neutral-100">
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Customer
                    </p>
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {order.customer?.name || "N/A"}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-medium truncate">
                      {order.customer?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Destination
                    </p>
                    <p className="text-xs font-medium text-neutral-600 truncate">
                      {order.customer?.address
                        ? `${order.customer.address}, ${order.customer.city}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Total
                    </p>
                    <p className="text-xs font-black text-neutral-900 truncate">
                      KES {order.amount?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
                      Payment
                    </p>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 md:py-1 ${
                        order.paymentStatus === "paid"
                          ? "bg-neutral-900 text-white"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {order.paymentStatus || "unpaid"}
                    </span>
                  </div>
                </div>
              </div>

              <form
                action={handleUpdate}
                className="flex flex-col sm:flex-row items-stretch xl:items-center gap-3 xl:pl-6 xl:border-l xl:border-neutral-100"
              >
                <input type="hidden" name="id" value={order._id} />
                <select
                  name="status"
                  value={order.status}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setOrders((prev) =>
                      prev.map((o) =>
                        o._id === order._id ? { ...o, status: newVal } : o,
                      ),
                    );
                  }}
                  disabled={isUpdating}
                  className="bg-neutral-50 border border-neutral-100 rounded-none text-[11px] font-bold p-4 md:p-3 xl:p-4 uppercase tracking-widest outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all cursor-pointer w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Processing</option>
                  <option value="completed">Shipped</option>
                  <option value="failed">Cancelled</option>
                </select>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-black text-white p-4 md:p-3 xl:p-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#be1e2d] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    <>
                      <CheckCircle size={14} /> Update
                    </>
                  )}
                </button>
              </form>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
            <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <p className="text-neutral-500 text-sm font-medium">
              No orders found
            </p>
          </div>
        )}
      </div>
    </>
  );
}
