"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Mail,
  RefreshCw,
  Phone,
  DollarSign,
  Users,
  Inbox,
  ChevronDown,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { formatDistanceToNow } from "date-fns";

interface Inquiry {
  _id: string;
  inquiryNumber: string;
  pieceName: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
  quotedPrice?: string;
}

// Status configuration with safe defaults
const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  reviewing: {
    label: "Reviewing",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  quoted: {
    label: "Quote Sent",
    color: "bg-purple-100 text-purple-800",
    icon: Mail,
  },
  followup: {
    label: "Follow-up",
    color: "bg-orange-100 text-orange-800",
    icon: RefreshCw,
  },
  converted: {
    label: "Converted",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
};

// Priority configuration with safe defaults
const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "bg-red-100 text-red-800" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  low: { label: "Low", color: "bg-green-100 text-green-800" },
};

// Default config for unknown status/priority
const defaultStatusConfig = {
  label: "Unknown",
  color: "bg-gray-100 text-gray-800",
  icon: AlertCircle,
};
const defaultPriorityConfig = {
  label: "Unknown",
  color: "bg-gray-100 text-gray-800",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    converted: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "priceInquiry"] | order(createdAt desc) {
        _id,
        inquiryNumber,
        pieceName,
        customer,
        status,
        priority,
        createdAt,
        assignedTo,
        quotedPrice
      }`;

      const data = await client.fetch(query);
      console.log("Fetched inquiries:", data); // Debug log
      setInquiries(data);

      // Calculate stats safely
      setStats({
        total: data.length,
        new: data.filter((i: Inquiry) => i.status === "new").length,
        converted: data.filter((i: Inquiry) => i.status === "converted").length,
        pending: data.filter((i: Inquiry) =>
          ["new", "reviewing", "followup"].includes(i?.status || ""),
        ).length,
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safe function to get status config
  const getStatusConfig = (status: string) => {
    return statusConfig[status] || defaultStatusConfig;
  };

  // Safe function to get priority config
  const getPriorityConfig = (priority: string) => {
    return priorityConfig[priority] || defaultPriorityConfig;
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    // Safely access properties with fallbacks
    const customerName = inquiry.customer?.name || "";
    const customerEmail = inquiry.customer?.email || "";
    const pieceName = inquiry.pieceName || "";
    const inquiryNumber = inquiry.inquiryNumber || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pieceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiryNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || inquiry.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTimeAgo = (date: string) => {
    try {
      if (!date) return "Unknown";
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light mb-2">
            Price Inquiries
          </h1>
          <p className="text-sm text-neutral-500">
            Manage and respond to client inquiries for one-off pieces
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="flex items-center gap-2 px-4 py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1">{stats.total}</p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Total Inquiries
          </p>
        </div>
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1 text-blue-600">{stats.new}</p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            New
          </p>
        </div>
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1 text-orange-600">
            {stats.pending}
          </p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Pending
          </p>
        </div>
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1 text-green-600">
            {stats.converted}
          </p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Converted
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border border-neutral-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, piece, or inquiry number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:outline-none focus:border-black text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Status Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-3 border border-neutral-200 focus:outline-none focus:border-black text-sm bg-white min-w-[140px] appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="quoted">Quote Sent</option>
                <option value="followup">Follow-up</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-900 pointer-events-none"
              />
            </div>

            {/* Priority Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full sm:w-auto pl-4 pr-10 py-3 border border-neutral-200 focus:outline-none focus:border-black text-sm bg-white min-w-[140px] appearance-none cursor-pointer"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-900 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-20">
            <Inbox size={40} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">No inquiries found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-black underline mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Inquiry #
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Piece
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Received
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredInquiries.map((inquiry) => {
                  // Get configs safely
                  const statusConf = getStatusConfig(inquiry.status);
                  const priorityConf = getPriorityConfig(inquiry.priority);
                  const StatusIcon = statusConf.icon;

                  return (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm font-mono">
                          {inquiry.inquiryNumber || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium">
                            {inquiry.customer?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {inquiry.customer?.email || "No email"}
                          </p>
                          {inquiry.customer?.phone && (
                            <p className="text-xs text-neutral-400 mt-1">
                              {inquiry.customer.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm">
                          {inquiry.pieceName || "Unknown piece"}
                        </p>
                        {inquiry.quotedPrice && (
                          <p className="text-xs text-green-600 mt-1">
                            Quoted: {inquiry.quotedPrice}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusConf.color}`}
                        >
                          <StatusIcon size={12} />
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${priorityConf.color}`}
                        >
                          {priorityConf.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm">
                          {getTimeAgo(inquiry.createdAt)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/inquiries/${inquiry._id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors"
                        >
                          View Details
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
