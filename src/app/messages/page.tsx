import { prisma } from "@/lib/prisma";
import { MessagesClient } from "./messages-client";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.clientMessage.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return <MessagesClient messages={JSON.parse(JSON.stringify(messages))} />;
}
