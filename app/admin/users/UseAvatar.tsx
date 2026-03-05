// app/admin/users/UseAvatar.tsx
"use client";

import { useState } from "react";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  email?: string | null; // Add email as optional prop
}

export default function UserAvatar({ image, name, email }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // If no image or image failed to load
  if (!image || imageError) {
    return (
      <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-lg md:text-xl border border-neutral-100">
        <span>{getInitials(name)}</span>
      </div>
    );
  }

  // Use regular img tag with referrerPolicy and crossOrigin attributes
  return (
    <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-full overflow-hidden relative border border-neutral-100">
      <img
        src={image}
        alt={name || "User"}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    </div>
  );
}
