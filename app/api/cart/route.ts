// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
// Use the no-cache client here (not the CDN-cached one) — this route reads
// data back immediately after every write, and the CDN can lag behind
// writes by up to ~60s, causing the cart to appear to "lose" items until
// the cache catches up.
import { serverClient as client } from "@/sanity/lib/server-client";

// Cache for user IDs to reduce queries — only needed on the very first
// cart a user ever creates (see note below), but kept for that path.
const userCache = new Map<string, { id: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to get user ID with caching
async function getUserId(email: string) {
  const cached = userCache.get(email);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.id;
  }

  const user = await client.fetch(
    `*[_type == "user" && email == $email][0]._id`,
    { email },
  );

  if (user) {
    userCache.set(email, { id: user, timestamp: Date.now() });
  }

  return user;
}

const CART_PROJECTION = `{
  _id,
  items[] {
    cartId,
    quantity,
    selectedSize,
    selectedColor,
    addedAt,
    product-> {
      _id,
      name,
      price,
      images,
      colors,
      sizes,
      slug
    }
  }
}`;

// GET /api/cart - Fetch user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Every cart document stores userEmail at creation time, so we can
    // fetch it directly — no separate userId lookup needed. This is the
    // single most-called endpoint in the cart flow, so cutting it from
    // 2 round trips to 1 matters most here.
    const cart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0] ${CART_PROJECTION}`,
      { email: session.user.email },
    );

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    const {
      product,
      quantity = 1,
      selectedSize,
      selectedColor,
    } = await req.json();

    if (!product?._id) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 },
      );
    }

    // Find existing cart directly by email — no userId round trip.
    let cart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0] { _id, items }`,
      { email },
    );

    const cartId = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const itemKey = `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newItem = {
      _key: itemKey,
      cartId,
      product: {
        _type: "reference",
        _ref: product._id,
      },
      quantity,
      selectedSize,
      selectedColor,
      addedAt: new Date().toISOString(),
    };

    if (!cart) {
      // First-ever cart for this user — this is the one path that still
      // needs the user document's _id, since a brand-new cart requires a
      // real `user` reference, not just the email string.
      const userId = await getUserId(email);

      if (!userId) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      await client.create({
        _type: "cart",
        user: {
          _type: "reference",
          _ref: userId,
        },
        userEmail: email,
        items: [newItem],
        lastUpdated: new Date().toISOString(),
      });
    } else {
      // Check if item already exists with same size and color
      const existingItemIndex =
        cart.items?.findIndex(
          (item: any) =>
            item.product._ref === product._id &&
            item.selectedSize === selectedSize &&
            item.selectedColor.label === selectedColor.label,
        ) ?? -1;

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...cart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };

        await client
          .patch(cart._id)
          .set({
            items: updatedItems,
            lastUpdated: new Date().toISOString(),
          })
          .commit();
      } else {
        // Add new item
        await client
          .patch(cart._id)
          .setIfMissing({ items: [] })
          .append("items", [newItem])
          .set({ lastUpdated: new Date().toISOString() })
          .commit({ autoGenerateArrayKeys: true });
      }
    }

    // Fetch updated cart with product details
    const updatedCart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0] ${CART_PROJECTION}`,
      { email },
    );

    return NextResponse.json({
      success: true,
      items: updatedCart?.items || [],
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

// PATCH /api/cart - Update item quantity
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const { cartId, quantity } = await req.json();

    if (!cartId || quantity === undefined) {
      return NextResponse.json(
        { error: "Cart ID and quantity required" },
        { status: 400 },
      );
    }

    // Find cart directly by email — no userId round trip
    const cart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0] { _id, items }`,
      { email },
    );

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Update item quantity
    const updatedItems = cart.items.map((item: any) => {
      if (item.cartId === cartId) {
        return { ...item, quantity };
      }
      return item;
    });

    await client
      .patch(cart._id)
      .set({
        items: updatedItems,
        lastUpdated: new Date().toISOString(),
      })
      .commit();

    // Fetch updated cart with product details
    const updatedCart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0] ${CART_PROJECTION}`,
      { email },
    );

    return NextResponse.json({
      success: true,
      items: updatedCart?.items || [],
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID required" }, { status: 400 });
    }

    // Find cart directly by email — no userId round trip
    const cart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0] { _id, items }`,
      { email },
    );

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove item
    const updatedItems = cart.items.filter(
      (item: any) => item.cartId !== cartId,
    );

    await client
      .patch(cart._id)
      .set({
        items: updatedItems,
        lastUpdated: new Date().toISOString(),
      })
      .commit();

    // Fetch updated cart with product details
    const updatedCart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0] ${CART_PROJECTION}`,
      { email },
    );

    return NextResponse.json({
      success: true,
      items: updatedCart?.items || [],
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 },
    );
  }
}
