// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("🔍 Forgot password requested for:", email);

    // Find user in Sanity
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0] {
        _id,
        name,
        email
      }`,
      { email },
    );

    if (!user) {
      console.log("⚠️ User not found, but returning success for security");
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message: "If an account exists, a reset email will be sent",
      });
    }

    console.log("✅ User found:", user.email);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    // Store token in Sanity
    await client
      .patch(user._id)
      .set({
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      })
      .commit();

    console.log("✅ Reset token stored in Sanity");

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken, user.name || "User");
      console.log("✅ Password reset email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError);
      // Still return success to the user, but log the error
      // You might want to notify yourself about email failures
    }

    return NextResponse.json({
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
