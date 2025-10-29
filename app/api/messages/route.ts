import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ideaId, role, content } = body;

    if (!ideaId || !role || !content) {
      return NextResponse.json(
        { error: "ideaId, role, and content are required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        ideaId,
        role,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
