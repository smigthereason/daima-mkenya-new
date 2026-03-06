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

//     const { amount, email, name, items, shippingAddress, phoneNumber } = body;

//     // Validate required fields
//     if (!amount) {
//       return NextResponse.json(
//         { error: "Missing required field: amount" },
//         { status: 400 },
//       );
//     }
//     if (!email) {
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
//       if (!item.product._id) {
//         return NextResponse.json(
//           {
//             error: `Item ${i} is missing product._id - this is critical for stock tracking`,
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

//     // Format items for Sanity with product references - define a proper type
//     type OrderItem = {
//       _key: string;
//       product: {
//         _type: "reference";
//         _ref: string;
//       };
//       productName: string;
//       quantity: number;
//       price: string;
//       size: string;
//       color: string;
//     };

//     const orderItems: OrderItem[] = items
//       .map((item: any, index: number) => {
//         const productId = item.product._id;

//         if (!productId) {
//           console.error(
//             "CRITICAL: Missing product ID for item:",
//             item.product.name,
//           );
//           return null;
//         }

//         return {
//           _key: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
//           product: {
//             _type: "reference" as const,
//             _ref: productId, // CRITICAL for stock updates
//           },
//           productName: item.product.name,
//           quantity: item.quantity,
//           price: item.product.price,
//           size: item.selectedSize,
//           color: item.selectedColor.label,
//         };
//       })
//       .filter((item): item is OrderItem => item !== null); // Type guard to filter out nulls

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

//     // FIRST: Update stock quantities immediately (since payment is already done)
//     console.log("Updating stock quantities for items...");
//     const stockUpdates = [];

//     for (const item of orderItems) {
//       try {
//         // Get current product stock
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

//           // Update the product stock
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

//     // Check if all stock updates were successful
//     const allStockUpdated = stockUpdates.every((update) => update.success);

//     if (!allStockUpdated) {
//       console.error(
//         "Some stock updates failed:",
//         stockUpdates.filter((u) => !u.success),
//       );
//       // Continue anyway? Or return error? For now, we'll continue but log the error
//     }

//     // Create order in Sanity with PAID status immediately
//     const orderData = {
//       _type: "order",
//       orderNumber,
//       user: {
//         _type: "reference",
//         _ref: user._id,
//       },
//       userEmail: session.user.email,
//       status: "completed", // Set to completed immediately
//       paymentStatus: "paid", // Set to paid immediately
//       paymentMethod: "pesapal",
//       paymentDate: new Date().toISOString(), // Set payment date now
//       customer: {
//         name,
//         email,
//         phone: phoneNumber,
//         address: shippingAddress || "",
//       },
//       amount,
//       items: orderItems,
//       createdAt: new Date().toISOString(),
//       // Store stock update info for reference
//       stockUpdates: stockUpdates,
//     };

//     const sanityOrder = await client.create(orderData);
//     console.log("✅ Order created in Sanity with PAID status:", {
//       id: sanityOrder._id,
//       orderNumber,
//       status: "completed",
//       paymentStatus: "paid",
//       itemCount: orderItems.length,
//       stockUpdates: stockUpdates.length,
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
//         email_address: email,
//         phone_number: phoneNumber,
//         country_code: "KE",
//         first_name: name.split(" ")[0] || name,
//         middle_name: "",
//         last_name: name.split(" ").slice(1).join(" ") || "",
//         line_1: shippingAddress || "Nairobi",
//         line_2: "",
//         city: "Nairobi",
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
//       stockUpdates: stockUpdates, // Return stock update info for debugging
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

    // Create order in Sanity
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
      amount,
      shippingFee: shippingFee || 0,
      items: orderItems,
      stockUpdates: stockUpdates,
      createdAt: new Date().toISOString(),
    };

    const sanityOrder = await client.create(orderData);
    console.log("✅ Order created in Sanity:", {
      id: sanityOrder._id,
      orderNumber,
    });

    // Authenticate with PesaPal V3
    const token = await getPesaPalAuthToken();

    // Register IPN (Instant Payment Notification)
    const ipnId = await registerIPN(token);

    // Prepare PesaPal Order Payload
    const pesapalOrderData = {
      id: orderNumber,
      currency: "KES",
      amount: amount,
      description: "Daima Mkenya Purchase",
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

    console.log("Sending to PesaPal...");

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
      throw new Error(result.message || "Order submission failed");
    }

    // Update the Sanity order with PesaPal tracking IDs
    await client
      .patch(sanityOrder._id)
      .set({
        pesapalOrderTrackingId: result.order_tracking_id,
        transactionId: result.order_tracking_id,
      })
      .commit();

    // Return the redirect_url for the frontend
    return NextResponse.json({
      redirect_url: result.redirect_url,
      order_tracking_id: result.order_tracking_id,
      merchant_reference: result.merchant_reference || orderNumber,
      orderId: sanityOrder._id,
      stockUpdates: stockUpdates,
    });
  } catch (error: any) {
    console.error("Internal Server Error in Register Order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
