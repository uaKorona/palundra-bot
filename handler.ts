import ServerlessHttp from "serverless-http";
import {bot} from "./src/bot.js";
import {ENV_CONFIG} from "./src/env/env.config.js";
import {webhookCallback} from "grammy";
import express from "express";

if (!ENV_CONFIG.PRODUCTION) {
    bot.start();
}

const app = express();
app.use(express.json())
app.post('/telegraf', webhookCallback(bot, 'express'))

// setup webhook
export const botHandler = ServerlessHttp(app);