import {Bot} from "grammy";
import {ENV_CONFIG} from "./env/env.config";
import {NonBotApi} from "./telegram-non-bot/non-bot";
import {DIVIDER, messagesWrapper} from "./helpers/messages-wrapper";

export const bot = new Bot(ENV_CONFIG.BOT_TOKEN);
const nonBotApi = NonBotApi.builder(ENV_CONFIG);
const MIN_SCHEDULED_POSTS = 4;

bot.command("start", async (ctx) => {
    await ctx.reply("Hi! I can only read messages that explicitly reply to me!");
});

bot.on('channel_post', async (ctx) => {
    const count = await nonBotApi.getPostCount();

    if (count < MIN_SCHEDULED_POSTS) {
        const message = messagesWrapper( [
            'Палундра !!!',
            DIVIDER,
            '@tayasweetly, @bhNadiia, @mr_graydorian - рятуйте!',
            DIVIDER,
            `Всього залишилося запланованих постів ${count} !`
        ]);

        await bot.api.sendMessage(ENV_CONFIG.ADMIN_CHAT_ID, message);
    }
});

/*bot.chatType(["supergroup","group"]).on("message",()=>{

})*/

bot.on("message", async (ctx) => {
    const zero = 0;
    const id = ctx?.chat?.id ?? zero;

    if (id < zero) {
        return; // do nothing for group messages
    }

    const count = await nonBotApi.getPostCount();

    await ctx.reply(`Запланованих постів ${count}!`);
});