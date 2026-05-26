import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const VKAP_MINT = "8YPfddKpUzPhdyKw6UpdMFnD7yqqft2D8fEcFBeKpump";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are VKAP AI, the official Telegram assistant for VILLACH KAPITAL / VKAP.

VKAP is a Solana token.
Official contract address: ${VKAP_MINT}

Rules:
- Keep answers short, confident, and community-friendly.
- Never promise profit, pumps, listings, or guaranteed returns.
- Never give financial advice.
- Always remind users to verify the contract address before buying.
- If asked where to buy, say: Pump.fun / Solana using the official contract address.
- If asked about ads, AMA, influencers, marketing, or partnerships, ask for media kit, price, engagement stats, audience location, and previous campaign results.
- If user writes Romanian, answer Romanian.
- If user writes German, answer German.
- Otherwise answer English.
`;

function mainMenu() {
  return `
🤖 VKAP AI Commands

/start - Start bot
/contract - Official contract
/buy - Where to buy VKAP
/community - Community info
/partnership - Ads / AMA / promo requests
/skills - Show commands
`;
}

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `👋 Welcome to VKAP AI.

VILLACH KAPITAL / VKAP
Network: Solana
Contract:
${VKAP_MINT}

${mainMenu()}`
  );
});

bot.onText(/\/contract/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `✅ Official VKAP contract:

${VKAP_MINT}

Always verify the contract before buying.`
  );
});

bot.onText(/\/buy/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `You can buy VKAP on Pump.fun / Solana using the official contract:

${VKAP_MINT}

Always verify the contract before buying.`
  );
});

bot.onText(/\/community/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Welcome to the VKAP community 🔥

VKAP is built around community, crypto culture, and the Villach Kapital brand.`
  );
});

bot.onText(/\/partnership/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Thanks for reaching out.

Please send:
• Media kit
• Pricing
• Engagement stats
• Audience geo
• Previous campaign results

Our team will review it.`
  );
});

bot.onText(/\/skills/, async (msg) => {
  await bot.sendMessage(msg.chat.id, mainMenu());
});

bot.on("message", async (msg) => {
  if (!msg.text) return;

  const text = msg.text.trim();

  if (text.startsWith("/")) return;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text }
      ],
      max_tokens: 250
    });

    const reply =
      response.choices[0]?.message?.content || "VKAP AI is online.";

    await bot.sendMessage(msg.chat.id, reply);
  } catch (error) {
    console.error(error);
    await bot.sendMessage(msg.chat.id, "⚠️ Temporary error. Try again.");
  }
});

console.log("VKAP AI Telegram bot is running.");
