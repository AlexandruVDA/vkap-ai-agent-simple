import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Hello! I am VKAP AI Assistant. Ask me anything about VKAP, crypto, or general questions."
  );
});

bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/start")) return;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are VKAP AI assistant for Villach Kapital token community. Be friendly, smart, crypto-focused, and helpful."
        },
        {
          role: "user",
          content: msg.text
        }
      ]
    });

    const reply = response.choices[0].message.content;

    await bot.sendMessage(msg.chat.id, reply);
  } catch (error) {
    console.error(error);
    await bot.sendMessage(msg.chat.id, "⚠️ Error talking to AI.");
  }
});
