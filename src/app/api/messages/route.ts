import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const messages = await prisma.clientMessage.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = await prisma.clientMessage.create({
    data: {
      clientId: body.clientId,
      direction: "outbound",
      channel: body.channel || "email",
      subject: body.subject || "",
      body: body.body,
      isDraft: body.isDraft || false,
    },
  });
  return NextResponse.json(message, { status: 201 });
}
