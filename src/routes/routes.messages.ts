import { Router } from "express";
import { MessageService } from "../services/messageService";
import Message from "../models/Message";

const router = Router();

router.use((req, res, next) => {
    console.log('Request to ', req.url);
    next();
});

router.get('/:hash', (req, res) => {
    const hash: string = req.params.hash;

    const messageService = new MessageService();
    const m = messageService.getMessageAndCheck(hash);

    if(m === undefined) {
        res.json({message: null, error: 'No message found'});
    } else {
        res.json({message: m});
    }
});

router.post('/new', (req, res) => {

    const messageService = new MessageService();
    console.log(req.body);

    if(req.body.msg === undefined)
        res.status(400).json({status: 400, error: 'Body malformed'});

    const hash = messageService.register({
        content: req.body.msg, key: 'key', deleteAfterFirstRead: false,
        timeCreate: Date.now(), timeDelete: Date.now()+999999999,
        iv: req.body.iv
    });

    res.json({id: hash});
});

function checkJsonMatchMessage(json: any): boolean {
    if(json.message === undefined)
        return false;
    return Message.checkJson(json.message);
}

export default router;
