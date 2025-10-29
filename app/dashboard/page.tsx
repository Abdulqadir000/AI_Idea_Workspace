import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import IdeasClient from "@/components/dashboard/IdeasClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const ideas = await prisma.idea.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { messages: true, tasks: true } },
    },
  });

  return <IdeasClient initialIdeas={ideas as any} />;
}
