import {TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
// @ts-ignore
import input from "input";
import {ENV_CONFIG} from "../env/env.config"; // npm i input

(async () => {

    const client = new TelegramClient(
        new StringSession(""),
        ENV_CONFIG.API_ID,
        ENV_CONFIG.API_HASH,
        { connectionRetries: 5 }
    );

    await client.start({
        phoneNumber: async () => await input.text("number ?"),
        password: async () => await input.text("password?"),
        phoneCode: async () => await input.text("Code ?"),
        onError: (err) => console.log(err),
    });

    await client.connect();
    const isAuthorized = await client.checkAuthorization();

    if (!isAuthorized){
        console.log("I am NOT logged in!");
        return;
    }
    console.log("You should now be connected.");
    console.log('Save this string to avoid logging in again!');
    console.log(client.session.save());
})();