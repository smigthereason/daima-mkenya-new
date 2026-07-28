// app/admin/products/components/DeleteProductModal.tsx
"use client";

import { useState, useTransition } from "react";
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import { deleteProduct } from "../actions";

export default function DeleteProductModal({
  productId,
  productName,
  isOneOff,
}: {
  productId: string;
  productName: string;
  isOneOff: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    const formData = new FormData();
    formData.set("id", productId);

    startTransition(async () => {
      const result = await deleteProduct(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-neutral-400 hover:text-red-600"
        aria-label={`Delete ${productName}`}
      >
        <Trash2 size={16} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-[100]"
          onClick={() => !isPending && setIsOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md p-8 md:p-10 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => !isPending && setIsOpen(false)}
              disabled={isPending}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black disabled:opacity-30"
            >
              <X size={20} />
            </button>

            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 border border-red-100 mb-6">
              <AlertTriangle size={20} className="text-red-600" />
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
              Delete {isOneOff ? "Piece" : "Product"}?
            </h2>
            <p className="text-[13px] text-neutral-500 mb-8 leading-relaxed">
              You&apos;re about to permanently delete{" "}
              <span className="font-black text-black">
                &ldquo;{productName}&rdquo;
              </span>
              . This action cannot be undone and will remove it from the
              registry immediately.
            </p>

            {error && (
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-6 bg-red-50 border border-red-100 px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="flex-1 py-3.5 border border-neutral-200 text-[10px] font-black uppercase tracking-[0.2em] hover:border-black transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3.5 bg-[#be1e2d] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Deleting
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
