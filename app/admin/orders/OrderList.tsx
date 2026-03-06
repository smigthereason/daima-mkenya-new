// // app/admin/orders/OrderList.tsx
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { Package, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// interface Order {
//   _id: string;
//   orderNumber?: string;
//   status: string;
//   paymentStatus: string;
//   amount: number;
//   customer?: {
//     name: string;
//     phone: string;
//     city: string;
//     address: string;
//   };
// }

// interface OrderListProps {
//   initialOrders: Order[];
// }

// export default function OrderList({ initialOrders }: OrderListProps) {
//   const [orders, setOrders] = useState<Order[]>(initialOrders);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // Use a ref to prevent incoming props from overwriting local state during an update
//   const isPendingUpdate = useRef(false);
//   const router = useRouter();

//   // Update local state when initialOrders changes, but ONLY if we aren't mid-update
//   useEffect(() => {
//     if (!isPendingUpdate.current) {
//       setOrders(initialOrders);
//     }
//   }, [initialOrders]);

//   async function handleUpdate(formData: FormData) {
//     const id = formData.get("id") as string;
//     const status = formData.get("status") as string;

//     const currentOrder = orders.find((o) => o._id === id);

//     if (currentOrder?.status === status) {
//       setSuccessMessage(`Status Updated`);
//       setTimeout(() => setSuccessMessage(null), 2000);
//       return;
//     }

//     const previousStatus = currentOrder?.status;

//     setUpdatingId(id);
//     setError(null);
//     setSuccessMessage(null);
//     isPendingUpdate.current = true; // Lock the state

//     // Optimistically update UI
//     setOrders((currentOrders) =>
//       currentOrders.map((order) =>
//         order._id === id ? { ...order, status } : order,
//       ),
//     );

//     try {
//       const response = await fetch("/api/admin/orders/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id, status }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       // Show success message
//       setSuccessMessage(`✅ Order updated to ${data.verifiedStatus}`);

//       // Force state to the verified status from server
//       setOrders((currentOrders) =>
//         currentOrders.map((order) =>
//           order._id === id ? { ...order, status: data.verifiedStatus } : order,
//         ),
//       );

//       // Refresh background data without resetting the lock yet
//       router.refresh();

//       // Hold the lock for 3 seconds to let Sanity CDN catch up
//       setTimeout(() => {
//         setSuccessMessage(null);
//         isPendingUpdate.current = false;
//       }, 3000);
//     } catch (error) {
//       console.error("❌ Update failed:", error);
//       isPendingUpdate.current = false; // Release lock on error

//       // Revert to previous status on error
//       setOrders((currentOrders) =>
//         currentOrders.map((order) =>
//           order._id === id
//             ? { ...order, status: previousStatus || order.status }
//             : order,
//         ),
//       );

//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to update order";
//       setError(errorMessage);
//     } finally {
//       setUpdatingId(null);
//     }
//   }

//   return (
//     <>
//       {successMessage && (
//         <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded flex items-center gap-2">
//           <CheckCircle size={18} className="text-green-500" />
//           {successMessage}
//         </div>
//       )}

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-center gap-3 text-red-700">
//           <AlertCircle size={20} />
//           <span className="text-sm font-medium">{error}</span>
//           <button
//             onClick={() => setError(null)}
//             className="ml-auto text-red-500 hover:text-red-700"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       <div className="space-y-6">
//         {orders.map((order) => {
//           const isCompleted = order.status === "completed";
//           const isUpdating = updatingId === order._id;

//           return (
//             <div
//               key={order._id}
//               className={`bg-white border border-neutral-100 p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 group hover:border-neutral-200 transition-all ${
//                 isUpdating ? "opacity-60" : ""
//               }`}
//             >
//               <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
//                 <div className="flex items-center gap-4 flex-shrink-0">
//                   <div
//                     className={`p-3 md:p-4 ${isCompleted ? "bg-neutral-900 text-white" : "bg-neutral-50 text-neutral-400"}`}
//                   >
//                     {isCompleted ? (
//                       <CheckCircle size={20} />
//                     ) : (
//                       <Package size={20} />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
//                       Order ID
//                     </p>
//                     <h3 className="font-black text-base md:text-lg text-neutral-900 tracking-tighter truncate max-w-[150px] md:max-w-none">
//                       {order.orderNumber || order._id.slice(0, 8).toUpperCase()}
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:gap-6 flex-1 md:pl-6 md:border-l md:border-neutral-100">
//                   <div>
//                     <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
//                       Customer
//                     </p>
//                     <p className="text-xs font-bold text-neutral-900 truncate">
//                       {order.customer?.name || "N/A"}
//                     </p>
//                     <p className="text-[10px] text-neutral-500 font-medium truncate">
//                       {order.customer?.phone || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
//                       Destination
//                     </p>
//                     <p className="text-xs font-medium text-neutral-600 truncate">
//                       {order.customer?.address
//                         ? `${order.customer.address}, ${order.customer.city}`
//                         : "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
//                       Total
//                     </p>
//                     <p className="text-xs font-black text-neutral-900 truncate">
//                       KES {order.amount?.toLocaleString() || "0"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-black text-neutral-400 uppercase mb-1 tracking-widest">
//                       Payment
//                     </p>
//                     <span
//                       className={`text-[9px] font-black uppercase px-2 py-0.5 md:py-1 ${
//                         order.paymentStatus === "paid"
//                           ? "bg-neutral-900 text-white"
//                           : "bg-red-50 text-red-600"
//                       }`}
//                     >
//                       {order.paymentStatus || "unpaid"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <form
//                 action={handleUpdate}
//                 className="flex flex-col sm:flex-row items-stretch xl:items-center gap-3 xl:pl-6 xl:border-l xl:border-neutral-100"
//               >
//                 <input type="hidden" name="id" value={order._id} />
//                 <select
//                   name="status"
//                   value={order.status}
//                   onChange={(e) => {
//                     const newVal = e.target.value;
//                     setOrders((prev) =>
//                       prev.map((o) =>
//                         o._id === order._id ? { ...o, status: newVal } : o,
//                       ),
//                     );
//                   }}
//                   disabled={isUpdating}
//                   className="bg-neutral-50 border border-neutral-100 rounded-none text-[11px] font-bold p-4 md:p-3 xl:p-4 uppercase tracking-widest outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all cursor-pointer w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <option value="pending">Processing</option>
//                   <option value="completed">Shipped</option>
//                   <option value="failed">Cancelled</option>
//                 </select>
//                 <button
//                   type="submit"
//                   disabled={isUpdating}
//                   className="bg-black text-white p-4 md:p-3 xl:p-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#be1e2d] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
//                 >
//                   {isUpdating ? (
//                     <span className="flex items-center gap-2">
//                       <Loader2 size={14} className="animate-spin" />
//                       Updating...
//                     </span>
//                   ) : (
//                     <>
//                       <CheckCircle size={14} /> Update
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           );
//         })}

