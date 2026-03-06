"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white font-black py-6 uppercase tracking-[0.4em] text-xs hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-neutral-800 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Saving Changes...
        </>
      ) : (
        "Save Changes"
      )}
    </button>
  );
}
