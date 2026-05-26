import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const VKAP_MINT = "8YPfddKpUzPhdyKw6UpdMFnD7yqqft2D8fEcFBeKpump";
const VKAP_BUY_LINK = "https://pump.fun/coin/8YPfddKpUzPhdyKw6UpdMFnD7yqqft2D8fEcFBeKpump";
const SKILLS_LINK = "https://raw.githubusercontent.com/pump-fun/pump-fun-skills/refs/heads/main/tokenized-agents/SKILL.md";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are VKAP AI, the official Telegram assistant for VILLACH KAPITAL / VKAP.

Token:
Name: VILLACH KAPITAL
Ticker: VKAP
Network: Solana
Mint address: ${VKAP_MINT}
Buy link: ${VKAP_BUY_LINK}

Tokenized agent skill reference:
${SKILLS_LINK}

Original tokenized agent task:
Build a Next.js random number generator app that gates access behind a Solana payment. Users connect their wallet and pay a small fee such as 0.1 SOL. Once payment is verified on the backend, they can generate a random number between 0 and 1000. Use the Pump.fun tokenized agents skill to build the payment transaction, handle wallet signing, and verify the invoice server-side before granting access.

Rules:
- Keep replies short and clear.
- Never promise profit, pumps, listings, or guaranteed returns.
- Never give financial advice.
- Always remind users to verify the official contract.
- If asked where to buy, give the official Pump.fun link.
- If asked about ads, AMA, influencers, marketing, or partnerships, ask for media kit, pricing, engagement stats, audience geo, and previous campaign results.
- If user writes Romanian, answer Romanian.
- If user writes German, answer German.
- Otherwise answer English.
`;

function menu() {
  return `
🤖 VKAP AI Commands

/start - Start bot
/skills - Show agent skills
/contract - Official contract
/buy - Buy VKAP
/community - Community info
/partnership - Ads / AMA / promo requests
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

${menu()}`
  );
});

bot.onText(/\/skills/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `${menu()}

Tokenized Agent Skill:
${SKILLS_LINK}`
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
    `Buy VKAP:
${VKAP_BUY_LINK}

Always verify the official contract:
${VKAP_MINT}`
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

    const reply = response.choices[0]?.message?.content || "VKAP AI is online.";
    await bot.sendMessage(msg.chat.id, reply);
  } catch (error) {
    console.error(error);
    await bot.sendMessage(msg.chat.id, "⚠️ Temporary error. Try again.");
  }
});

console.log("VKAP AI Telegram bot is running.");
