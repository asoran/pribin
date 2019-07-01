import { Message, IMessage } from "../models";
import { createHash } from "crypto";

export class MessageService {
    private static messages: Map<String, Message>
        = new Map<String, Message>();

    constructor() { };

    private getMessage(hash: string): Message | undefined {
        return MessageService.messages.get(hash);
    }

    private delete(hash: string): boolean {
        return MessageService.messages.delete(hash);
    }

    has(hash: string): boolean {
        return MessageService.messages.has(hash);
    }

    getMessageAndCheck(hash: string): Message | undefined {
        const m = this.getMessage(hash);
        if(m === undefined)
            return undefined;

        const t = Date.now();
        if(t > m.timeDelete) {
            this.delete(hash);
            return undefined;
        }

        return m;
    }

    register(body: IMessage): string {
        const hash = createHash('md5').update(body.content).digest('hex');
        const m = Message.fromJson({
            id: hash, content: body.content, iv: body.iv,
            deleteAfterFirstRead: body.deleteAfterFirstRead,
            timeCreate: body.timeCreate, timeDelete: body.timeDelete,
        });

        MessageService.messages.set(hash, m);
        return hash;
    }
}