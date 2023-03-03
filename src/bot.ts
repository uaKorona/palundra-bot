import {Bot} from "grammy";
import {ENV_CONFIG} from "./env/env.config";
import {NonBotApi} from "./telegram-non-bot/non-bot";

export const bot = new Bot(ENV_CONFIG.BOT_TOKEN);
const nonBotApi = NonBotApi.builder(ENV_CONFIG);

bot.command("start", async (ctx) => {
    await ctx.reply("Hi! I can only read messages that explicitly reply to me!");
});

bot.on("message", async (ctx) => {
    await nonBotApi.authorize();
    const count = await nonBotApi.getPostCount();

    await ctx.reply(`Scheduled post ${count}!`);
});