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
  Inbox,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { formatDistanceToNow } from "date-fns";

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  subjectLabel?: string;
  message: string;
  status: "new" | "in_progress" | "replied" | "closed";
  submittedAt: string;
  repliedAt?: string;
}

// Status configuration
const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  replied: {
    label: "Replied",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
};

// Subject labels for display
const subjectLabels: Record<string, string> = {
  general: "General Enquiry",
  order: "Order / Shipment",
  wholesale: "Wholesale / Bulk",
  partnership: "Partnership / Media",
  support: "Account / Support",
};

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    replied: 0,
    closed: 0,
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "contactSubmission"] | order(submittedAt desc) {
        _id,
        name,
        email,
        phone,
        subject,
        subjectLabel,
        message,
        status,
        submittedAt,
        repliedAt
      }`;

      const data = await client.fetch(query);
      setSubmissions(data);

      // Calculate stats
      setStats({
        total: data.length,
        new: data.filter((s: ContactSubmission) => s.status === "new").length,
        inProgress: data.filter(
          (s: ContactSubmission) => s.status === "in_progress",
        ).length,
        replied: data.filter((s: ContactSubmission) => s.status === "replied")
          .length,
        closed: data.filter((s: ContactSubmission) => s.status === "closed")
          .length,
      });
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig.new;
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.phone || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (subjectLabels[submission.subject] || submission.subject || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getTimeAgo = (date: string) => {
    try {
      if (!date) return "Unknown";
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getSubjectDisplay = (submission: ContactSubmission) => {
    if (submission.subjectLabel) return submission.subjectLabel;
    return (
      subjectLabels[submission.subject] ||
      submission.subject ||
      "General Enquiry"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light mb-2">
            Contact Submissions
          </h1>
          <p className="text-sm text-neutral-500">
            Manage and respond to customer inquiries from the contact form
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="flex items-center gap-2 px-4 py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1">{stats.total}</p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Total
          </p>
        </div>
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1 text-blue-600">{stats.new}</p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            New
          </p>
        </div>
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1 text-yellow-600">
            {stats.inProgress}
          </p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            In Progress
          </p>
        </div>
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1 text-green-600">
            {stats.replied}
          </p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Replied
          </p>
        </div>
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-3xl font-light mb-1 text-gray-600">
            {stats.closed}
          </p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Closed
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border border-neutral-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, subject, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:outline-none focus:border-black text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-neutral-200 focus:outline-none focus:border-black text-sm bg-white min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-20">
            <Inbox size={40} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">No submissions found</p>
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
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-wider">
                    Message Preview
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
                {filteredSubmissions.map((submission) => {
                  const statusConf = getStatusConfig(submission.status);
                  const StatusIcon = statusConf.icon;
                  const subjectDisplay = getSubjectDisplay(submission);

                  return (
                    <tr
                      key={submission._id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusConf.color}`}
                        >
                          <StatusIcon size={12} />
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium">{submission.name}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <a
                            href={`mailto:${submission.email}`}
                            className="text-sm text-black hover:underline flex items-center gap-1"
                          >
                            <Mail size={12} className="text-neutral-400" />
                            {submission.email}
                          </a>
                          {submission.phone && (
                            <a
                              href={`tel:${submission.phone}`}
                              className="text-sm text-black hover:underline flex items-center gap-1"
                            >
                              <Phone size={12} className="text-neutral-400" />
                              {submission.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium">
                          {subjectDisplay}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-neutral-600 truncate max-w-xs">
                          {submission.message.substring(0, 60)}
                          {submission.message.length > 60 ? "..." : ""}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm">
                          {getTimeAgo(submission.submittedAt)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/contact-submissions/${submission._id}`}
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
