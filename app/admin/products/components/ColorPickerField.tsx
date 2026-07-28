// app/admin/products/components/ColorPickerField.tsx
"use client";

import { useState } from "react";

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export default function ColorPickerField({
  index,
  defaultLabel = "",
  defaultHex = "#000000",
}: {
  index: number;
  defaultLabel?: string;
  defaultHex?: string;
}) {
  const [hex, setHex] = useState(
    defaultHex && HEX_PATTERN.test(defaultHex) ? defaultHex : "#000000",
  );
  const [label, setLabel] = useState(defaultLabel);

  return (
    <div className="flex gap-2">
      {/* Native color wheel - lets an admin pick visually without knowing
          any hex codes. Every modern browser renders a full color
          picker/wheel UI for input[type=color]. */}
      <input
        type="color"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        title="Pick a color"
        className="h-[52px] w-14 shrink-0 border border-neutral-200 cursor-pointer p-1 bg-white"
      />
      <input
        type="text"
        name="colorLabel"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder={`Color ${index + 1} name (e.g., Black)`}
        className="flex-1 p-4 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors"
      />
      {/* Hex stays editable too, for admins who already know the code */}
      <input
        type="text"
        name="colorHex"
        value={hex}
        onChange={(e) => {
          const value = e.target.value;
          setHex(value.startsWith("#") ? value : `#${value}`);
        }}
        placeholder="#000000"
        maxLength={7}
        className="w-28 p-4 border border-neutral-200 bg-white text-sm font-mono uppercase focus:border-black outline-none transition-colors"
      />
    </div>
  );
}
