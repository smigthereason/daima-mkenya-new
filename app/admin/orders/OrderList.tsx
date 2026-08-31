// app/admin/orders/OrderList.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle,
  Loader2,
  MapPin,
  Truck,
  Package2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Mail,
} from "lucide-react";
import { sendOrderInvoice, updateOrderStatus } from "./actions";

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
    additionalInfo?: string;
  };
  items?: OrderItem[];
  paymentMethod?: string;
  paymentDate?: string;
  pesapalOrderTrackingId?: string;
  transactionId?: string;
  invoiceSentAt?: string;
  invoiceEmailId?: string;
}

const PAGE_SIZE = 10;

export default function OrderList({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);
  const [invoiceFeedback, setInvoiceFeedback] = useState<Record<string, { type: "success" | "error"; message: string }>>({});
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((order) => {
        return (
          order.orderNumber?.toLowerCase().includes(q) ||
          order.customer?.name?.toLowerCase().includes(q) ||
          order.customer?.email?.toLowerCase().includes(q) ||
          order.customer?.phone?.toLowerCase().includes(q) ||
          order.pesapalOrderTrackingId?.toLowerCase().includes(q) ||
          order.transactionId?.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((order) => order.paymentStatus === paymentFilter);
    }

    return result;
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const updateSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };
  const updateStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };
  const updatePaymentFilter = (value: string) => {
    setPaymentFilter(value);
    setPage(1);
  };

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

  async function handleSendInvoice(order: Order) {
    if (!order.customer?.email) {
      setInvoiceFeedback((prev) => ({
        ...prev,
        [order._id]: { type: "error", message: "Customer email is missing." },
      }));
      return;
    }

    const action = order.invoiceSentAt ? "resend" : "send";
    const confirmed = window.confirm(
      `${action === "resend" ? "Resend" : "Send"} invoice ${order.orderNumber || ""} to ${order.customer.email}?`,
    );
    if (!confirmed) return;

    setSendingInvoiceId(order._id);
    setInvoiceFeedback((prev) => {
      const next = { ...prev };
      delete next[order._id];
      return next;
    });

    const result = await sendOrderInvoice(order._id);

    if (result.success && result.sentAt) {
      setOrders((prev) =>
        prev.map((existing) =>
          existing._id === order._id
            ? {
                ...existing,
                invoiceSentAt: result.sentAt,
                invoiceEmailId: result.emailId,
              }
            : existing,
        ),
      );
      setInvoiceFeedback((prev) => ({
        ...prev,
        [order._id]: {
          type: "success",
          message: `Invoice sent to ${result.recipient}.`,
        },
      }));
      router.refresh();
    } else {
      setInvoiceFeedback((prev) => ({
        ...prev,
        [order._id]: {
          type: "error",
          message: result.error || "Failed to send invoice.",
        },
      }));
    }

    setSendingInvoiceId(null);
  }

  const formatOrderDate = (value: string) =>
    new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Nairobi",
    }).format(new Date(value));

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
      {/* ── SEARCH + FILTER BAR ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by order #, customer name, email, phone, or transaction ID..."
            className="w-full pl-11 pr-4 py-3 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => updateSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => updateStatusFilter(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-3 border border-neutral-200 bg-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-black cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Processing</option>
            <option value="completed">Shipped/Ready</option>
            <option value="failed">Cancelled</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-900"
          />
        </div>

        {/* Payment Filter Dropdown */}
        <div className="relative sm:w-48">
          <select
            value={paymentFilter}
            onChange={(e) => updatePaymentFilter(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-3 border border-neutral-200 bg-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-black cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Payment Pending</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-900"
          />
        </div>
      </div>

      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
        Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
        –{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of{" "}
        {filteredOrders.length} orders
      </p>

      {filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
          <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <p className="text-neutral-500 text-sm font-medium">
            No orders match your search
          </p>
        </div>
      )}

      {paginatedOrders.map((order) => (
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
            <div className="flex flex-col sm:items-end gap-2">
              <div className="text-left sm:text-right">
                <p className="text-[9px] text-neutral-400 uppercase font-bold flex items-center sm:justify-end gap-1">
                  <CalendarDays size={11} /> Order Date
                </p>
                <p className="text-xs font-bold">
                  {formatOrderDate(order._createdAt)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[9px] text-neutral-400 uppercase font-bold">
                  Payment Method
                </p>
                <p className="text-xs font-bold uppercase">
                  {order.paymentMethod || "N/A"}
                </p>
              </div>
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
                          {order.deliveryDetails.additionalInfo && (
                            <p className="text-xs text-neutral-600 mt-1">
                              📝 {order.deliveryDetails.additionalInfo}
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
                      Ksh {order.amount?.toLocaleString?.() || 0}
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

          {/* Footer - Invoice + Status Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
            {invoiceFeedback[order._id] && (
              <div
                className={`text-xs px-4 py-3 border ${
                  invoiceFeedback[order._id].type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {invoiceFeedback[order._id].message}
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSendInvoice(order)}
                  disabled={sendingInvoiceId === order._id || !order.customer?.email}
                  className="border border-black bg-white text-black px-5 py-3 text-[11px] font-bold uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingInvoiceId === order._id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending Invoice...
                    </>
                  ) : (
                    <>
                      <Mail size={14} />
                      {order.invoiceSentAt ? "Resend Invoice" : "Send Invoice"}
                    </>
                  )}
                </button>

                {order.invoiceSentAt && (
                  <p className="text-[10px] text-neutral-500">
                    Last sent {formatOrderDate(order.invoiceSentAt)}
                  </p>
                )}
              </div>

              <form action={handleUpdate} className="flex gap-2 w-full lg:w-auto">
              <input type="hidden" name="id" value={order._id} />

              {/* Individual Item Status Select */}
              <div className="relative min-w-[150px]">
                <select
                  name="status"
                  defaultValue={order.status}
                  className="w-full appearance-none pl-3 pr-8 py-3 border border-neutral-200 bg-white text-[11px] font-bold uppercase outline-none focus:border-black cursor-pointer"
                >
                  <option value="pending">Processing</option>
                  <option value="completed">Shipped/Ready</option>
                  <option value="failed">Cancelled</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
                />
              </div>

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
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2.5 border border-neutral-200 text-[10px] font-black uppercase tracking-widest hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2.5 border border-neutral-200 text-[10px] font-black uppercase tracking-widest hover:border-black disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
