import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WorkspaceClient from "@/components/workspace/WorkspaceClient";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function WorkspacePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const idea = await prisma.idea.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      tasks: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!idea) return notFound();

  return <WorkspaceClient initialIdea={idea as any} />;
}
