"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { upsertBatch, deleteBatch, triggerEmailBlast } from "./actions";
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
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
}

interface Batch {
  _id: string;
  batchName: string;
  products: { _ref: string }[];
  triggerEmail: boolean;
  emailSent: boolean;
  sentAt?: string;
}

export default function AnnouncementBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    _id: "",
    batchName: "",
    selectedProducts: [] as string[],
    triggerEmail: false,
    emailSent: false,
    sentAt: "",
  });

  const loadData = async () => {
    try {
      const [b, p] = await Promise.all([
        client.fetch(`*[_type == "productBatch"] | order(_createdAt desc)`),
        client.fetch(`*[_type == "product" && !disabled] { _id, name }`),
      ]);
      setBatches(b);
      setProducts(p);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      _id: "",
      batchName: "",
      selectedProducts: [],
      triggerEmail: false,
      emailSent: false,
      sentAt: "",
    });
  };

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
      });
      setIsModalOpen(false);
      resetForm();
      await loadData();
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
    } catch (error) {
      console.error("Blast failed:", error);
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-10 animate-fadeIn pt-10 pb-20">
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

      {/* BATCH LIST */}
      <div className="grid grid-cols-1 gap-6">
        {batches.map((batch) => (
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
                  {batch.sentAt && (
                    <div className="col-span-2">
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">
                        Sent Date
                      </p>
                      <p className="text-[11px] font-bold uppercase">
                        {new Date(batch.sentAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 self-center w-full lg:w-auto">
                {!batch.emailSent && (
                  <button
                    onClick={() => handleTrigger(batch._id)}
                    disabled={updatingId === batch._id}
                    className="group relative flex items-center justify-center gap-2 w-full lg:w-48 overflow-hidden border border-black py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-black group-hover:text-white transition-colors duration-500">
                      {updatingId === batch._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      Send Blast
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
                    });
                    setIsModalOpen(true);
                  }}
                  className="group relative flex items-center justify-center gap-2 w-full lg:w-40 overflow-hidden border border-neutral-200 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-black group-hover:text-white transition-colors duration-500">
                    Edit
                  </span>
                </button>

                <button
                  onClick={() => handleDelete(batch._id)}
                  disabled={updatingId === batch._id}
                  className="group relative flex items-center justify-center gap-2 w-full lg:w-16 overflow-hidden border border-red-100 py-4 text-[10px] font-black uppercase transition-all duration-300 disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-red-500 group-hover:text-white transition-colors duration-500">
                    <Trash2 size={14} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center p-4 z-[100]">
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
                      {new Date(formData.sentAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Selection (Select 5)
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
                        <span className="text-xs font-bold uppercase">
                          {p.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
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
                    <span>Create Batch</span>
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
