import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VKAP_MINT = "8YPfddKpUzPhdyKw6UpdMFnD7yqqft2D8fEcFBeKpump";

const SYSTEM_PROMPT = `
You are VKAP AI, the official Telegram assistant for VILLACH KAPITAL / VKAP.

VKAP is a Solana token.
Contract address: ${VKAP_MINT}

Rules:
- Keep answers short, confident, and community-friendly.
- Never promise profit, pumps, listings, or guaranteed returns.
- Never give financial advice.
- Always tell users to verify the contract address before buying.
- If asked where to buy, say: Pump.fun / Solana using the official contract address.
- If asked about ads, AMA, influencers, marketing, or partnerships, ask for media kit, price, engagement stats, audience location, and previous campaign results.
- If user writes Romanian, answer Romanian.
- If user writes German, answer German.
- Otherwise answer English.
`;

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `👋 Welcome to VKAP AI.

VILLACH KAPITAL / VKAP
Network: Solana
Contract:
${VKAP_MINT}

Ask me anything about VKAP.`
  );
});

bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/start")) return;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: msg.text }
      ],
      max_tokens: 250
    });

    const reply = response.choices[0]?.message?.content || "VKAP AI is online.";
    await bot.sendMessage(msg.chat.id, reply);
  } catch (error) {
    console.error(error);
    await bot.sendMessage(msg.chat.id, "⚠️ Temporary error. Try again.");
  }
});

console.log("VKAP AI Telegram bot is running.");
