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
  Calendar,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

interface Note {
  _key?: string;
  note: string;
  addedBy: string;
  addedAt: string;
}

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
  notes?: Note[];
}

// Status configuration
const statusOptions = [
  { value: "new", label: "New", icon: AlertCircle, color: "blue" },
  { value: "in_progress", label: "In Progress", icon: Clock, color: "yellow" },
  { value: "replied", label: "Replied", icon: CheckCircle, color: "green" },
  { value: "closed", label: "Closed", icon: XCircle, color: "gray" },
];

// Subject labels
const subjectLabels: Record<string, string> = {
  general: "General Enquiry",
  order: "Order / Shipment",
  wholesale: "Wholesale / Bulk",
  partnership: "Partnership / Media",
  support: "Account / Support",
};

export default function ContactSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [replyEmail, setReplyEmail] = useState({
    subject: "",
    message: "",
  });
  const [emailSent, setEmailSent] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editableStatus, setEditableStatus] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchSubmission();
    }
  }, [params.id]);

  useEffect(() => {
    if (submission) {
      setEditableStatus(submission.status);
      // Auto-populate email subject
      const subjectDisplay =
        submission.subjectLabel ||
        subjectLabels[submission.subject] ||
        submission.subject ||
        "General Enquiry";

      setReplyEmail((prev) => ({
        ...prev,
        subject: `Re: ${subjectDisplay} - ${submission.name}`,
      }));
    }
  }, [submission]);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "contactSubmission" && _id == $id][0] {
        _id,
        name,
        email,
        phone,
        subject,
        subjectLabel,
        message,
        status,
        submittedAt,
        repliedAt,
        notes[] {
          _key,
          note,
          addedBy,
          addedAt
        }
      }`;

      const data = await client.fetch(query, { id: params.id });
      setSubmission(data);
    } catch (error) {
      console.error("Error fetching submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (
    updates: Partial<ContactSubmission>,
    fieldName?: string,
  ) => {
    if (fieldName) {
      setSavingField(fieldName);
    }

    try {
      const response = await fetch("/api/contact-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: params.id,
          updates,
        }),
      });

      if (response.ok) {
        setSubmission((prev) => (prev ? { ...prev, ...updates } : prev));

        if (fieldName === "status") {
          setIsEditingStatus(false);
        }
      }
    } catch (error) {
      console.error("Error updating submission:", error);
    } finally {
      setSavingField(null);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value as ContactSubmission["status"];
    setEditableStatus(value);
  };

  const handleStatusSave = (e: React.MouseEvent) => {
    e.preventDefault();
    updateSubmission(
      { status: editableStatus as ContactSubmission["status"] },
      "status",
    );
  };

  const handleCancelStatusEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditingStatus(false);
    setEditableStatus(submission?.status || "new");
  };

  const addNote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    // Generate a unique _key for the new note
    const newNoteObj: Note = {
      _key: uuidv4().replace(/-/g, "").substring(0, 8),
      note: newNote,
      addedBy: "Admin",
      addedAt: new Date().toISOString(),
    };

    const updatedNotes = [...(submission?.notes || []), newNoteObj];
    setSavingField("note");

    try {
      const response = await fetch("/api/contact-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: params.id,
          updates: { notes: updatedNotes },
        }),
      });

      if (response.ok) {
        setSubmission((prev) =>
          prev ? { ...prev, notes: updatedNotes } : prev,
        );
        setNewNote("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setSavingField(null);
    }
  };

  const sendEmailReply = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!replyEmail.subject || !replyEmail.message) return;

    setSavingField("email");

    try {
      // Send email via Resend
      const emailResponse = await fetch("/api/contact/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: submission?.email,
          name: submission?.name,
          subject: replyEmail.subject,
          message: replyEmail.message,
          originalMessage: submission?.message,
        }),
      });

      if (emailResponse.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);

        // Update status to replied if it's new or in progress
        if (
          submission?.status === "new" ||
          submission?.status === "in_progress"
        ) {
          await updateSubmission(
            {
              status: "replied",
              repliedAt: new Date().toISOString(),
            },
            "status",
          );
        }

        // Clear form
        setReplyEmail((prev) => ({
          ...prev,
          message: "",
        }));

        // Add to notes with unique _key
        const noteObj: Note = {
          _key: uuidv4().replace(/-/g, "").substring(0, 8),
          note: `Replied via email: ${replyEmail.subject}`,
          addedBy: "Admin",
          addedAt: new Date().toISOString(),
        };

        const updatedNotes = [...(submission?.notes || []), noteObj];

        // Update notes in Sanity
        await fetch("/api/contact-submissions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: params.id,
            updates: { notes: updatedNotes },
          }),
        });

        setSubmission((prev) =>
          prev ? { ...prev, notes: updatedNotes } : prev,
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSavingField(null);
    }
  };

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

  if (!submission) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Submission not found</p>
        <Link
          href="/admin/contact-submissions"
          className="text-black underline mt-4 block"
        >
          Back to Submissions
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;
  const subjectDisplay =
    submission.subjectLabel ||
    subjectLabels[submission.subject] ||
    submission.subject ||
    "General Enquiry";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/contact-submissions"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-light">{submission.name}</h1>
              {!isEditingStatus ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
                  >
                    <StatusIcon size={12} />
                    {statusConfig.label}
                  </span>
                  <button
                    onClick={() => setIsEditingStatus(true)}
                    className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <Edit3 size={14} className="text-neutral-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={editableStatus}
                    onChange={handleStatusChange}
                    className="border border-neutral-200 p-1 text-sm focus:outline-none focus:border-black"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusSave}
                    disabled={savingField === "status"}
                    className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={handleCancelStatusEdit}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-500">
              {submission.submittedAt
                ? `Received ${format(new Date(submission.submittedAt), "MMMM d, yyyy 'at' h:mm a")}`
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
            <h2 className="text-lg font-light mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User size={18} className="text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{submission.name}</p>
                  <p className="text-xs text-neutral-500">Full Name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-neutral-400 mt-0.5" />
                <div>
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-sm text-black hover:underline"
                  >
                    {submission.email}
                  </a>
                  <p className="text-xs text-neutral-500">Email</p>
                </div>
              </div>
              {submission.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-neutral-400 mt-0.5" />
                  <div>
                    <a
                      href={`tel:${submission.phone}`}
                      className="text-sm text-black hover:underline"
                    >
                      {submission.phone}
                    </a>
                    <p className="text-xs text-neutral-500">Phone</p>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Subject
                </p>
                <p className="text-sm font-medium">{subjectDisplay}</p>
              </div>
            </div>
          </div>

          {/* Original Message Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Original Message</h2>
            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {submission.message}
              </p>
              <p className="text-xs text-neutral-400 mt-4">
                Sent:{" "}
                {format(
                  new Date(submission.submittedAt),
                  "MMMM d, yyyy 'at' h:mm a",
                )}
              </p>
            </div>
          </div>

          {/* Reply via Email Card */}
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
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-8">
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

              <div className="space-y-3 mt-6 max-h-96 overflow-y-auto">
                {submission.notes && submission.notes.length > 0 ? (
                  submission.notes.map((note) => (
                    <div
                      key={note._key || Math.random().toString()}
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

          {/* Quick Actions Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Quick Actions</h2>
            <div className="space-y-2">

              {submission.phone && (
                <a
                  href={`tel:${submission.phone}`}
                  className="flex items-center gap-2 w-full p-3 border border-neutral-200 text-sm hover:bg-neutral-50 transition-colors"
                >
                  <Phone size={14} />
                  Call {submission.phone}
                </a>
              )}
              <button
                onClick={() => {
                  if (submission?.status !== "closed") {
                    updateSubmission({ status: "closed" }, "status");
                  }
                }}
                disabled={submission?.status === "closed"}
                className="flex items-center gap-2 w-full p-3 border border-neutral-200 text-sm hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <XCircle size={14} />
                Mark as Closed
              </button>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h2 className="text-lg font-light mb-6">Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Submission ID:</dt>
                <dd className="font-medium font-mono text-xs">
                  {submission._id.substring(0, 8)}...
                </dd>
              </div>
              {submission.repliedAt && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Replied At:</dt>
                  <dd className="font-medium">
                    {format(new Date(submission.repliedAt), "MMM d, yyyy")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
