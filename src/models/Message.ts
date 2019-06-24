export default class Message {
    id: string;
    content: string;
    key: string;

    deleteAfterFirstRead: boolean;
    timeCreate: number;
    timeDelete: number;

    constructor(id: string, content: string, key: string,
            deleteAfterFirstRead: boolean, timeCreate: number, timeDelete: number) {
        this.id = id;
        this.content = content;
        this.key = key;

        this.deleteAfterFirstRead = deleteAfterFirstRead;
        this.timeCreate = timeCreate;
        this.timeDelete = timeDelete;
    }

    static fromJson(json: _msg_body) {
        return new Message(
            json.id, json.content, json.key,
            json.deleteAfterFirstRead, json.timeCreate, json.timeDelete
        );
    }

    static checkJson(json: any) {
        if(json.id === undefined)
            return false;
        if(json.content === undefined)
            return false;
        if(json.key === undefined)
            return false;
        if(json.deleteAfterFirstRead === undefined)
            return false;
        if(json.timeCreate === undefined)
            return false;
        if(json.timeDelete === undefined)
            return false;
        return true;
    }
}

interface _msg_body {
    id: string;
    content: string;
    key: string;
    deleteAfterFirstRead: boolean;
    timeCreate: number;
    timeDelete: number;
}