export interface IMessage {
    id: string;
    content: string;
    iv: string;
    // key: string;

    deleteAfterFirstRead: boolean;
    timeCreate: number;
    timeDelete: number;
}

export class Message implements IMessage {
    id: string;
    content: string;
    iv: string;

    deleteAfterFirstRead: boolean;
    timeCreate: number;
    timeDelete: number;

    constructor(id: string, content: string, iv: string,
            deleteAfterFirstRead: boolean,timeCreate: number, timeDelete: number,
            ) {
        this.id = id;
        this.content = content;
        this.iv = iv;

        this.deleteAfterFirstRead = deleteAfterFirstRead;
        this.timeCreate = timeCreate;
        this.timeDelete = timeDelete;
    }

    static fromJson(json: IMessage) {
        return new Message(
            json.id, json.content, json.iv,
            json.deleteAfterFirstRead, json.timeCreate, json.timeDelete,  
        );
    }

    // static checkJson(json: any) {
    //     if(json.id === undefined)
    //         return false;
    //     if(json.content === undefined)
    //         return false;
    //     if(json.key === undefined)
    //         return false;
    //     if(json.deleteAfterFirstRead === undefined)
    //         return false;
    //     if(json.timeCreate === undefined)
    //         return false;
    //     if(json.timeDelete === undefined)
    //         return false;
    //     return true;
    // }
}