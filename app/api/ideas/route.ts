import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    if (process.env.NODE_ENV !== "production") {
      const dbUrl = process.env.DATABASE_URL ?? "";
      const hostMatch = dbUrl.match(/@([^\/\?]+)/);
      if (hostMatch) console.log("[DEBUG] DATABASE_URL host:", hostMatch[1]);
    }

    const ideas = await prisma.idea.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { messages: true, tasks: true },
        },
      },
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
