// app/admin/orders/page.tsx
import { serverClient } from "@/sanity/lib/server-client";
import OrderList from "./OrderList";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrderManagementPage() {
  const orders = await serverClient.fetch(
    `*[_type == "order"] | order(_createdAt desc) {
      _id,
      orderNumber,
      status,
      paymentStatus,
      paymentMethod,
      amount,
      shippingFee,
      _createdAt,
      pesapalOrderTrackingId,
      transactionId,
      customer {
        name,
        phone,
        email
      },
      deliveryDetails {
        method,
        city,
        pickupStationName,
        pickupStationId,
        shippingAddress
      },
      items[] {
        productName,
        quantity,
        price,
        size,
        color
      }
    }`,
  );

  console.log("Fetched orders:", JSON.stringify(orders, null, 2)); // For debugging

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-10 animate-fadeIn">
      <div className="border-b border-neutral-100 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tighter uppercase leading-[0.9]">
            Order <span className="font-black">Management</span>
          </h1>
          <p className="text-[10px] md:text-[11px] text-neutral-400 uppercase tracking-widest font-medium mt-2">
            Track, fulfill, and update shipment status
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 border border-neutral-100">
          <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <p className="text-neutral-500 text-sm font-medium">
            No orders found
          </p>
        </div>
      ) : (
        <OrderList initialOrders={orders} />
      )}
    </div>
  );
}
