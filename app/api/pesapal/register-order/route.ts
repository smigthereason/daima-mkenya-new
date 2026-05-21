// import { NextResponse } from "next/server";
// import { getPesaPalAuthToken, registerIPN } from "@/lib/pesapal";
// import { client } from "@/sanity/lib/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   try {
//     // Get the authenticated user session
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please log in" },
//         { status: 401 },
//       );
//     }

//     const body = await req.json();
//     console.log("Register order received:", JSON.stringify(body, null, 2));

//     // Destructure with new payload structure
//     const { amount, customer, email, items, deliveryDetails, shippingFee } =
//       body;

//     // Extract customer details
//     const name = customer?.name;
//     const phoneNumber = customer?.phone;
//     const customerEmail = customer?.email || email;
//     const shippingAddress = deliveryDetails?.shippingAddress || "";
//     const city = deliveryDetails?.city || "Nairobi";
//     const pickupStationName = deliveryDetails?.pickupStationName || "";
//     const pickupStationId = deliveryDetails?.pickupStationId || "";

//     // Validate required fields
//     if (!amount) {
//       return NextResponse.json(
//         { error: "Missing required field: amount" },
//         { status: 400 },
//       );
//     }
//     if (!customerEmail) {
//       return NextResponse.json(
//         { error: "Missing required field: email" },
//         { status: 400 },
//       );
//     }
//     if (!name) {
//       return NextResponse.json(
//         { error: "Missing required field: name" },
//         { status: 400 },
//       );
//     }
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return NextResponse.json(
//         { error: "Missing required field: items (must be a non-empty array)" },
//         { status: 400 },
//       );
//     }

//     // Validate phone number
//     if (!phoneNumber) {
//       return NextResponse.json(
//         { error: "Phone number is required for payment" },
//         { status: 400 },
//       );
//     }

//     // Validate each item has required fields and product ID
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       if (!item.product) {
//         return NextResponse.json(
//           { error: `Item ${i} is missing product object` },
//           { status: 400 },
//         );
//       }
//       if (!item.product._ref) {
//         return NextResponse.json(
//           {
//             error: `Item ${i} is missing product._ref - this is critical for stock tracking`,
//           },
//           { status: 400 },
//         );
//       }
//     }

//     // Find the user in Sanity by email
//     let user = await client.fetch(
//       `*[_type == "user" && email == $email][0] {
//         _id,
//         email,
//         name
//       }`,
//       { email: session.user.email },
//     );

//     if (!user) {
//       console.log("User not found in Sanity, creating user document...");

//       // Create user in Sanity if they don't exist
//       const newUser = await client.create({
//         _type: "user",
//         email: session.user.email,
//         name: session.user.name || name,
//         image: session.user.image || "",
//       });

//       user = { _id: newUser._id, email: newUser.email };
//     }

//     // Generate unique order number
//     const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//     // Format items for Sanity with product references
//     type OrderItem = {
//       _key: string;
//       product: {
//         _type: "reference";
//         _ref: string;
//       };
//       productName: string;
//       quantity: number;
//       price: number;
//       size: string;
//       color: string;
//     };

//     const orderItems: OrderItem[] = items
//       .map((item: any, index: number) => {
//         const productId = item.product._ref;

//         if (!productId) {
//           console.error(
//             "CRITICAL: Missing product ID for item:",
//             item.productName,
//           );
//           return null;
//         }

//         return {
//           _key: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
//           product: {
//             _type: "reference" as const,
//             _ref: productId,
//           },
//           productName: item.productName,
//           quantity: item.quantity,
//           price: item.price,
//           size: item.size || "",
//           color: item.color || "",
//         };
//       })
//       .filter((item): item is OrderItem => item !== null);

//     if (orderItems.length === 0) {
//       return NextResponse.json(
//         { error: "No valid items with product references" },
//         { status: 400 },
//       );
//     }

//     console.log(
//       "Order items with product references:",
//       orderItems.map((i) => ({
//         productRef: i.product._ref,
//         productName: i.productName,
//         quantity: i.quantity,
//       })),
//     );

//     // Update stock quantities
//     console.log("Updating stock quantities for items...");
//     const stockUpdates = [];

//     for (const item of orderItems) {
//       try {
//         const product = await client.fetch(
//           `*[_type == "product" && _id == $productId][0] {
//             _id,
//             stock,
//             name
//           }`,
//           { productId: item.product._ref },
//         );

//         if (product) {
//           const currentStock = product.stock || 0;
//           const newStock = Math.max(0, currentStock - item.quantity);

//           await client.patch(product._id).set({ stock: newStock }).commit();

//           console.log(
//             `✓ Updated stock for ${product.name}: ${currentStock} → ${newStock} (sold: ${item.quantity})`,
//           );

//           stockUpdates.push({
//             success: true,
//             productId: product._id,
//             productName: product.name,
//             previousStock: currentStock,
//             newStock,
//           });
//         } else {
//           console.error(`✗ Product not found: ${item.product._ref}`);
//           stockUpdates.push({
//             success: false,
//             productId: item.product._ref,
//             productName: item.productName,
//             error: "Product not found",
//           });
//         }
//       } catch (error) {
//         console.error(`✗ Error updating stock for ${item.productName}:`, error);
//         stockUpdates.push({
//           success: false,
//           productId: item.product._ref,
//           productName: item.productName,
//           error: error instanceof Error ? error.message : "Unknown error",
//         });
//       }
//     }

//     // Create order in Sanity
//     const orderData = {
//       _type: "order",
//       orderNumber,
//       user: {
//         _type: "reference",
//         _ref: user._id,
//       },
//       userEmail: session.user.email,
//       status: "pending", // Start as pending
//       paymentStatus: "pending", // Start as pending
//       paymentMethod: "pesapal",
//       paymentDate: new Date().toISOString(),
//       customer: {
//         name,
//         email: customerEmail,
//         phone: phoneNumber,
//       },
//       deliveryDetails: {
//         method: "pickup",
//         city: city,
//         pickupStationName: pickupStationName,
//         pickupStationId: pickupStationId,
//         shippingAddress: shippingAddress || "",
//       },
//       amount,
//       shippingFee: shippingFee || 0,
//       items: orderItems,
//       stockUpdates: stockUpdates,
//       createdAt: new Date().toISOString(),
//     };

//     const sanityOrder = await client.create(orderData);
//     console.log("✅ Order created in Sanity:", {
//       id: sanityOrder._id,
//       orderNumber,
//     });

//     // Authenticate with PesaPal V3
//     const token = await getPesaPalAuthToken();

//     // Register IPN (Instant Payment Notification)
//     const ipnId = await registerIPN(token);

//     // Prepare PesaPal Order Payload
//     const pesapalOrderData = {
//       id: orderNumber,
//       currency: "KES",
//       amount: amount,
//       description: "Daima Mkenya Purchase",
//       callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${sanityOrder._id}`,
//       notification_id: ipnId,
//       branch: "Daima Mkenya",
//       redirect_mode: "TOP_WINDOW",
//       billing_address: {
//         email_address: customerEmail,
//         phone_number: phoneNumber,
//         country_code: "KE",
//         first_name: name.split(" ")[0] || name,
//         middle_name: "",
//         last_name: name.split(" ").slice(1).join(" ") || "",
//         line_1: shippingAddress || pickupStationName || "Nairobi",
//         line_2: "",
//         city: city,
//         state: "",
//         postal_code: "",
//         zip_code: "",
//       },
//     };

//     console.log("Sending to PesaPal...");

//     // Submit Order to PesaPal
//     const response = await fetch(
//       `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(pesapalOrderData),
//       },
//     );

//     const result = await response.json();
//     console.log("PesaPal response:", result);

//     if (result.status !== "200" && result.status !== 200) {
//       console.error("PesaPal Order Submission Error:", result);
//       throw new Error(result.message || "Order submission failed");
//     }

//     // Update the Sanity order with PesaPal tracking IDs
//     await client
//       .patch(sanityOrder._id)
//       .set({
//         pesapalOrderTrackingId: result.order_tracking_id,
//         transactionId: result.order_tracking_id,
//       })
//       .commit();

//     // Return the redirect_url for the frontend
//     return NextResponse.json({
//       redirect_url: result.redirect_url,
//       order_tracking_id: result.order_tracking_id,
//       merchant_reference: result.merchant_reference || orderNumber,
//       orderId: sanityOrder._id,
//       stockUpdates: stockUpdates,
//     });
//   } catch (error: any) {
//     console.error("Internal Server Error in Register Order:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
import { NextResponse } from "next/server";
import { getPesaPalAuthToken, registerIPN } from "@/lib/pesapal";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 },
      );
    }

    const body = await req.json();
    console.log("Register order received:", JSON.stringify(body, null, 2));

    // Destructure with new payload structure
    const { amount, customer, email, items, deliveryDetails, shippingFee } =
      body;

    // Extract customer details
    const name = customer?.name;
    const phoneNumber = customer?.phone;
    const customerEmail = customer?.email || email;
    const shippingAddress = deliveryDetails?.shippingAddress || "";
    const city = deliveryDetails?.city || "Nairobi";
    const pickupStationName = deliveryDetails?.pickupStationName || "";
    const pickupStationId = deliveryDetails?.pickupStationId || "";

    // Validate required fields
    if (!amount) {
      return NextResponse.json(
        { error: "Missing required field: amount" },
        { status: 400 },
      );
    }
    if (!customerEmail) {
      return NextResponse.json(
        { error: "Missing required field: email" },
        { status: 400 },
      );
    }
    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 },
      );
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: items (must be a non-empty array)" },
        { status: 400 },
      );
    }

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required for payment" },
        { status: 400 },
      );
    }

    // Validate each item has required fields and product ID
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product) {
        return NextResponse.json(
          { error: `Item ${i} is missing product object` },
          { status: 400 },
        );
      }
      if (!item.product._ref) {
        return NextResponse.json(
          {
            error: `Item ${i} is missing product._ref - this is critical for stock tracking`,
          },
          { status: 400 },
        );
      }
    }

    // ========== PESAPAL AMOUNT LIMIT HANDLING ==========
    const PESAPAL_ENVIRONMENT = process.env.PESAPAL_ENVIRONMENT || "sandbox";
    const TEST_MODE = process.env.NODE_ENV === "development";
    const MAX_SANDBOX_AMOUNT = 2000; // PesaPal sandbox limit

    let finalAmount = amount;
    let isAmountReduced = false;
    let originalAmount = amount;

    // Check if amount exceeds sandbox limit
    if (PESAPAL_ENVIRONMENT === "sandbox" && amount > MAX_SANDBOX_AMOUNT) {
      if (TEST_MODE) {
        // In development/test mode, reduce the amount for PesaPal
        finalAmount = 500; // Use a safe test amount
        isAmountReduced = true;
        console.warn(
          `⚠️ DEVELOPMENT MODE: Amount reduced from KES ${amount} to KES ${finalAmount} for PesaPal processing`,
        );
        console.warn(
          `⚠️ Original amount KES ${amount} will be stored in order record for reference`,
        );
      } else {
        // In production mode (not development), return error
        console.error(
          `❌ Amount ${amount} exceeds sandbox limit of ${MAX_SANDBOX_AMOUNT}`,
        );
        return NextResponse.json(
          {
            error: `Transaction amount KES ${amount} exceeds sandbox limit of KES ${MAX_SANDBOX_AMOUNT}. Please contact support to increase your transaction limit.`,
            maxAllowed: MAX_SANDBOX_AMOUNT,
            currentAmount: amount,
            environment: PESAPAL_ENVIRONMENT,
          },
          { status: 400 },
        );
      }
    }

    // Also check for unusually high amounts in production
    if (PESAPAL_ENVIRONMENT === "production" && amount > 500000) {
      console.warn(
        `⚠️ PRODUCTION WARNING: Amount KES ${amount} is very high. Consider adding additional verification.`,
      );
    }
    // ========== END AMOUNT LIMIT HANDLING ==========

    // Find the user in Sanity by email
    let user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        email,
        name
      }`,
      { email: session.user.email },
    );

    if (!user) {
      console.log("User not found in Sanity, creating user document...");

      // Create user in Sanity if they don't exist
      const newUser = await client.create({
        _type: "user",
        email: session.user.email,
        name: session.user.name || name,
        image: session.user.image || "",
      });

      user = { _id: newUser._id, email: newUser.email };
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Format items for Sanity with product references
    type OrderItem = {
      _key: string;
      product: {
        _type: "reference";
        _ref: string;
      };
      productName: string;
      quantity: number;
      price: number;
      size: string;
      color: string;
    };

    const orderItems: OrderItem[] = items
      .map((item: any, index: number) => {
        const productId = item.product._ref;

        if (!productId) {
          console.error(
            "CRITICAL: Missing product ID for item:",
            item.productName,
          );
          return null;
        }

        return {
          _key: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
          product: {
            _type: "reference" as const,
            _ref: productId,
          },
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          size: item.size || "",
          color: item.color || "",
        };
      })
      .filter((item): item is OrderItem => item !== null);

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items with product references" },
        { status: 400 },
      );
    }

    console.log(
      "Order items with product references:",
      orderItems.map((i) => ({
        productRef: i.product._ref,
        productName: i.productName,
        quantity: i.quantity,
      })),
    );

    // Update stock quantities
    console.log("Updating stock quantities for items...");
    const stockUpdates = [];

    for (const item of orderItems) {
      try {
        const product = await client.fetch(
          `*[_type == "product" && _id == $productId][0] {
            _id,
            stock,
            name
          }`,
          { productId: item.product._ref },
        );

        if (product) {
          const currentStock = product.stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);

          await client.patch(product._id).set({ stock: newStock }).commit();

          console.log(
            `✓ Updated stock for ${product.name}: ${currentStock} → ${newStock} (sold: ${item.quantity})`,
          );

          stockUpdates.push({
            success: true,
            productId: product._id,
            productName: product.name,
            previousStock: currentStock,
            newStock,
          });
        } else {
          console.error(`✗ Product not found: ${item.product._ref}`);
          stockUpdates.push({
            success: false,
            productId: item.product._ref,
            productName: item.productName,
            error: "Product not found",
          });
        }
      } catch (error) {
        console.error(`✗ Error updating stock for ${item.productName}:`, error);
        stockUpdates.push({
          success: false,
          productId: item.product._ref,
          productName: item.productName,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Create order in Sanity with original amount and tracking info
    const orderData = {
      _type: "order",
      orderNumber,
      user: {
        _type: "reference",
        _ref: user._id,
      },
      userEmail: session.user.email,
      status: "pending", // Start as pending
      paymentStatus: "pending", // Start as pending
      paymentMethod: "pesapal",
      paymentDate: new Date().toISOString(),
      customer: {
        name,
        email: customerEmail,
        phone: phoneNumber,
      },
      deliveryDetails: {
        method: "pickup",
        city: city,
        pickupStationName: pickupStationName,
        pickupStationId: pickupStationId,
        shippingAddress: shippingAddress || "",
      },
      amount: originalAmount, // Store original amount
      shippingFee: shippingFee || 0,
      items: orderItems,
      stockUpdates: stockUpdates,
      createdAt: new Date().toISOString(),
      // Add metadata about amount adjustment if needed
      ...(isAmountReduced && {
        testModeAmount: finalAmount,
        originalAmount: originalAmount,
        isTestModeReduction: true,
      }),
    };

    const sanityOrder = await client.create(orderData);
    console.log("✅ Order created in Sanity:", {
      id: sanityOrder._id,
      orderNumber,
      amount: originalAmount,
      ...(isAmountReduced && { testAmount: finalAmount }),
    });

    // Authenticate with PesaPal V3
    const token = await getPesaPalAuthToken();

    // Register IPN (Instant Payment Notification)
    const ipnId = await registerIPN(token);

    // Prepare PesaPal Order Payload with potentially reduced amount
    const pesapalOrderData = {
      id: orderNumber,
      currency: "KES",
      amount: finalAmount, // Use reduced amount for PesaPal if needed
      description: isAmountReduced
        ? `[TEST MODE] Daima Mkenya Purchase - Original: KES ${originalAmount} - Charging: KES ${finalAmount}`
        : "Daima Mkenya Purchase",
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${sanityOrder._id}`,
      notification_id: ipnId,
      branch: "Daima Mkenya",
      redirect_mode: "TOP_WINDOW",
      billing_address: {
        email_address: customerEmail,
        phone_number: phoneNumber,
        country_code: "KE",
        first_name: name.split(" ")[0] || name,
        middle_name: "",
        last_name: name.split(" ").slice(1).join(" ") || "",
        line_1: shippingAddress || pickupStationName || "Nairobi",
        line_2: "",
        city: city,
        state: "",
        postal_code: "",
        zip_code: "",
      },
    };

    console.log("Sending to PesaPal with amount:", {
      original: originalAmount,
      final: finalAmount,
      reduced: isAmountReduced,
      environment: PESAPAL_ENVIRONMENT,
    });

    // Submit Order to PesaPal
    const response = await fetch(
      `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(pesapalOrderData),
      },
    );

    const result = await response.json();
    console.log("PesaPal response:", result);

    if (result.status !== "200" && result.status !== 200) {
      console.error("PesaPal Order Submission Error:", result);

      // Provide more helpful error message
      let errorMessage = result.message || "Order submission failed";
      if (result.error?.code === "amount_exceeds_default_limit") {
        errorMessage = `Amount KES ${originalAmount} exceeds your PesaPal transaction limit. For sandbox testing, the maximum is KES ${MAX_SANDBOX_AMOUNT}. Please contact PesaPal support to increase your limit or reduce order value.`;
      }

      throw new Error(errorMessage);
    }

    // Update the Sanity order with PesaPal tracking IDs and amount information
    const updateData: any = {
      pesapalOrderTrackingId: result.order_tracking_id,
      transactionId: result.order_tracking_id,
    };

    if (isAmountReduced) {
      updateData.originalAmount = originalAmount;
      updateData.chargedAmount = finalAmount;
      updateData.isTestModeReduction = true;
      updateData.testMode = TEST_MODE;
    }

    await client.patch(sanityOrder._id).set(updateData).commit();

    // Return the redirect_url for the frontend
    return NextResponse.json({
      redirect_url: result.redirect_url,
      order_tracking_id: result.order_tracking_id,
      merchant_reference: result.merchant_reference || orderNumber,
      orderId: sanityOrder._id,
      stockUpdates: stockUpdates,
      amountInfo: {
        original: originalAmount,
        charged: finalAmount,
        reduced: isAmountReduced,
      },
    });
  } catch (error: any) {
    console.error("Internal Server Error in Register Order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
