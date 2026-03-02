"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  LogOut,
  Package,
  Heart,
  Settings,
  ChevronRight,
  MapPin,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Lock,
  Key,
  Save,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

interface Order {
  _id: string;
  orderNumber: string;
  status: "pending" | "completed" | "failed";
  paymentStatus?: "paid" | "unpaid";
  amount: number;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: string;
    size: string;
    color: string;
  }>;
  pesapalOrderTrackingId?: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("orders");
  const [imageError, setImageError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Personal details edit state
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [personalData, setPersonalData] = useState({
    name: session?.user?.name || "",
  });
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailsSuccess, setDetailsSuccess] = useState("");

  if (status === "unauthenticated") redirect("/login");

  // Update personal data when session loads
  useEffect(() => {
    if (session?.user?.name) {
      setPersonalData({ name: session.user.name });
    }
  }, [session]);

  // Fetch orders
  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session]);

  // Check URL params for tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setFetchError(null);
    try {
      console.log("Fetching orders for user:", session?.user?.email);
      const response = await fetch("/api/user/orders");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(`Server responded with ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Received non-JSON response from server");
      }

      const data = await response.json();
      console.log("Orders API response:", data);

      if (data.orders) {
        console.log(`Setting ${data.orders.length} orders to state`);
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setFetchError(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    } finally {
      setLoadingOrders(false);
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

    setIsSavingPassword(true);

    try {
      const response = await fetch("/api/user/change-password", {
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

        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleForgotPassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Password reset email sent! Check your inbox.");
      } else {
        setPasswordError(data.error || "Failed to send reset email");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    }
  };

  const handlePersonalDetailsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError("");
    setDetailsSuccess("");
    setIsSavingDetails(true);

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personalData),
      });

      const data = await response.json();

      if (response.ok) {
        setDetailsSuccess("Profile updated successfully");
        setIsEditingDetails(false);
        // Update session data would require a session refresh
        setTimeout(() => setDetailsSuccess(""), 3000);
      } else {
        setDetailsError(data.error || "Failed to update profile");
      }
    } catch (error) {
      setDetailsError("An error occurred. Please try again.");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const getStatusIcon = (order: Order) => {
    if (order.paymentStatus === "paid" || order.status === "completed") {
      return <CheckCircle size={16} className="text-[#81b73e]" />;
    }
    switch (order.status) {
      case "failed":
        return <XCircle size={16} className="text-[#be1e2d]" />;
      default:
        return <Clock size={16} className="text-[#c5a059]" />;
    }
  };

  const getStatusText = (order: Order) => {
    if (order.paymentStatus === "paid" || order.status === "completed") {
      return "Paid";
    }
    switch (order.status) {
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "M";

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Shared input classes from ProductCard
  const inputClasses =
    "w-full p-5 bg-neutral-50 border border-neutral-100 rounded-none text-sm tracking-widest focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all disabled:opacity-60";
  const labelClasses =
    "text-[11px] font-black text-neutral-900 uppercase tracking-[0.3em] flex items-center gap-2";

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-20 mt-4 md:mt-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10 md:mb-16">
          <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-6 group">
            <div className="absolute inset-0 rounded-full border border-zinc-200" />
            <div className="absolute inset-2 rounded-full overflow-hidden bg-black flex items-center justify-center">
              {session?.user?.image && !imageError ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <span className="text-white text-2xl md:text-3xl font-light tracking-tighter transition-transform duration-700 group-hover:scale-125 select-none">
                  {userInitial}
                </span>
              )}
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl font-light tracking-tighter uppercase leading-[0.9] mb-2 text-center break-words max-w-full">
            {session?.user?.name} <span className="font-black">MKENYA</span>
          </h1>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#be1e2d] font-black">
            {session?.user?.role === "admin" ? "ADMINISTRATOR" : "MEMBER"}
          </p>
        </div>

        {/* Success/Error Messages */}
        {passwordSuccess && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-green-600" />
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-green-700">
                {passwordSuccess}
              </p>
            </div>
          </div>
        )}

        {passwordError && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-red-600" />
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-red-700">
                {passwordError}
              </p>
            </div>
          </div>
        )}

        {detailsSuccess && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-green-600" />
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-green-700">
                {detailsSuccess}
              </p>
            </div>
          </div>
        )}

        {detailsError && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-red-600" />
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-red-700">
                {detailsError}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 border-t border-zinc-100 pt-8 md:pt-12">
          {/* Navigation Tabs */}
          <div className="lg:w-1/4">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar border-b lg:border-b-0 border-zinc-50 pb-2 lg:pb-0 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsChangingPassword(false);
                    setIsEditingDetails(false);
                  }}
                  className={`flex items-center justify-between py-3 lg:py-4 px-4 lg:px-2 whitespace-nowrap lg:whitespace-normal border-b-2 lg:border-b border-transparent transition-all shrink-0 ${
                    activeTab === tab.id
                      ? "border-black lg:border-black"
                      : "hover:border-zinc-300 border-transparent text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <tab.icon
                      size={16}
                      strokeWidth={activeTab === tab.id ? 2 : 1.2}
                      className={
                        activeTab === tab.id ? "text-black" : "text-zinc-400"
                      }
                    />
                    <span
                      className={`text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-black transition-all ${
                        activeTab === tab.id
                          ? "text-black"
                          : "text-zinc-400 group-hover:text-black"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`hidden lg:block transition-all ${activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                  />
                </button>
              ))}

              <button
                onClick={() => {
                  clearCart();
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-3 lg:gap-4 py-3 lg:py-8 px-4 lg:px-2 text-zinc-400 hover:text-[#be1e2d] transition-colors lg:mt-8 shrink-0"
              >
                <LogOut size={16} strokeWidth={1.2} />
                <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-black">
                  Sign Out
                </span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-[300px] md:min-h-[400px]">
            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl md:text-2xl font-light tracking-tighter uppercase leading-[0.9] mb-6 md:mb-8">
                  Your <span className="font-black">Orders</span>
                </h2>

                {loadingOrders ? (
                  <div className="py-20 flex justify-center">
                    <div className="w-8 h-8 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : fetchError ? (
                  <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                    <XCircle className="text-red-500 mb-4" size={32} />
                    <p className="text-red-500 text-[10px] uppercase tracking-[0.3em] font-black mb-4">
                      Error loading orders
                    </p>
                    <button
                      onClick={fetchOrders}
                      className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 hover:bg-[#be1e2d] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                    <Package
                      className="text-zinc-300 mb-4"
                      size={32}
                      strokeWidth={1}
                    />
                    <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-black mb-4">
                      No orders found
                    </p>
                    <Link
                      href="/products"
                      className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 hover:bg-[#be1e2d] transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-zinc-200 p-4 md:p-6 hover:border-black transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1">
                              Order Number
                            </p>
                            <p className="font-mono text-sm font-black">
                              {order.orderNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order)}
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider ${
                                  order.paymentStatus === "paid" ||
                                  order.status === "completed"
                                    ? "text-[#81b73e]"
                                    : order.status === "failed"
                                      ? "text-[#be1e2d]"
                                      : "text-[#c5a059]"
                                }`}
                              >
                                {getStatusText(order)}
                              </span>
                            </div>
                            <p className="text-sm font-black">
                              Ksh {order.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-zinc-100 pt-4">
                          <p className="text-[8px] uppercase tracking-widest text-gray-400 font-black mb-3">
                            Items ({order.items.length})
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-600">
                                  {item.productName} x{item.quantity} (
                                  {item.size}, {item.color})
                                </span>
                                <span className="font-black">{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-zinc-100 mt-4 pt-4 flex justify-between items-center">
                          <p className="text-[8px] text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-KE",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                          {order.pesapalOrderTrackingId && (
                            <p className="text-[8px] text-gray-400 font-mono">
                              Ref: {order.pesapalOrderTrackingId}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl md:text-2xl font-light tracking-tighter uppercase leading-[0.9] mb-6 md:mb-8">
                  Saved <span className="font-black">Items</span>
                </h2>
                {cartItems.length === 0 ? (
                  <div className="py-16 md:py-20 border border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50/30">
                    <Heart
                      className="text-zinc-300 mb-4"
                      size={32}
                      strokeWidth={1}
                    />
                    <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-black mb-4">
                      Your bag is empty
                    </p>
                    <Link
                      href="/products"
                      className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 hover:bg-[#be1e2d] transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-8">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartId}
                        className="flex gap-4 md:gap-6 p-3 md:p-4 border border-zinc-100 group hover:border-black transition-all duration-500 relative bg-white"
                      >
                        <div className="absolute top-2 right-2 z-10 bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-tighter">
                          Qty: {item.quantity}
                        </div>

                        <div className="relative w-20 h-28 md:w-24 md:h-32 bg-[#F9F9F9] shrink-0 overflow-hidden">
                          <Image
                            src={
                              item.product.images?.hero
                                ? urlFor(item.product.images.hero).url()
                                : "/assets/placeholder.png"
                            }
                            alt={item.product.name}
                            fill
                            className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                          <div>
                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-black">
                              {item.selectedSize} | {item.selectedColor.label}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="font-black text-sm tracking-tighter">
                              {item.product.price}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.cartId)}
                              className="text-zinc-300 hover:text-[#be1e2d] transition-colors p-2"
                              title="Remove from bag"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "address" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl md:text-2xl font-light tracking-tighter uppercase leading-[0.9] mb-6 md:mb-8">
                  Saved <span className="font-black">Addresses</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="p-6 md:p-8 border border-black relative">
                    <span className="absolute top-4 right-4 text-[8px] font-black tracking-widest bg-black text-white px-2 py-1 uppercase">
                      Default
                    </span>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-black mb-4">
                      Shipping Address
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-600">
                      {session?.user?.name}
                      <br />
                      Westlands, Nairobi
                      <br />
                      Kenya
                    </p>
                  </div>
                  <button className="p-6 md:p-8 border border-dashed border-zinc-200 hover:border-black transition-all flex flex-col items-center justify-center gap-2 group">
                    <span className="text-2xl font-light group-hover:font-black transition-all">
                      +
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-zinc-400 group-hover:text-black">
                      Add New Address
                    </span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-light tracking-tighter uppercase leading-[0.9]">
                    Account <span className="font-black">Settings</span>
                  </h2>
                  {!isChangingPassword && !isEditingDetails && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#be1e2d] transition-colors"
                    >
                      <Lock size={14} />
                      Change Password
                    </button>
                  )}
                </div>

                <div className="max-w-xl space-y-8">
                  {/* Personal Details Section */}
                  <div className="border border-zinc-200 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[12px] font-black uppercase tracking-[0.3em]">
                        Personal Details
                      </h3>
                      {!isEditingDetails && !isChangingPassword && (
                        <button
                          onClick={() => setIsEditingDetails(true)}
                          className="text-[9px] font-black uppercase tracking-widest text-[#be1e2d] hover:text-black transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditingDetails ? (
                      <form
                        onSubmit={handlePersonalDetailsUpdate}
                        className="space-y-6"
                      >
                        <div className="space-y-3">
                          <label className={labelClasses}>Full Name</label>
                          <input
                            type="text"
                            value={personalData.name}
                            onChange={(e) =>
                              setPersonalData({ name: e.target.value })
                            }
                            className={inputClasses}
                            placeholder="Your name"
                            required
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            type="submit"
                            disabled={isSavingDetails}
                            className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-4 hover:bg-[#be1e2d] transition-colors disabled:opacity-50"
                          >
                            {isSavingDetails ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingDetails(false)}
                            className="px-6 py-4 border border-zinc-200 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-black mb-1">
                            Full Name
                          </p>
                          <p className="text-sm font-black">
                            {session?.user?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-black mb-1">
                            Email Address
                          </p>
                          <p className="text-sm font-black">
                            {session?.user?.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Password Change Section */}
                  {isChangingPassword && (
                    <div className="border border-zinc-200 p-6 md:p-8">
                      <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-6">
                        Update Password
                      </h3>

                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-6"
                      >
                        <div className="space-y-3">
                          <label className={labelClasses}>
                            <Key size={14} className="text-[#be1e2d]" /> Current
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? "text" : "password"}
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
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  current: !showPasswords.current,
                                })
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                            >
                              {showPasswords.current ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className={labelClasses}>
                            <Lock size={14} className="text-[#be1e2d]" /> New
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? "text" : "password"}
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
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  new: !showPasswords.new,
                                })
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                            >
                              {showPasswords.new ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className={labelClasses}>
                            <Lock size={14} className="text-[#be1e2d]" />{" "}
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
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
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  confirm: !showPasswords.confirm,
                                })
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                            >
                              {showPasswords.confirm ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[9px] font-black uppercase tracking-[0.2em] text-[#be1e2d] hover:text-black transition-colors"
                          >
                            Forgot Password?
                          </button>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button
                            type="submit"
                            disabled={isSavingPassword}
                            className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-4 hover:bg-[#be1e2d] transition-colors disabled:opacity-50"
                          >
                            {isSavingPassword ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Updating...
                              </div>
                            ) : (
                              "Update Password"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordError("");
                              setPasswordData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                            }}
                            className="px-6 py-4 border border-zinc-200 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
