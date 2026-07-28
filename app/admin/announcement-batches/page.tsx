"use client";

import { useState, useEffect, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import {
  upsertBatch,
  deleteBatch,
  triggerEmailBlast,
  resendEmailBlast,
} from "./actions";
import {
  Megaphone,
  Send,
  Trash2,
  CheckCircle,
  Clock,
  Plus,
  X,
  Loader2,
  BellRing,
  Save,
  Package,
  RefreshCw,
  Calendar,
  Search,
  ChevronDown
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  _updatedAt?: string;
  _createdAt?: string;
}

interface Batch {
  _id: string;
  batchName: string;
  products: { _ref: string }[];
  triggerEmail: boolean;
  emailSent: boolean;
  sentAt?: string;
  scheduledFor?: string;
  recipientCount?: number;
  emailError?: string;
}

export default function AnnouncementBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    _id: "",
    batchName: "",
    selectedProducts: [] as string[],
    triggerEmail: false,
    emailSent: false,
    sentAt: "",
    scheduledFor: "",
    recipientCount: 0,
  });

  const loadData = async () => {
    try {
      const [b, p] = await Promise.all([
        // Explicitly fetch all fields including triggerEmail
        client.fetch(`
          *[_type == "productBatch"] | order(_createdAt desc) {
            _id,
            batchName,
            products[] { _ref },
            triggerEmail,
            emailSent,
            sentAt,
            scheduledFor,
            recipientCount,
            emailError
          }
        `),
        client.fetch(
          `*[_type == "product" && !disabled] | order(_updatedAt desc) { _id, name, _updatedAt, _createdAt }`,
        ),
      ]);

      console.log(
        "Fetched batches with triggerEmail:",
        b.map((batch: Batch) => ({
          id: batch._id,
          name: batch.batchName,
          triggerEmail: batch.triggerEmail,
        })),
      );

      setBatches(b);

      const sortedProducts = p.sort((a: Product, b: Product) => {
        const dateA = new Date(a._updatedAt || a._createdAt || 0).getTime();
        const dateB = new Date(b._updatedAt || b._createdAt || 0).getTime();
        return dateB - dateA;
      });
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const resetForm = () => {
    setFormData({
      _id: "",
      batchName: "",
      selectedProducts: [],
      triggerEmail: false,
      emailSent: false,
      sentAt: "",
      scheduledFor: "",
      recipientCount: 0,
    });
  };

  // Function to auto-select 5 newest products
  const selectNewestProducts = () => {
    if (products.length >= 5) {
      const newestProductIds = products.slice(0, 5).map((p) => p._id);
      setFormData((prev) => ({
        ...prev,
        selectedProducts: newestProductIds,
      }));
    }
  };

  // When modal opens for new batch (no _id), auto-select newest products
  useEffect(() => {
    if (isModalOpen && !formData._id && products.length > 0) {
      selectNewestProducts();
    }
  }, [isModalOpen, products, formData._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedProducts.length !== 5) {
      alert("Please select exactly 5 products.");
      return;
    }
    setLoading(true);
    try {
      await upsertBatch({
        _id: formData._id || undefined,
        batchName: formData.batchName,
        products: formData.selectedProducts,
        triggerEmail: formData.triggerEmail,
        scheduledFor: formData.scheduledFor || undefined,
      });
      setIsModalOpen(false);
      resetForm();
      await loadData(); // Reload to get updated triggerEmail status
      setSuccessMessage("Batch saved successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = async (id: string) => {
    if (!confirm("Send this email blast to all customers now?")) return;
    setUpdatingId(id);
    try {
      await triggerEmailBlast(id);
      await loadData();
      setSuccessMessage("Email blast triggered successfully!");
    } catch (error) {
      console.error("Blast failed:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResend = async (id: string) => {
    if (!confirm("Resend this email blast to all customers?")) return;
    setUpdatingId(id);
    try {
      await resendEmailBlast(id);
      await loadData();
      setSuccessMessage("Email blast resent successfully!");
    } catch (error) {
      console.error("Resend failed:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    setUpdatingId(id);
    try {
      await deleteBatch(id);
      await loadData();
      setSuccessMessage("Batch deleted successfully!");
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCheckboxChange = (productId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        if (prev.selectedProducts.length >= 5) return prev;
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, productId],
        };
      } else {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter(
            (id) => id !== productId,
          ),
        };
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBatchStatus = (batch: Batch) => {
    if (batch.emailSent) return "dispatched";
    const isScheduled =
      batch.scheduledFor && new Date(batch.scheduledFor) > new Date();
    return isScheduled ? "scheduled" : "pending";
  };

  const filteredBatches = useMemo(() => {
    let result = batches;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((b) => b.batchName?.toLowerCase().includes(q));
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => getBatchStatus(b) === statusFilter);
    }

    return result;
  }, [batches, searchQuery, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-10 animate-fadeIn pt-10 pb-20 relative">
      {/* SUCCESS MESSAGE TOAST */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-black text-white px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-2xl z-50 animate-slideIn">
          {successMessage}
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-4 text-white/50 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="border-b border-neutral-100 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
            Product <span className="font-black">Announcements</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
            Curate and schedule automated customer notifications
          </p>
        </div>

        <div className="w-full sm:w-64">
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="group relative flex items-center justify-center gap-2 w-full overflow-hidden border border-black py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-2 text-black group-hover:text-white transition-colors duration-500">
              <Plus size={14} /> New Batch
            </span>
          </button>
        </div>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by campaign name..."
            className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* CLEAN SELECT DROPDOWN */}
        <div className="relative sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-full pl-4 pr-10 py-3.5 border border-neutral-200 bg-white text-[11px] font-black uppercase tracking-widest outline-none focus:border-black appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="dispatched">Dispatched</option>
            <option value="scheduled">Scheduled</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-900 pointer-events-none"
          />
        </div>
      </div>

      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
        Showing {filteredBatches.length} of {batches.length} batches
      </p>

      {/* BATCH LIST */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBatches.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
            <Megaphone className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <p className="text-neutral-500 text-sm font-medium">
              No batches match your search
            </p>
          </div>
        )}
        {filteredBatches.map((batch) => {
          const isScheduled =
            batch.scheduledFor && new Date(batch.scheduledFor) > new Date();
          const scheduledDate = batch.scheduledFor
            ? formatDate(batch.scheduledFor)
            : null;
          const sentDate = batch.sentAt ? formatDate(batch.sentAt) : null;

          return (
            <div
              key={batch._id}
              className="border border-neutral-100 bg-white p-6 md:p-8 hover:border-neutral-300 transition-all shadow-sm group/card"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-100 p-2 group-hover/card:bg-black group-hover/card:text-white transition-colors">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold uppercase tracking-tight">
                        {batch.batchName}
                      </h2>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                        ID: {batch._id.slice(-8)}
                      </p>
                      {/* Debug: Show triggerEmail status */}
                      <p className="text-[8px] text-blue-400">
                        Trigger: {batch.triggerEmail ? "ON" : "OFF"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">
                        Status
                      </p>
                      {batch.emailSent ? (
                        <span className="text-[10px] font-black uppercase text-green-600 flex items-center gap-1">
                          <CheckCircle size={12} /> Dispatched
                        </span>
                      ) : isScheduled ? (
                        <span className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1">
                          <Calendar size={12} /> Scheduled
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-amber-500 flex items-center gap-1">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">
                        Items
                      </p>
                      <p className="text-sm font-bold uppercase flex items-center gap-1">
                        <Package size={12} /> {batch.products?.length || 0}
                      </p>
                    </div>
                    {batch.recipientCount ? (
                      <div>
                        <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">
                          Recipients
                        </p>
                        <p className="text-sm font-bold uppercase">
                          {batch.recipientCount}
                        </p>
                      </div>
                    ) : null}
                    {isScheduled && scheduledDate && (
                      <div className="col-span-2">
                        <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">
                          Scheduled For
                        </p>
                        <p className="text-[11px] font-bold uppercase">
                          {scheduledDate}
                        </p>
                      </div>
                    )}
                    {sentDate && (
                      <div className="col-span-2">
                        <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">
                          Sent Date
                        </p>
                        <p className="text-[11px] font-bold uppercase">
                          {sentDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row items-center gap-2 self-center w-full lg:w-auto">
                  {!batch.emailSent ? (
                    <button
                      onClick={() => handleTrigger(batch._id)}
                      disabled={updatingId === batch._id}
                      className="group relative flex items-center justify-center w-12 h-12 overflow-hidden border border-neutral-200 text-[10px] font-black uppercase transition-all duration-300 disabled:opacity-50"
                      title="Send Blast"
                    >
                      <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      <span className="relative z-10 text-black group-hover:text-white transition-colors duration-500">
                        {updatingId === batch._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResend(batch._id)}
                      disabled={updatingId === batch._id}
                      className="group relative flex items-center justify-center w-12 h-12 overflow-hidden border border-neutral-200 text-[10px] font-black uppercase transition-all duration-300 disabled:opacity-50"
                      title="Resend"
                    >
                      <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      <span className="relative z-10 text-black group-hover:text-white transition-colors duration-500">
                        {updatingId === batch._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setFormData({
                        _id: batch._id,
                        batchName: batch.batchName,
                        selectedProducts:
                          batch.products?.map((p: any) => p._ref) || [],
                        triggerEmail: batch.triggerEmail || false,
                        emailSent: batch.emailSent,
                        sentAt: batch.sentAt || "",
                        scheduledFor: batch.scheduledFor || "",
                        recipientCount: batch.recipientCount || 0,
                      });
                      setIsModalOpen(true);
                    }}
                    className="group relative flex items-center justify-center w-12 h-12 overflow-hidden border border-neutral-200 text-[10px] font-black uppercase transition-all duration-300"
                    title="Edit"
                  >
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 text-black group-hover:text-white transition-colors duration-500 text-xs">
                      ✎
                    </span>
                  </button>

                  <button
                    onClick={() => handleDelete(batch._id)}
                    disabled={updatingId === batch._id}
                    className="group relative flex items-center justify-center w-12 h-12 overflow-hidden border border-red-100 text-[10px] font-black uppercase transition-all duration-300 disabled:opacity-50"
                    title="Delete"
                  >
                    <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 text-red-500 group-hover:text-white transition-colors duration-500">
                      <Trash2 size={16} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-[100]">
          <div className="bg-white w-full max-w-2xl p-8 md:p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-neutral-400 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-4xl font-black uppercase tracking-tighter mb-1">
              Batch <span className="text-neutral-500 font-light">Config</span>
            </h2>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-10">
              Configure automation and product selection
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Campaign Name
                </label>
                <input
                  className="w-full border-b-2 border-neutral-100 py-3 text-xl font-bold outline-none focus:border-black transition-colors"
                  placeholder="E.G., NOSTALGIA CAPSULE DROP"
                  value={formData.batchName}
                  onChange={(e) =>
                    setFormData({ ...formData, batchName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Schedule Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Schedule For (Optional)
                </label>
                <input
                  type="datetime-local"
                  className="w-full border-b-2 border-neutral-100 py-3 text-sm font-bold outline-none focus:border-black transition-colors"
                  value={
                    formData.scheduledFor
                      ? formData.scheduledFor.slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledFor: e.target.value })
                  }
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-[8px] text-neutral-400 uppercase tracking-widest">
                  Leave empty for immediate send when triggered
                </p>
              </div>

              <div className="bg-neutral-50 p-6 space-y-4 border border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellRing
                      size={18}
                      className={
                        formData.triggerEmail
                          ? "text-blue-600"
                          : "text-neutral-400"
                      }
                    />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tighter">
                        Trigger Email Blast
                      </p>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest">
                        Send notification on next publish
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={formData.emailSent}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        triggerEmail: !formData.triggerEmail,
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      formData.triggerEmail ? "bg-black" : "bg-neutral-200"
                    } ${formData.emailSent ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        formData.triggerEmail ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {formData.emailSent && (
                  <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-green-600">
                      Successfully Dispatched
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500">
                      {formatDate(formData.sentAt)}
                    </span>
                  </div>
                )}

                {formData.scheduledFor && !formData.emailSent && (
                  <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-blue-600">
                      Scheduled For
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500">
                      {formatDate(formData.scheduledFor)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Selection (Select 5) - Latest Products First
                  </label>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      formData.selectedProducts.length === 5
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {formData.selectedProducts.length}/5 Selected
                  </span>
                </div>
                <div className="border border-neutral-100 max-h-48 overflow-y-auto bg-white">
                  {products.map((p) => {
                    const isChecked = formData.selectedProducts.includes(p._id);
                    const isDisabled =
                      !isChecked && formData.selectedProducts.length >= 5;

                    return (
                      <label
                        key={p._id}
                        className={`flex items-center gap-4 p-4 hover:bg-neutral-50 cursor-pointer border-b border-neutral-50 last:border-0 ${
                          isDisabled ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-black"
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={(e) =>
                            handleCheckboxChange(p._id, e.target.checked)
                          }
                        />
                        <span className="text-xs font-bold uppercase flex-1">
                          {p.name}
                        </span>
                        {p._updatedAt && (
                          <span className="text-[8px] text-neutral-400 uppercase">
                            Updated:{" "}
                            {new Date(p._updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {!formData._id && products.length >= 5 && (
                  <p className="text-[8px] text-green-600 uppercase tracking-widest text-right">
                    ✦ Auto-selected 5 newest products
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || formData.selectedProducts.length !== 5}
                className="w-full bg-black text-white py-6 text-[11px] font-bold uppercase hover:bg-red-700 transition-all disabled:opacity-20 flex items-center justify-center gap-3 shadow-2xl"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <div className="flex items-center gap-2">
                    <Save size={14} />
                    <span>
                      {formData._id ? "Update Batch" : "Create Batch"}
                    </span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
