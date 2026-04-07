import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const PREFIX = "afl_";

export function generateApiKey(): string {
  const raw = crypto.randomBytes(24).toString("base64url");
  return `${PREFIX}${raw}`;
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

export async function getAgentFromAuthHeader(
  authHeader: string | null
): Promise<{ id: string; displayName: string } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token.startsWith(PREFIX)) return null;
  const apiKeyHash = hashApiKey(token);
  const agent = await prisma.agent.findUnique({
    where: { apiKeyHash },
    select: { id: true, displayName: true },
  });
  return agent;
}
