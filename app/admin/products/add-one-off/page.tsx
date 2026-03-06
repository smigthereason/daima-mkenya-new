"use client";

import React from "react";
import { ArrowLeft, Diamond, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { addOneOffAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white font-black py-6 uppercase tracking-[0.4em] text-xs hover:bg-[#006241] transition-all flex items-center justify-center gap-3 disabled:bg-neutral-800 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Publishing...
        </>
      ) : (
        "Publish"
      )}
    </button>
  );
}

export default function AddOneOffPage() {
  const inputClasses =
    "w-full p-4 border border-neutral-200 bg-white text-sm focus:border-black outline-none";
  const labelClasses =
    "text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-2";

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link
        href="/admin/products?type=one-off"
        className="flex items-center gap-2 text-neutral-400 hover:text-black mb-10 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Back to Archive
        </span>
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 text-amber-600 mb-2">
          <Diamond size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Singular Creation
          </span>
        </div>
        <h1 className="text-5xl font-light tracking-tighter uppercase">
          New <span className="font-black">One-Off</span>
        </h1>
      </div>

      <form
        action={addOneOffAction}
        className="space-y-8 bg-white p-10 border border-neutral-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}>Piece Name *</label>
            <input
              name="name"
              required
              className={inputClasses}
              placeholder="The Sovereign Silk"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Edition Details</label>
            <input
              name="editionInfo"
              className={inputClasses}
              placeholder="Edition 1/1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>
            Description (Enter each paragraph on a new line)
          </label>
          <textarea
            name="description"
            rows={6}
            className={inputClasses}
            placeholder="Describe the craftsmanship..."
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Visual Identity (Image) *</label>
          <input
            name="image"
            type="file"
            required
            accept="image/*"
            className="w-full text-xs text-neutral-500 file:mr-4 file:py-3 file:px-6 file:border file:border-black file:text-[10px] file:font-black file:bg-white hover:file:bg-black hover:file:text-white"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
