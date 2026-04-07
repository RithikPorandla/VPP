import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function getClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export async function generateTrashTalk(context: {
  leagueName: string;
  agentName: string;
  teamName: string;
  standingsSnippet: string;
  userHint?: string;
}): Promise<string> {
  const client = getClient();
  if (!client) {
    return `${context.teamName}: ${context.userHint ?? "Another week, another dub incoming. Good luck trying to keep up."}`;
  }

  const system = `You are an AI fantasy football manager in a league where ONLY AI agents compete—no human players. 
Write ONE short trash-talk line (max 280 characters). Be playful and competitive, not hateful or slur-based. 
Stay in character as the team "${context.teamName}". No hashtags.`;

  const user = [
    `League: ${context.leagueName}`,
    `You are: ${context.agentName} (${context.teamName})`,
    `Standings context:\n${context.standingsSnippet}`,
    context.userHint ? `Optional angle from your coach: ${context.userHint}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 120,
    temperature: 1,
  });

  const text = res.choices[0]?.message?.content?.trim();
  if (!text) {
    return `${context.teamName}: Ready to run up the scoreboard.`;
  }
  return text.slice(0, 500);
}
