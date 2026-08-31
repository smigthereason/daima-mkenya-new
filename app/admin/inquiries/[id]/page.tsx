"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Send,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Save,
  MessageSquare,
  Calendar,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { format } from "date-fns";

interface Inquiry {
  _id: string;
  inquiryNumber: string;
  piece?: { _ref: string };
  pieceName: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
  status: string;
  priority: string;
  inquirySource: string;
  quotedPrice?: string;
  currency?: string;
  assignedTo?: string;
  internalNotes?: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  communicationLog?: Array<{
    type: string;
    date: string;
    summary: string;
    followupDate?: string;
    handledBy?: string;
  }>;
  createdAt: string;
  lastUpdated: string;
}

// Configuration with safe defaults
const statusOptions = [
  { value: "new", label: "New", icon: AlertCircle, color: "blue" },
  { value: "reviewing", label: "Reviewing", icon: Clock, color: "yellow" },
  { value: "quoted", label: "Quote Sent", icon: Mail, color: "purple" },
  { value: "followup", label: "Follow-up", icon: RefreshCw, color: "orange" },
  { value: "converted", label: "Converted", icon: CheckCircle, color: "green" },
  { value: "closed", label: "Closed", icon: XCircle, color: "gray" },
];

const priorityOptions = [
  { value: "high", label: "High", color: "red" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "low", label: "Low", color: "green" },
];

