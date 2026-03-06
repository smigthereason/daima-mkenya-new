// scripts/fix-all-orders.ts
import { client } from "@/sanity/lib/client";

async function fixAllOrders() {
  try {
    // Fetch all orders
    const orders = await client.fetch(
      `*[_type == "order"] | order(_createdAt desc) {
        _id,
        _createdAt,
        orderNumber,
        amount,
        shippingFee,
        status,
        paymentStatus,
        paymentMethod,
        paymentDate,
        pesapalOrderTrackingId,
        transactionId,
        email,
        name,
        phoneNumber,
        city,
        pickupStation,
        pickupStationId,
        address,
        deliveryMethod,
        "customer": customer,
        "deliveryDetails": deliveryDetails,
        "items": items[] {
          _key,
          product,
          productName,
          name,
          quantity,
          price,
          size,
          color,
          selectedSize,
          selectedColor
        },
        "stockUpdates": stockUpdates,
        "paymentDetails": paymentDetails
      }`,
    );

    console.log(`Found ${orders.length} orders to fix`);

    for (const order of orders) {
      console.log(`\n📦 Fixing order: ${order.orderNumber || order._id}`);

      // Prepare fixed items
      const fixedItems = (order.items || []).map((item: any, index: number) => {
        // Extract color label properly
        let colorValue = "";
        if (item.color) {
          colorValue = item.color;
        } else if (item.selectedColor?.label) {
          colorValue = item.selectedColor.label;
        } else if (item.selectedColor) {
          colorValue = item.selectedColor;
        }

        return {
          _key: item._key || `item-${Date.now()}-${index}`,
          product: item.product || { _type: "reference", _ref: "" },
          productName: item.productName || item.name || "Unknown Product",
          quantity: item.quantity || 1,
          price:
            typeof item.price === "string"
              ? parseFloat(item.price)
              : item.price || 0,
          size: item.size || item.selectedSize || "",
          color: colorValue,
        };
      });

      // Prepare customer object
      const fixedCustomer = {
        name: order.customer?.name || order.name || "Victor Maina",
        phone: order.customer?.phone || order.phoneNumber || "0707098723",
        email:
          order.email || order.customer?.email || "victor.dmaina@gmail.com",
      };

      // Prepare delivery details
      const fixedDeliveryDetails = {
        method:
          order.deliveryMethod || order.deliveryDetails?.method || "pickup",
        city: order.city || order.deliveryDetails?.city || "Nairobi",
        pickupStationName:
          order.pickupStation || order.deliveryDetails?.pickupStationName || "",
        pickupStationId:
          order.pickupStationId || order.deliveryDetails?.pickupStationId || "",
        shippingAddress:
          order.address || order.deliveryDetails?.shippingAddress || "",
      };

      // If it's the specific order with Nation Centre, set the pickup details
      if (
        order.orderNumber === "ORD-1772809831774-874" ||
        order.pickupStation === "Nation Centre - CBD"
      ) {
        fixedDeliveryDetails.pickupStationName = "Nation Centre - CBD";
        fixedDeliveryDetails.pickupStationId = "n1";
      }

      // Prepare updates
      const updates: any = {
        // Customer info
        customer: fixedCustomer,

        // Delivery details
        deliveryDetails: fixedDeliveryDetails,

        // Items
        items: fixedItems,

        // Ensure payment fields are present
        paymentStatus: order.paymentStatus || "paid",
        status: order.status || "completed",
        paymentMethod: order.paymentMethod || "mpesa",
        paymentDate: order.paymentDate || new Date().toISOString(),

        // Keep existing fields
        amount: order.amount || 0,
        shippingFee: order.shippingFee || 0,
        orderNumber: order.orderNumber,
        pesapalOrderTrackingId: order.pesapalOrderTrackingId || "",
        transactionId: order.transactionId || "",
      };

      // Add stockUpdates if they exist
      if (order.stockUpdates && order.stockUpdates.length > 0) {
        updates.stockUpdates = order.stockUpdates;
      }

      // Add paymentDetails if they exist
      if (order.paymentDetails) {
        updates.paymentDetails = order.paymentDetails;
      }

      // Fields to remove (old root-level fields)
      const fieldsToRemove = [
        "email",
        "name",
        "phoneNumber",
        "city",
        "pickupStation",
        "pickupStationId",
        "address",
        "deliveryMethod",
      ];

      // Update the order
      try {
        const result = await client
          .patch(order._id)
          .set(updates)
          .unset(fieldsToRemove)
          .commit();

        console.log(
          `  ✅ Fixed: ${fixedItems.length} items, Customer: ${fixedCustomer.email}`,
        );
      } catch (error) {
        console.error(`  ❌ Error fixing order ${order._id}:`, error);
      }
    }

    console.log("\n🎉 All orders fixed successfully!");
  } catch (error) {
    console.error("Error in fixAllOrders:", error);
  }
}

fixAllOrders();