//         {orders.length === 0 && (
//           <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
//             <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
//             <p className="text-neutral-500 text-sm font-medium">
//               No orders found
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
// app/admin/orders/OrderList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle,
  Loader2,
  MapPin,
  Truck,
  Package2,
} from "lucide-react";
import { updateOrderStatus } from "./actions";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  status: string;
  paymentStatus: string;
  amount: number;
  shippingFee?: number;
  _createdAt: string;
  customer?: {
    name: string;
    phone: string;
    email: string;
  };
  deliveryDetails?: {
    method: "shipping" | "pickup";
    city: string;
    pickupStationName?: string;
    pickupStationId?: string;
    shippingAddress?: string;
  };
  items?: OrderItem[];
  paymentMethod?: string;
  paymentDate?: string;
  pesapalOrderTrackingId?: string;
  transactionId?: string;
}

export default function OrderList({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpdate(formData: FormData) {
    const id = formData.get("id") as string;
    setUpdatingId(id);
    const result = await updateOrderStatus(formData);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, status: formData.get("status") as string } : o,
        ),
      );
      router.refresh();
    }
    setUpdatingId(null);
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "🟢";
      case "pending":
        return "🟡";
      case "failed":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-neutral-200 p-6 flex flex-col gap-6 hover:shadow-md transition-shadow"
        >
          {/* Header with Order ID and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1.5">
                {order.orderNumber || "NO-ID"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border flex items-center gap-1">
                <span>{getStatusIcon(order.status)}</span>
                {order.status}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-neutral-400 uppercase font-bold">
                Payment Method
              </p>
              <p className="text-xs font-bold uppercase">
                {order.paymentMethod || "N/A"}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Customer & Delivery */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <p className="text-[9px] text-neutral-400 uppercase font-bold mb-2 flex items-center gap-1">
                  <Package2 size={12} /> CUSTOMER DETAILS
                </p>
                <div className="bg-neutral-50 p-4 space-y-2">
                  <p className="text-sm font-bold uppercase">
                    {order.customer?.name || "N/A"}
                  </p>
                  <p className="text-xs text-neutral-600">
                    📞 {order.customer?.phone || "N/A"}
                  </p>
                  <p className="text-xs text-neutral-600">
                    ✉️ {order.customer?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <p className="text-[9px] text-neutral-400 uppercase font-bold mb-2 flex items-center gap-1">
                  {order.deliveryDetails?.method === "pickup" ? (
                    <>
                      <MapPin size={12} /> PICKUP INFORMATION
                    </>
                  ) : (
                    <>
                      <Truck size={12} /> DELIVERY INFORMATION
                    </>
                  )}
                </p>
                <div className="bg-neutral-50 p-4">
                  {order.deliveryDetails ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        {order.deliveryDetails.method === "pickup" ? (
                          <MapPin
                            size={16}
                            className="text-blue-600 shrink-0 mt-0.5"
                          />
                        ) : (
                          <Truck
                            size={16}
                            className="text-neutral-800 shrink-0 mt-0.5"
                          />
                        )}
                        <div>
                          <p className="text-xs font-bold uppercase">
                            {order.deliveryDetails.method === "pickup"
                              ? "PICKUP STATION"
                              : "HOME DELIVERY"}
                          </p>
                          {order.deliveryDetails.method === "pickup" && (
                            <>
                              <p className="text-sm font-medium mt-1">
                                {order.deliveryDetails.pickupStationName ||
                                  "Not specified"}
                              </p>
                              <p className="text-xs text-neutral-600">
                                Station ID:{" "}
                                {order.deliveryDetails.pickupStationId || "N/A"}
                              </p>
                            </>
                          )}
                          <p className="text-xs text-neutral-600 mt-1">
                            📍 {order.deliveryDetails.city || "Nairobi"} County
                          </p>
                          {order.deliveryDetails.shippingAddress && (
                            <p className="text-xs text-neutral-600 mt-1">
                              🏢 {order.deliveryDetails.shippingAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">
                      No delivery details provided
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Items & Payment */}
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <p className="text-[9px] text-neutral-400 uppercase font-bold mb-2 flex items-center gap-1">
                  <Package size={12} /> ORDER ITEMS ({order.items?.length || 0})
                </p>
                <div className="bg-neutral-50 p-4">
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="border-b border-neutral-200 pb-2 last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold">
                                {item.productName}
                              </p>
                              <div className="flex gap-3 mt-1 text-xs text-neutral-600">
                                <span>Size: {item.size}</span>
                                <span>Color: {item.color}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">
                                Ksh{" "}
                                {item.price?.toLocaleString?.() || item.price}
                              </p>
                              <p className="text-xs text-neutral-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">No items found</p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <p className="text-[9px] text-neutral-400 uppercase font-bold mb-2">
                  PAYMENT SUMMARY
                </p>
                <div className="bg-neutral-50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal:</span>
                    <span className="font-bold">
                      Ksh{" "}
                      {(
                        order.amount - (order.shippingFee || 0)
                      ).toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping:</span>
                    <span className="font-bold">
                      Ksh {order.shippingFee?.toLocaleString?.() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black pt-2 border-t border-neutral-200">
                    <span>TOTAL:</span>
                    <span>
                      Ksh {order.amount?.toLocaleString?.() || 0}{" "}
                      {/* Use amount directly - it already includes shipping */}
                    </span>
                  </div>

                  {/* Tracking Info */}
                  {(order.pesapalOrderTrackingId || order.transactionId) && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 text-[10px]">
                      {order.pesapalOrderTrackingId && (
                        <p>PesaPal ID: {order.pesapalOrderTrackingId}</p>
                      )}
                      {order.transactionId && (
                        <p>Transaction ID: {order.transactionId}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Status Update Form */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-neutral-100">
            <form action={handleUpdate} className="flex gap-2 w-full sm:w-auto">
              <input type="hidden" name="id" value={order._id} />
              <select
                name="status"
                defaultValue={order.status}
                className="bg-white border border-neutral-200 text-[11px] font-bold uppercase p-3 outline-none focus:border-black min-w-[150px]"
              >
                <option value="pending">Processing</option>
                <option value="completed">Shipped/Ready</option>
                <option value="failed">Cancelled</option>
              </select>
              <button
                type="submit"
                disabled={updatingId === order._id}
                className="bg-black text-white px-6 py-3 text-[11px] font-bold uppercase hover:bg-[#be1e2d] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {updatingId === order._id ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Update
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
          <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <p className="text-neutral-500 text-sm font-medium">
            No orders found
          </p>
        </div>
      )}
    </div>
  );
}
