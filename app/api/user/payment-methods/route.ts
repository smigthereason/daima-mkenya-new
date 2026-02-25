// // app/api/user/payment-methods/route.ts
// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";
// import { authOptions } from "../../auth/[...nextauth]/route"; // This will now work
// import { client } from "@/sanity/lib/client";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = await client.fetch(
//       `*[_type == "user" && email == $email][0]{
//         paymentMethods
//       }`,
//       { email: session.user.email }
//     );

//     return NextResponse.json({ paymentMethods: user?.paymentMethods || [] });
//   } catch (error) {
//     console.error("Error fetching payment methods:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { type, details, isDefault } = await request.json();

//     // Get existing user
//     const user = await client.fetch(
//       `*[_type == "user" && email == $email][0]{
//         _id,
//         paymentMethods
//       }`,
//       { email: session.user.email }
//     );

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const newMethod = {
//       _key: `${type}-${Date.now()}`,
//       id: `${type}-${Date.now()}`,
//       type,
//       details,
//       isDefault: isDefault || false,
//       createdAt: new Date().toISOString()
//     };

//     let paymentMethods = user.paymentMethods || [];

//     // If this is set as default, remove default from others
//     if (isDefault) {
//       paymentMethods = paymentMethods.map((method: any) => ({
//         ...method,
//         isDefault: false
//       }));
//     }

//     // Add new method
//     paymentMethods.push(newMethod);

//     // Update user in Sanity
//     await client
//       .patch(user._id)
//       .set({ paymentMethods })
//       .commit();

//     return NextResponse.json({ success: true, paymentMethod: newMethod });
//   } catch (error) {
//     console.error("Error adding payment method:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { methodId, isDefault } = await request.json();

//     const user = await client.fetch(
//       `*[_type == "user" && email == $email][0]{
//         _id,
//         paymentMethods
//       }`,
//       { email: session.user.email }
//     );

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     let paymentMethods = (user.paymentMethods || []).map((method: any) => ({
//       ...method,
//       isDefault: method.id === methodId ? isDefault : false
//     }));

//     await client
//       .patch(user._id)
//       .set({ paymentMethods })
//       .commit();

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error updating payment method:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const methodId = searchParams.get('id');

//     if (!methodId) {
//       return NextResponse.json({ error: "Method ID required" }, { status: 400 });
//     }

//     const user = await client.fetch(
//       `*[_type == "user" && email == $email][0]{
//         _id,
//         paymentMethods
//       }`,
//       { email: session.user.email }
//     );

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const paymentMethods = (user.paymentMethods || []).filter(
//       (method: any) => method.id !== methodId
//     );

//     await client
//       .patch(user._id)
//       .set({ paymentMethods })
//       .commit();

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting payment method:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
//
// // app/api/user/payment-methods/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Just return empty array since we're only using PesaPal
    return NextResponse.json({ paymentMethods: [] });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Payment methods are not supported" },
    { status: 400 },
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Payment methods are not supported" },
    { status: 400 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Payment methods are not supported" },
    { status: 400 },
  );
}
