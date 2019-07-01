import { Router } from "express";
import { MessageService } from "../services";

export const MessageRoute = Router();

// router.use((req, res, next) => {
//     console.log('Request to ', req.url);
//     next();
// });

MessageRoute.get('/:hash', (req, res) => {
    const hash: string = req.params.hash;

    const messageService = new MessageService();
    const m = messageService.getMessageAndCheck(hash);

    if(m === undefined) {
        res.status(404).json({message: null, error: 'No message found'});
    } else {
        res.status(200).json({message: m});
    }
});

MessageRoute.post('/new', (req, res) => {
    const messageService = new MessageService();
    //console.log(req.body);

    // if(req.body.msg === undefined)
    //     res.status(400).json({status: 400, error: 'Body malformed'});

    const [content, iv, deleteAfterFirstRead, deleteIn] =
        [req.body.content, req.body.iv,
            req.body.deleteAfterFirstRead, req.body.timeDelete];

    const timeCreate = Date.now(),
          timeDelete = Date.now() + deleteIn;

    const id = messageService.register({
        id: '', content, iv, deleteAfterFirstRead,
        timeCreate, timeDelete
    });

    res.json({id});
});
