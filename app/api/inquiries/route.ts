// app/api/inquiries/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pieceId, pieceName, customer, userEmail, userId } = body;

    // Validate required fields
    if (!pieceId || !pieceName || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate a unique inquiry number
    const year = new Date().getFullYear();
    const randomStr = uuidv4().slice(0, 6).toUpperCase();
    const inquiryNumber = `INQ-${year}-${randomStr}`;

    // Prepare the inquiry document
    const inquiryDoc: any = {
      _type: "priceInquiry",
      inquiryNumber,
      piece: {
        _type: "reference",
        _ref: pieceId,
      },
      pieceName,
      customer,
      userEmail: userEmail || customer.email,
      status: "new",
      priority: "medium",
      inquirySource: "oneoff_archive",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // If user is logged in and userId is provided, add the user reference
    if (userId) {
      inquiryDoc.user = {
        _type: "reference",
        _ref: userId,
      };
    }

    // Create the inquiry in Sanity
    const result = await client.create(inquiryDoc);

    // Here you would integrate with your email service
    // await sendEmailNotification(inquiryDoc);
    // await sendAutoReply(inquiryDoc);

    return NextResponse.json({
      success: true,
      inquiryNumber: result.inquiryNumber,
      id: result._id,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const id = searchParams.get("id");

    let query = `*[_type == "priceInquiry"`;
    const params: any = {};

    if (id) {
      query += ` && _id == $id`;
      params.id = id;
    }

    if (email) {
      query += ` && customer.email == $email`;
      params.email = email;
    }

    if (status) {
      query += ` && status == $status`;
      params.status = status;
    }

    query += `] | order(createdAt desc)`;

    if (limit) {
      query += ` [0...${parseInt(limit)}]`;
    }

    const inquiries = await client.fetch(query, params);

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { inquiryId, updates } = body;

    if (!inquiryId) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    // Add lastUpdated timestamp
    const updatesWithTimestamp = {
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    const result = await client
      .patch(inquiryId)
      .set(updatesWithTimestamp)
      .commit();

    return NextResponse.json({ success: true, inquiry: result });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    await client.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 },
    );
  }
}
