// // app/api/pesapal/register-order/route.ts

// import { NextResponse } from "next/server";
// import { getPesaPalAuthToken, registerIPN } from "@/lib/pesapal";
// import { client } from "@/sanity/lib/client";

// export async function POST(req: Request) {
//   try {
//     const { amount, email, name, items, shippingAddress } = await req.json();

//     // Validate required fields
//     if (!amount || !email || !name || !items) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     // 1. Generate order number
//     const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//     // 2. Create order items with auto-generated keys
//     const orderItems = items.map((item: any, index: number) => ({
//       _key: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
//       productName: item.product.name,
//       quantity: item.quantity,
//       price: item.product.price,
//       size: item.selectedSize,
//       color: item.selectedColor.label,
//     }));

//     // 3. Create order in Sanity with COMPLETED status immediately
//     const orderData = {
//       _type: "order",
//       orderNumber,
//       status: "completed", // Set to completed immediately
//       paymentMethod: "pesapal",
//       paymentDate: new Date().toISOString(),
//       customer: {
//         name,
//         email,
//         phone: "",
//         address: shippingAddress || "",
//       },
//       amount,
//       items: orderItems,
//       createdAt: new Date().toISOString(),
//     };

//     const sanityOrder = await client.create(orderData);
//     console.log("Order created in Sanity with COMPLETED status:", sanityOrder);

//     // 4. Authenticate with PesaPal
//     const token = await getPesaPalAuthToken();

//     // 5. Register IPN
//     const ipnId = await registerIPN(token);

//     // 6. Submit Order to PesaPal V3
//     const pesapalOrderData = {
//       id: orderNumber,
//       currency: "KES",
//       amount: amount,
//       description: "Daima Mkenya Purchase",
//       callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${sanityOrder._id}`,
//       notification_id: ipnId,
//       branch: "Daima Mkenya",
//       billing_address: {
//         email_address: email,
//         phone_number: "",
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

//     if (result.status !== "200" && result.status !== 200) {
//       console.error("PesaPal Order Error:", result);
//       throw new Error(result.message || "Order submission failed");
//     }

//     // 7. Update Sanity order with PesaPal tracking ID
//     await client
//       .patch(sanityOrder._id)
//       .set({
//         pesapalOrderTrackingId: result.order_tracking_id,
//         transactionId: result.order_tracking_id,
//       })
//       .commit();

//     // Return the redirect URL for the frontend
//     return NextResponse.json({
//       redirect_url: result.redirect_url,
//       order_tracking_id: result.order_tracking_id,
//       merchant_reference: result.merchant_reference || orderNumber,
//       orderId: sanityOrder._id,
//     });
//   } catch (error: any) {
//     console.error("PesaPal Order Error:", error);
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

    const { amount, email, name, items, shippingAddress } = await req.json();

    // Validate required fields
    if (!amount || !email || !name || !items) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
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

    // Format items for Sanity
    const orderItems = items.map((item: any, index: number) => ({
      _key: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      size: item.selectedSize,
      color: item.selectedColor.label,
    }));

    // Create order in Sanity with user reference - CRITICAL FIX
    const orderData = {
      _type: "order",
      orderNumber,
      user: {
        _type: "reference",
        _ref: user._id,
      },
      userEmail: session.user.email, // THIS MUST BE SET
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: "pesapal",
      paymentDate: new Date().toISOString(),
      customer: {
        name,
        email,
        phone: "",
        address: shippingAddress || "",
      },
      amount,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    const sanityOrder = await client.create(orderData);
    console.log("Order created in Sanity with user reference:", {
      id: sanityOrder._id,
      orderNumber,
      userEmail: session.user.email,
      userId: user._id,
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
        email_address: email,
        phone_number: "",
        country_code: "KE",
        first_name: name.split(" ")[0] || name,
        middle_name: "",
        last_name: name.split(" ").slice(1).join(" ") || "",
        line_1: shippingAddress || "Nairobi",
        line_2: "",
        city: "Nairobi",
        state: "",
        postal_code: "",
        zip_code: "",
      },
    };

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

    // Return the redirect_url for the frontend's window.PesaPal.pay() call
    return NextResponse.json({
      redirect_url: result.redirect_url,
      order_tracking_id: result.order_tracking_id,
      merchant_reference: result.merchant_reference || orderNumber,
      orderId: sanityOrder._id,
    });
  } catch (error: any) {
    console.error("Internal Server Error in Register Order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
