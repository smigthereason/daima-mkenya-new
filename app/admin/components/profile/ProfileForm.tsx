// app/admin/components/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Edit3,
  Save,
  X,
  Camera,
  Lock,
  Key,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Form data state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validate passwords
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);

        // Clear success message after 3 seconds
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsSendingReset(true);
    setPasswordError("");
    setResetSent(false);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSent(true);
        setTimeout(() => setResetSent(false), 5000);
      } else {
        setPasswordError(data.error || "Failed to send reset email");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsSendingReset(false);
    }
  };

  // Shared CSS Classes from ProductCard
  const inputClasses =
    "w-full p-5 bg-neutral-50 border border-neutral-100 rounded-none text-sm tracking-widest focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all disabled:opacity-60";
  const labelClasses =
    "text-[11px] font-black text-neutral-900 uppercase tracking-[0.3em] flex items-center gap-2";

  return (
    <div className="space-y-12">
      {/* Action Button Row */}
      <div className="flex justify-end gap-4">
        {!isEditing && !isChangingPassword ? (
          <>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="group flex items-center gap-2 px-6 py-3 border border-black bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white"
            >
              <Lock size={14} />
              Change Password
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#be1e2d]"
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
              setIsChangingPassword(false);
              setPasswordError("");
            }}
            className="group flex items-center gap-2 px-6 py-3 border border-neutral-200 text-black text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-neutral-50"
          >
            <X size={14} />
            Cancel
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {passwordSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-600" />
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-green-700">
              {passwordSuccess}
            </p>
          </div>
        </div>
      )}

      {passwordError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-red-700">
              {passwordError}
            </p>
          </div>
        </div>
      )}

      {resetSent && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-blue-600" />
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-blue-700">
              Password reset email sent! Check your inbox.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={isChangingPassword ? handlePasswordChange : handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        {/* Left Col: Avatar */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="relative group">
            <div className="h-48 w-48 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 font-black text-4xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              ) : (
                <span className="tracking-tighter">
                  {formData.name?.[0] || "A"}
                </span>
              )}
            </div>

            {isEditing && (
              <label className="absolute bottom-2 right-2 p-4 bg-[#be1e2d] text-white rounded-full cursor-pointer shadow-xl hover:scale-110 transition-transform">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            )}
          </div>
        </div>

        {/* Right Col: Fields */}
        <div className="lg:col-span-8 space-y-8">
          {isChangingPassword ? (
            // Password Change Form
            <div className="space-y-8">
              <div className="space-y-3">
                <label className={labelClasses}>
                  <Key size={14} className="text-[#be1e2d]" /> Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className={labelClasses}>
                  <Lock size={14} className="text-[#be1e2d]" /> New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="Min. 8 characters"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className={labelClasses}>
                  <Lock size={14} className="text-[#be1e2d]" /> Confirm New
                  Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSendingReset}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[#be1e2d] hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={12} />
                  {isSendingReset
                    ? "Sending..."
                    : "Forgot Password? Send Reset"}
                </button>
              </div>
            </div>
          ) : (
            // Profile Edit Form
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className={labelClasses}>
                  <User size={14} className="text-[#be1e2d]" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={inputClasses}
                  placeholder="Administrator Name"
                />
              </div>

              <div className="space-y-3">
                <label className={labelClasses}>
                  <Mail size={14} className="text-[#be1e2d]" /> Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className={`${inputClasses} opacity-60 cursor-not-allowed`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-neutral-400 bg-white px-2 py-1">
                    Immutable
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {(isEditing || isChangingPassword) && (
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSaving}
                className="relative w-full overflow-hidden bg-black py-6 text-[12px] font-black uppercase tracking-[0.4em] text-white transition-all group"
              >
                <div className="absolute inset-0 bg-[#be1e2d] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {isChangingPassword ? "Update Password" : "Save Changes"}
                    </>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
