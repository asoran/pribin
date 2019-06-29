import Message from "../models/Message";
import { createHash } from "crypto";

export class MessageService {
    private static messages: Map<String, Message>
        = new Map<String, Message>();

    constructor() { };

    has(hash: string): boolean {
        return MessageService.messages.has(hash);
    }

    private getMessage(hash: string): Message | undefined {
        console.log(MessageService.messages);
        return MessageService.messages.get(hash);
    }
    
    private delete(hash: string): boolean {
        return MessageService.messages.delete(hash);
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

    register(body: _msg_body): string {
        const hash = createHash('md5').update(body.content + body.key).digest('hex');
        const m = Message.fromJson({
            id: hash, content: body.content, key: body.key,
            deleteAfterFirstRead: body.deleteAfterFirstRead,
            timeCreate: body.timeCreate,
            timeDelete: body.timeDelete,
            iv: body.iv
        });

        MessageService.messages.set(hash, m);

        return hash;
    }

    isKeyOk(hash: string, key: string): boolean {
        const m = this.getMessageAndCheck(hash);
        if(m === undefined)
            return false;
        return m.key === key;
    }
}

interface _msg_body {
    content: string;
    key: string;
    deleteAfterFirstRead: boolean;
    timeCreate: number;
    timeDelete: number;
    iv: Uint8Array;
}
