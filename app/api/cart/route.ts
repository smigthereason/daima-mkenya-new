// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";

// Cache for user IDs to reduce queries
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

// GET /api/cart - Fetch user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID first
    const userId = await getUserId(session.user.email);

    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    // Single optimized query - get cart with products in one go
    const cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] {
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
      }`,
      { userId },
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

    // Get user ID
    const userId = await getUserId(session.user.email);

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find existing cart
    let cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] { _id, items }`,
      { userId },
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
      // Create new cart with item
      await client.create({
        _type: "cart",
        user: {
          _type: "reference",
          _ref: userId,
        },
        userEmail: session.user.email,
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
      `*[_type == "cart" && user._ref == $userId][0] {
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
      }`,
      { userId },
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

    const { cartId, quantity } = await req.json();

    if (!cartId || quantity === undefined) {
      return NextResponse.json(
        { error: "Cart ID and quantity required" },
        { status: 400 },
      );
    }

    const userId = await getUserId(session.user.email);

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find cart
    const cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] { _id, items }`,
      { userId },
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
      `*[_type == "cart" && user._ref == $userId][0] {
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
      }`,
      { userId },
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

    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID required" }, { status: 400 });
    }

    const userId = await getUserId(session.user.email);

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find cart
    const cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] { _id, items }`,
      { userId },
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
      `*[_type == "cart" && user._ref == $userId][0] {
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
      }`,
      { userId },
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
