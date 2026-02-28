// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";

// GET /api/cart - Fetch user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in Sanity
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        email
      }`,
      { email: session.user.email },
    );

    if (!user) {
      return NextResponse.json({ items: [] });
    }

    // Find or create cart
    let cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] {
        _id,
        items[] {
          _key,
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
      { userId: user._id },
    );

    if (!cart) {
      // Create new cart for user
      cart = await client.create({
        _type: "cart",
        user: {
          _type: "reference",
          _ref: user._id,
        },
        userEmail: session.user.email,
        items: [],
        lastUpdated: new Date().toISOString(),
      });

      return NextResponse.json({ items: [] });
    }

    // Transform items to match frontend format
    const transformedItems =
      cart.items?.map((item: any) => ({
        cartId: item.cartId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        product: {
          ...item.product,
          images: item.product.images || { hero: null, thumbnails: [] },
        },
      })) || [];

    return NextResponse.json({ items: transformedItems });
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

    const { product, quantity, selectedSize, selectedColor } = await req.json();

    // Validate input
    if (!product || !product._id) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 },
      );
    }

    // Find user in Sanity
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        email
      }`,
      { email: session.user.email },
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found in Sanity" },
        { status: 404 },
      );
    }

    // Find or create cart
    let cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] {
        _id,
        items[] {
          _key,
          cartId,
          product {
            _ref
          },
          selectedSize,
          selectedColor
        }
      }`,
      { userId: user._id },
    );

    // Check if the same product with same size and color already exists in cart
    const existingItemIndex =
      cart?.items?.findIndex(
        (item: any) =>
          item.product._ref === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.label === selectedColor.label,
      ) ?? -1;

    if (!cart) {
      // Create new cart with item
      const cartId = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const itemKey = `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newItem = {
        _key: itemKey, // REQUIRED for Sanity
        cartId,
        product: {
          _type: "reference",
          _ref: product._id,
        },
        productName: product.name,
        productPrice: product.price,
        quantity: quantity || 1,
        selectedSize,
        selectedColor,
        productImage: product.images || {},
        addedAt: new Date().toISOString(),
      };

      await client.create({
        _type: "cart",
        user: {
          _type: "reference",
          _ref: user._id,
        },
        userEmail: session.user.email,
        items: [newItem],
        lastUpdated: new Date().toISOString(),
      });
    } else {
      // Cart exists
      if (existingItemIndex >= 0) {
        // Item exists - increment quantity
        const currentItems = [...cart.items];
        currentItems[existingItemIndex].quantity += quantity || 1;

        await client
          .patch(cart._id)
          .set({
            items: currentItems,
            lastUpdated: new Date().toISOString(),
          })
          .commit();
      } else {
        // New item - add to cart
        const cartId = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const itemKey = `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const newItem = {
          _key: itemKey, // REQUIRED for Sanity
          cartId,
          product: {
            _type: "reference",
            _ref: product._id,
          },
          productName: product.name,
          productPrice: product.price,
          quantity: quantity || 1,
          selectedSize,
          selectedColor,
          productImage: product.images || {},
          addedAt: new Date().toISOString(),
        };

        const currentItems = cart.items || [];
        await client
          .patch(cart._id)
          .set({
            items: [...currentItems, newItem],
            lastUpdated: new Date().toISOString(),
          })
          .commit();
      }
    }

    // Fetch updated cart to return
    const updatedCart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] {
        items[] {
          _key,
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
      { userId: user._id },
    );

    const transformedItems =
      updatedCart.items?.map((item: any) => ({
        cartId: item.cartId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        product: item.product,
      })) || [];

    return NextResponse.json({
      success: true,
      items: transformedItems,
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

    // Find user in Sanity
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] { _id }`,
      { email: session.user.email },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find cart
    const cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] { _id, items }`,
      { userId: user._id },
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
          _key,
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
      { userId: user._id },
    );

    const transformedItems =
      updatedCart.items?.map((item: any) => ({
        cartId: item.cartId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        product: item.product,
      })) || [];

    return NextResponse.json({
      success: true,
      items: transformedItems,
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

    // Find user in Sanity
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] { _id }`,
      { email: session.user.email },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find cart
    const cart = await client.fetch(
      `*[_type == "cart" && user._ref == $userId][0] { _id, items }`,
      { userId: user._id },
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
          _key,
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
      { userId: user._id },
    );

    const transformedItems =
      updatedCart.items?.map((item: any) => ({
        cartId: item.cartId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        product: item.product,
      })) || [];

    return NextResponse.json({
      success: true,
      items: transformedItems,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 },
    );
  }
}
