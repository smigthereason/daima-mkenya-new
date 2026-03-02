// components/admin/TransactionTable.tsx
"use client";

import { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

export default function TransactionTable({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 10;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || order.paymentStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const exportToCSV = () => {
    const headers = [
      "Order #",
      "Customer",
      "Amount",
      "Status",
      "Method",
      "Date",
      "Transaction ID",
    ];
    const csvData = orders.map((o) => [
      o.orderNumber || "N/A",
      o.customer?.name || "N/A",
      `KES ${o.amount || 0}`,
      o.paymentStatus || "N/A",
      o.paymentMethod || "N/A",
      new Date(o._createdAt).toLocaleDateString(),
      o.transactionId || o.pesapalOrderTrackingId || "N/A",
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-none border border-neutral-100 shadow-sm overflow-hidden">
      {/* Table Header with Filters - Mobile stacked, Desktop inline */}
      <div className="p-4 md:p-6 border-b border-neutral-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 rounded-none text-xs border border-neutral-100 focus:ring-1 focus:ring-black outline-none sm:w-64 uppercase tracking-widest font-bold text-neutral-900"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-neutral-50 rounded-none text-xs border border-neutral-100 focus:ring-1 focus:ring-black outline-none uppercase tracking-widest font-bold text-neutral-900"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <button
            onClick={exportToCSV}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-none text-[10px] font-black hover:bg-neutral-800 transition-colors uppercase tracking-[0.2em]"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table Container - Enables Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px] md:min-w-full">
          <thead className="bg-neutral-50/50">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                Order #
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                Customer
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                Amount
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                Method
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                Transaction ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedOrders.map((order: any) => (
              <tr
                key={order._id}
                className="hover:bg-neutral-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs font-bold text-neutral-900">
                  {order.orderNumber || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-neutral-900 text-xs truncate max-w-[150px]">
                      {order.customer?.name || "N/A"}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold truncate max-w-[150px]">
                      {order.customer?.email || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 font-black text-neutral-900 text-xs whitespace-nowrap">
                  KES {order.amount?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest whitespace-nowrap ${
                      order.paymentStatus === "paid"
                        ? "bg-green-50 text-green-700"
                        : order.paymentStatus === "failed"
                          ? "bg-red-50 text-red-700"
                          : order.paymentStatus === "refunded"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {order.paymentStatus || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider whitespace-nowrap">
                  {order.paymentMethod || "N/A"}
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-neutral-500 whitespace-nowrap">
                  {new Date(order._createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-neutral-500">
                      {order.transactionId?.slice(0, 12) || "N/A"}
                    </span>
                    {order.paymentDetails?.confirmation_code && (
                      <span className="text-[8px] text-green-700 font-bold uppercase tracking-widest whitespace-nowrap">
                        Conf: {order.paymentDetails.confirmation_code}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Stacked on Mobile */}
      {totalPages > 1 && (
        <div className="px-4 md:px-6 py-4 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-50/30">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-none border border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-none border border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