const communicationTypes = [
  { value: "email_sent", label: "📧 Email Sent" },
  { value: "email_received", label: "📨 Email Received" },
  { value: "phone_call", label: "📞 Phone Call" },
  { value: "whatsapp", label: "💬 WhatsApp" },
  { value: "meeting", label: "👥 Meeting" },
  { value: "sms", label: "✉️ SMS" },
];

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newCommunication, setNewCommunication] = useState({
    type: "email_sent",
    summary: "",
    followupDate: "",
  });
  const [showCommsForm, setShowCommsForm] = useState(false);
  const [replyEmail, setReplyEmail] = useState({
    subject: "",
    message: "",
    includePrice: false,
  });
  const [emailSent, setEmailSent] = useState(false);

  // Local state for editable fields
  const [editableAssignedTo, setEditableAssignedTo] = useState("");
  const [editableQuotedPrice, setEditableQuotedPrice] = useState("");
  const [editableCurrency, setEditableCurrency] = useState("KES");
  const [isEditingAssignedTo, setIsEditingAssignedTo] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchInquiry();
    }
  }, [params.id]);

  // Update local state when inquiry data loads and set default email subject
  useEffect(() => {
    if (inquiry) {
      setEditableAssignedTo(inquiry.assignedTo || "");
      setEditableQuotedPrice(inquiry.quotedPrice || "");
      setEditableCurrency(inquiry.currency || "KES");

      // Auto-populate email subject
      setReplyEmail((prev) => ({
        ...prev,
        subject: `Inquiry about ${inquiry.pieceName || "your piece"} - ${inquiry.inquiryNumber || ""}`,
      }));
    }
  }, [inquiry]);

  const fetchInquiry = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "priceInquiry" && _id == $id][0] {
        _id,
        inquiryNumber,
        piece,
        pieceName,
        customer,
        status,
        priority,
        inquirySource,
        quotedPrice,
        currency,
        assignedTo,
        internalNotes,
        communicationLog,
        createdAt,
        lastUpdated
      }`;

      const data = await client.fetch(query, { id: params.id });
      setInquiry(data);
    } catch (error) {
      console.error("Error fetching inquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiry = async (
    updates: Partial<Inquiry>,
    fieldName?: string,
  ) => {
    if (fieldName) {
      setSavingField(fieldName);
    }

    try {
      const response = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: params.id,
          updates,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state with the response data without page refresh
        setInquiry((prev) => (prev ? { ...prev, ...updates } : prev));

        if (fieldName === "assignedTo") {
          setIsEditingAssignedTo(false);
        }
        if (fieldName === "quotedPrice" || fieldName === "currency") {
          setIsEditingPrice(false);
        }
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
    } finally {
      setSavingField(null);
    }
  };

  const handleAssignedToSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    updateInquiry({ assignedTo: editableAssignedTo }, "assignedTo");
  };

  const handlePriceSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    updateInquiry(
      {
        quotedPrice: editableQuotedPrice,
        currency: editableCurrency,
      },
      "price",
    );
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    // Optimistically update UI
    setInquiry((prev) => (prev ? { ...prev, status: value } : prev));
    updateInquiry({ status: value }, "status");
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    // Optimistically update UI
    setInquiry((prev) => (prev ? { ...prev, priority: value } : prev));
    updateInquiry({ priority: value }, "priority");
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditableCurrency(value);
  };

  const addNote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    if (!newNote.trim()) return;

    const note = {
      note: newNote,
      addedBy: "Admin",
      addedAt: new Date().toISOString(),
    };

    const updatedNotes = [...(inquiry?.internalNotes || []), note];
    setSavingField("note");

    try {
      const response = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: params.id,
          updates: { internalNotes: updatedNotes },
        }),
      });

      if (response.ok) {
        setInquiry((prev) =>
          prev ? { ...prev, internalNotes: updatedNotes } : prev,
        );
        setNewNote("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setSavingField(null);
    }
  };

  const addCommunication = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    if (!newCommunication.summary.trim()) return;

    const comm = {
      type: newCommunication.type,
      date: new Date().toISOString(),
      summary: newCommunication.summary,
      followupDate: newCommunication.followupDate || undefined,
      handledBy: "Admin",
    };

    const updatedComms = [...(inquiry?.communicationLog || []), comm];
    setSavingField("communication");

    try {
      const response = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: params.id,
          updates: { communicationLog: updatedComms },
        }),
      });

      if (response.ok) {
        setInquiry((prev) =>
          prev ? { ...prev, communicationLog: updatedComms } : prev,
        );
        setNewCommunication({
          type: "email_sent",
          summary: "",
          followupDate: "",
        });
        setShowCommsForm(false);
      }
    } catch (error) {
      console.error("Error adding communication:", error);
    } finally {
      setSavingField(null);
    }
  };

  const sendEmailReply = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    if (!replyEmail.subject || !replyEmail.message) return;

    setSavingField("email");

    // Add to communication log
    const comm = {
      type: "email_sent",
      date: new Date().toISOString(),
      summary: `Subject: ${replyEmail.subject}\n\n${replyEmail.message}`,
      handledBy: "Admin",
    };

    const updatedComms = [...(inquiry?.communicationLog || []), comm];

    try {
      const quotedPriceLine =
        replyEmail.includePrice && inquiry?.quotedPrice
          ? `\n\nQuoted price: ${inquiry.currency || "KES"} ${inquiry.quotedPrice}`
          : "";

      const emailResponse = await fetch("/api/contact/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: inquiry?.customer?.email,
          name: inquiry?.customer?.name,
          subject: replyEmail.subject,
          message: `${replyEmail.message}${quotedPriceLine}`,
          originalMessage: inquiry?.customer?.message || "",
        }),
      });

      if (!emailResponse.ok) {
        const result = await emailResponse.json().catch(() => null);
        throw new Error(result?.error || "Failed to send email");
      }

      // Log the communication only after SMTP confirms the message was accepted.
      const response = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: params.id,
          updates: { communicationLog: updatedComms },
        }),
      });

      if (!response.ok) {
        throw new Error("Email sent, but the communication log could not be updated");
      }

      setInquiry((prev) =>
        prev ? { ...prev, communicationLog: updatedComms } : prev,
      );
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);

      setReplyEmail((prev) => ({
        ...prev,
        message: "",
        includePrice: false,
      }));
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSavingField(null);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditingAssignedTo(false);
    setEditableAssignedTo(inquiry?.assignedTo || "");
  };

  const handleCancelPriceEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditingPrice(false);
    setEditableQuotedPrice(inquiry?.quotedPrice || "");
    setEditableCurrency(inquiry?.currency || "KES");
  };

  // Helper function to get status config safely
  const getStatusConfig = (status: string) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Inquiry not found</p>
        <Link
          href="/admin/inquiries"
          className="text-black underline mt-4 block"
        >
          Back to Inquiries
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(inquiry.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/inquiries"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-light">
                {inquiry.inquiryNumber || "Unknown"}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
              >
                <StatusIcon size={12} />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-sm text-neutral-500">
              {inquiry.createdAt
                ? `Received ${format(new Date(inquiry.createdAt), "MMMM d, yyyy 'at' h:mm a")}`
                : "Date unknown"}
            </p>
          </div>
        </div>
        {emailSent && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200">
            <Check size={14} />
            Email sent successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User size={18} className="text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {inquiry.customer?.name || "No name provided"}
                  </p>
                  <p className="text-xs text-neutral-500">Full Name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-neutral-400 mt-0.5" />
                <div>
                  {inquiry.customer?.email ? (
                    <a
                      href={`mailto:${inquiry.customer.email}`}
                      className="text-sm text-black hover:underline"
                    >
                      {inquiry.customer.email}
                    </a>
                  ) : (
                    <p className="text-sm text-neutral-400">
                      No email provided
                    </p>
                  )}
                  <p className="text-xs text-neutral-500">Email</p>
                </div>
              </div>
              {inquiry.customer?.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-neutral-400 mt-0.5" />
                  <div>
                    <a
                      href={`tel:${inquiry.customer.phone}`}
                      className="text-sm text-black hover:underline"
                    >
                      {inquiry.customer.phone}
                    </a>
                    <p className="text-xs text-neutral-500">Phone</p>
                  </div>
                </div>
              )}
              {inquiry.customer?.message && (
                <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200">
                  <p className="text-sm italic text-neutral-600">
                    "{inquiry.customer.message}"
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">
                    Initial Message
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reply via Email Card */}
          {inquiry.customer?.email && (
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-lg font-light mb-6">Reply via Email</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2 text-neutral-500">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={replyEmail.subject}
                    onChange={(e) =>
                      setReplyEmail({ ...replyEmail, subject: e.target.value })
                    }
                    className="w-full border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2 text-neutral-500">
                    Message
                  </label>
                  <textarea
                    rows={8}
                    value={replyEmail.message}
                    onChange={(e) =>
                      setReplyEmail({ ...replyEmail, message: e.target.value })
                    }
                    placeholder="Type your reply here..."
                    className="w-full border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>
                {inquiry.quotedPrice && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={replyEmail.includePrice}
                      onChange={(e) =>
                        setReplyEmail({
                          ...replyEmail,
                          includePrice: e.target.checked,
                        })
                      }
                      className="rounded border-neutral-300"
                    />
                    Include quoted price: {inquiry.currency || "KES"}{" "}
                    {inquiry.quotedPrice}
                  </label>
                )}
                <button
                  onClick={sendEmailReply}
                  disabled={
                    !replyEmail.subject ||
                    !replyEmail.message ||
                    savingField === "email"
                  }
                  className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                >
                  {savingField === "email" ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Communication Log */}
          <div className="bg-white border border-neutral-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light">Communication Log</h2>
              <button
                onClick={() => setShowCommsForm(!showCommsForm)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider hover:text-neutral-600"
              >
                <Plus size={14} />
                Add Entry
              </button>
            </div>

            {showCommsForm && (
              <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 space-y-4">
                <select
                  value={newCommunication.type}
                  onChange={(e) =>
                    setNewCommunication({
                      ...newCommunication,
                      type: e.target.value,
                    })
                  }
                  className="w-full border border-neutral-200 p-2 text-sm"
                >
                  {communicationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Communication summary..."
                  value={newCommunication.summary}
                  onChange={(e) =>
                    setNewCommunication({
                      ...newCommunication,
                      summary: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full border border-neutral-200 p-2 text-sm resize-none"
                />
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">
                    Follow-up Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newCommunication.followupDate}
                    onChange={(e) =>
                      setNewCommunication({
                        ...newCommunication,
                        followupDate: e.target.value,
                      })
                    }
                    className="w-full border border-neutral-200 p-2 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addCommunication}
                    disabled={
                      !newCommunication.summary ||
                      savingField === "communication"
                    }
                    className="flex-1 bg-black text-white py-2 text-xs uppercase tracking-wider hover:bg-gray-900 disabled:bg-gray-400"
                  >
                    {savingField === "communication"
                      ? "Saving..."
                      : "Save Entry"}
                  </button>
                  <button
                    onClick={() => setShowCommsForm(false)}
                    className="px-4 py-2 border border-neutral-200 text-xs uppercase tracking-wider hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {inquiry.communicationLog &&
              inquiry.communicationLog.length > 0 ? (
                inquiry.communicationLog.map((comm, index) => (
                  <div
                    key={index}
                    className="border-b border-neutral-100 pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        {communicationTypes.find((t) => t.value === comm.type)
                          ?.label ||
                          comm.type ||
                          "Unknown"}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {comm.date
                          ? format(new Date(comm.date), "MMM d, yyyy h:mm a")
                          : "Date unknown"}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {comm.summary || "No summary"}
                    </p>
                    {comm.followupDate && (
                      <p className="text-xs text-orange-600 mt-2">
                        Follow-up:{" "}
                        {format(new Date(comm.followupDate), "MMM d, yyyy")}
                      </p>
                    )}
                    {comm.handledBy && (
                      <p className="text-xs text-neutral-400 mt-1">
                        by {comm.handledBy}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-400 text-center py-4">
                  No communication recorded yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-8">
          {/* Status & Priority Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Inquiry Management</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-neutral-500">
                  Status
                </label>
                <select
                  value={inquiry.status || "new"}
                  onChange={handleStatusChange}
                  disabled={savingField === "status"}
                  className="w-full border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-400"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {savingField === "status" && (
                  <p className="text-[10px] text-neutral-400 mt-1">Saving...</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-neutral-500">
                  Priority
                </label>
                <select
                  value={inquiry.priority || "medium"}
                  onChange={handlePriorityChange}
                  disabled={savingField === "priority"}
                  className="w-full border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-400"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {savingField === "priority" && (
                  <p className="text-[10px] text-neutral-400 mt-1">Saving...</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-neutral-500">
                  Assigned To
                </label>
                {isEditingAssignedTo ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editableAssignedTo}
                      onChange={(e) => setEditableAssignedTo(e.target.value)}
                      placeholder="Staff name"
                      className="w-full border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAssignedToSave}
                        disabled={savingField === "assignedTo"}
                        className="flex-1 bg-black text-white py-2 text-xs uppercase tracking-wider hover:bg-gray-900 disabled:bg-gray-400 flex items-center justify-center gap-1"
                      >
                        {savingField === "assignedTo" ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={12} />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-neutral-200 text-xs uppercase tracking-wider hover:bg-neutral-100 flex items-center gap-1"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-neutral-700">
                      {inquiry.assignedTo || (
                        <span className="text-neutral-400">Not assigned</span>
                      )}
                    </span>
                    <button
                      onClick={() => setIsEditingAssignedTo(true)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                      title="Edit assigned to"
                    >
                      <Edit3 size={14} className="text-neutral-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quote Details Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Quote Details</h2>
            <div className="space-y-4">
              {isEditingPrice ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={editableCurrency}
                      onChange={handleCurrencyChange}
                      className="w-24 border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black"
                    >
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      type="text"
                      value={editableQuotedPrice}
                      onChange={(e) => setEditableQuotedPrice(e.target.value)}
                      placeholder="e.g., 450,000"
                      className="flex-1 border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePriceSave}
                      disabled={savingField === "price"}
                      className="flex-1 bg-black text-white py-2 text-xs uppercase tracking-wider hover:bg-gray-900 disabled:bg-gray-400 flex items-center justify-center gap-1"
                    >
                      {savingField === "price" ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={12} />
                          Save Price
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelPriceEdit}
                      className="px-4 py-2 border border-neutral-200 text-xs uppercase tracking-wider hover:bg-neutral-100 flex items-center gap-1"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    {inquiry.quotedPrice ? (
                      <p className="text-sm font-medium">
                        {inquiry.currency || "KES"} {inquiry.quotedPrice}
                      </p>
                    ) : (
                      <p className="text-sm text-neutral-400">
                        No price quoted
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditingPrice(true)}
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    title="Edit price"
                  >
                    <Edit3 size={14} className="text-neutral-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Internal Notes Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Internal Notes</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a private note..."
                  rows={3}
                  className="flex-1 border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
              <button
                onClick={addNote}
                disabled={!newNote.trim() || savingField === "note"}
                className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 text-xs uppercase tracking-wider hover:bg-gray-900 disabled:bg-gray-400"
              >
                {savingField === "note" ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    Save Note
                  </>
                )}
              </button>

              <div className="space-y-3 mt-6 max-h-60 overflow-y-auto">
                {inquiry.internalNotes && inquiry.internalNotes.length > 0 ? (
                  inquiry.internalNotes.map((note, index) => (
                    <div
                      key={index}
                      className="border-b border-neutral-100 pb-3 last:border-0"
                    >
                      <p className="text-sm">{note.note || "No content"}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-neutral-400">
                          {note.addedBy || "Unknown"}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {note.addedAt
                            ? format(new Date(note.addedAt), "MMM d, yyyy")
                            : "Date unknown"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-400 text-center py-4">
                    No internal notes
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Source:</dt>
                <dd className="font-medium capitalize">
                  {inquiry.inquirySource?.replace("_", " ") || "Unknown"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Piece:</dt>
                <dd className="font-medium">
                  {inquiry.pieceName || "Unknown"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Last Updated:</dt>
                <dd className="font-medium">
                  {inquiry.lastUpdated
                    ? format(new Date(inquiry.lastUpdated), "MMM d, yyyy")
                    : "Never"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
