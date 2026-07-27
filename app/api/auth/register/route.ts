// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";
import { normalizeEmail } from "@/lib/utils/normalizeEmail";

const ADMIN_EMAILS = ["prodbysmig@gmail.com"];

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    const normalizedEmail = normalizeEmail(email);

    // Check if user already exists (case-insensitive, so "Name@Gmail.com"
    // can't be used to create a duplicate of "name@gmail.com")
    const existingUser = await client.fetch(
      `*[_type == "user" && lower(email) == $email][0]`,
      { email: normalizedEmail },
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);

    // Create user in Sanity - email is always stored lowercase so future
    // logins match regardless of how the person capitalizes it
    const user = await client.create({
      _type: "user",
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: isAdmin ? "admin" : "customer",
      emailVerified: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
