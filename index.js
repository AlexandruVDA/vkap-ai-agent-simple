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
You are VKAP AI, official assistant for VILLACH KAPITAL.

Official contract:
${VKAP_MINT}

Rules:
- Keep replies short.
- Never promise profits.
- Never invent fake token utilities.
- If asked where to buy: Pump.fun on Solana.
- Always use official contract address.
`;

function menu() {
  return `
🤖 VKAP COMMANDS

/start
/skills
/contract
/buy
/community
/partnership
`;
}

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `👋 Welcome to VKAP AI\n${menu()}`
  );
});

bot.onText(/\/skills/, async (msg) => {
  await bot.sendMessage(msg.chat.id, menu());
});

bot.onText(/\/contract/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Official VKAP contract:\n${VKAP_MINT}`
  );
});

bot.onText(/\/buy/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Buy VKAP on Pump.fun (Solana)\nContract:\n${VKAP_MINT}`
  );
});

bot.onText(/\/community/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Welcome to VKAP community 🔥`
  );
});

bot.onText(/\/partnership/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Thanks for reaching out.

Please send:
- Media kit
- Pricing
- Engagement stats
- Audience geo
- Previous campaign results`
  );
});

bot.on("message", async (msg) => {
  if (!msg.text) return;

  const text = msg.text.trim();

  if (
    text === "/start" ||
    text === "/skills" ||
    text === "/contract" ||
    text === "/buy" ||
    text === "/community" ||
    text === "/partnership"
  ) {
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text }
      ],
      max_tokens: 200
    });

    await bot.sendMessage(
      msg.chat.id,
      response.choices[0].message.content
    );
  } catch (err) {
    console.error(err);
    await bot.sendMessage(msg.chat.id, "Temporary error.");
  }
});

console.log("VKAP BOT ONLINE");
