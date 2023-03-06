import {Api, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
import {EnvInterface} from "../env/env.interface";
import {TypeGuardsHelper} from "../helpers/type-guards.helper";
import AnyRequest = Api.AnyRequest;

type AllApiMessage =
    Api.messages.GetScheduledHistory |
    Api.messages.Messages |
    Api.messages.MessagesSlice |
    Api.messages.ChannelMessages |
    Api.messages.MessagesNotModified;

export class NonBotApi {
    static builder(envConfig: EnvInterface): NonBotApi {
        const {API_ID, API_HASH, TG_SESSION, CHANNEL_ID} = envConfig;
        return new NonBotApi(API_ID, API_HASH, TG_SESSION, CHANNEL_ID);
    }

    private readonly stringSession: StringSession;
    private readonly clientParams = {connectionRetries: 5};
    private readonly hash = BigInt("-4156887774564");
    private client: TelegramClient | undefined;
    private isAuthorized = false;

    constructor(
        private readonly API_ID: number,
        private readonly API_HASH: string,
        private readonly TG_SESSION: string,
        private readonly CHANNEL_ID: string
    ) {
        this.stringSession = new StringSession(this.TG_SESSION);
    }

    async authorize(): Promise<boolean> {
        this.client = new TelegramClient(this.stringSession, this.API_ID, this.API_HASH, this.clientParams);
        await this.client.connect();
        this.isAuthorized = await this.client.checkAuthorization();

        if (!this.isAuthorized) {
            console.log("I am NOT logged in!");
            return Promise.resolve(false);
        }

        console.log("You should now be connected.");
        return Promise.resolve(true);
    }

    async getPostCount(): Promise<number> {
        if (!this.isAuthorized) {
            await this.authorize();
        }

        const result = await this.wrapApi(this._getScheduledHistory);

        const count = (result as unknown as Api.messages.ChannelMessages)?.count || 0;
        console.log('scheduled posts count', count);

        return count;
    }

    private _getScheduledHistory = () => new Api.messages.GetScheduledHistory({
            // @ts-ignore
            peer: this.CHANNEL_ID, hash: this.hash
        });

    private async wrapApi<T extends AllApiMessage, K extends AnyRequest>(apiCall: () => K): Promise<K> {
        if (TypeGuardsHelper.isUndefined(this.client)) {
            return Promise.reject('Client is undefined');
        }

        return await this.client.invoke(apiCall()) as K;
    }
}