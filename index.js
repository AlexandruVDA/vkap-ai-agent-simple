import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const VKAP_MINT = process.env.AGENT_TOKEN_MINT_ADDRESS;
const PAYMENT_ADDRESS = process.env.PAYMENT_ADDRESS;
const PRICE_AMOUNT = Number(process.env.PRICE_AMOUNT || 10000000);
const SOL_PRICE = PRICE_AMOUNT / 1_000_000_000;

const VKAP_BUY_LINK = `https://pump.fun/coin/${VKAP_MINT}`;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are VKAP AI, official assistant for Villach Kapital (VKAP).

Token:
- Name: Villach Kapital
- Ticker: VKAP
- Network: Solana
- Contract: ${VKAP_MINT}
- Buy link: ${VKAP_BUY_LINK}
- Agent payment address: ${PAYMENT_ADDRESS}

Rules:
- Keep replies short
- Never give financial advice
- If asked where to buy, provide official buy link
- If asked about buyback, explain payments to the agent create revenue and the configured buyback rate burns bought-back VKAP
- If user writes Romanian, answer Romanian
- If user writes German, answer German
- Otherwise answer English
`;

function menu() {
  return `
🤖 VKAP Commands

/start
/skills
/contract
/buy
/pay
/buyback
/community
/partnership
`;
}

async function send(chatId, text) {
  await bot.sendMessage(chatId, text, {
    disable_web_page_preview: true,
  });
}

bot.onText(/\/start/, async (msg) => {
  await send(
    msg.chat.id,
    `👋 Welcome to VKAP AI

VKAP Contract:
${VKAP_MINT}

${menu()}`
  );
});

bot.onText(/\/skills/, async (msg) => {
  await send(
    msg.chat.id,
    `VKAP AI Skills:

• Token info
• Community help
• Crypto Q&A
• Contract verification
• Buy guidance
• Agent payment info
• Buyback explanation
• Partnership requests`
  );
});

bot.onText(/\/contract/, async (msg) => {
  await send(
    msg.chat.id,
    `📄 Official VKAP Contract:

${VKAP_MINT}`
  );
});

bot.onText(/\/buy/, async (msg) => {
  await send(
    msg.chat.id,
    `🚀 Buy VKAP:

${VKAP_BUY_LINK}`
  );
});

bot.onText(/\/pay/, async (msg) => {
  await send(
    msg.chat.id,
    `💳 VKAP Agent Payment

Amount:
${SOL_PRICE} SOL

Send to:
${PAYMENT_ADDRESS}

After payments are claimed, the configured buyback rate is used for VKAP buyback/burn.`
  );
});

bot.onText(/\/buyback/, async (msg) => {
  await send(
    msg.chat.id,
    `🔥 VKAP Buyback

Current setup:
• Buyback rate: 20%
• Payments go to the VKAP agent payment address
• When revenue is claimed, 20% is used for VKAP buyback
• Bought-back VKAP is burned permanently

Payment address:
${PAYMENT_ADDRESS}`
  );
});

bot.onText(/\/community/, async (msg) => {
  await send(msg.chat.id, `🔥 Welcome to VKAP community.`);
});

bot.onText(/\/partnership/, async (msg) => {
  await send(
    msg.chat.id,
    `Thanks for reaching out.

Please send:
• Media kit
• Pricing
• Engagement stats
• Audience geo
• Previous campaign results`
  );
});

bot.on("message", async (msg) => {
  if (!msg.text) return;
  if (msg.text.startsWith("/")) return;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: msg.text },
      ],
      max_tokens: 200,
    });

    const reply = response.choices[0]?.message?.content || "VKAP AI online.";
    await send(msg.chat.id, reply);
  } catch (err) {
    console.error(err);
    await send(msg.chat.id, "Temporary error.");
  }
});

console.log("VKAP bot running...");
