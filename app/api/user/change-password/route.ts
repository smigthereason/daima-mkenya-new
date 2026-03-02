// app/api/user/change-password/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        password
      }`,
      { email: session.user.email },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For users who signed up with OAuth (no password)
    if (!user.password) {
      // Create password for first time
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await client.patch(user._id).set({ password: hashedPassword }).commit();

      return NextResponse.json({
        message: "Password created successfully",
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.patch(user._id).set({ password: hashedPassword }).commit();

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 },
    );
  }
}
