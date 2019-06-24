import express, { Router } from 'express';
require('dotenv').config();
import path from 'path';

const app: express.Application = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.json());

// ===========================================

app.get('/ejs', (req, res) => {
    res.render('test', {
        works: true
    });
});

app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/s/', (req, res, next) => {
    console.log(req.query);
    const queryKeys = Object.keys(req.query);

    if(queryKeys.length < 1)
        res.status(400).send('Not enough info');
    else {
        const hash = queryKeys[0];
        const requirePass = req.query[queryKeys[0]] !== '';
        res.render('show', { hash, requirePass });
    }
});

app.get('/s/:hashkey', (req, res, next) => {
    console.log(req.params);
    console.log(Object.keys(req.params));

    const hk = req.params.hashkey;
    if(hk.split('.').length != 2)
        res.status(400).send('Not enough info');
    else {
        const [hash] = hk.split('.');
        res.render('show', { hash });
    }
});

// API ROUTES ================================

import ROUTES from "./routes";

const apiRoutes = express.Router();
apiRoutes.use('/message', ROUTES.messages);
app.use('/api/v1', apiRoutes);

// ===========================================

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
    res.status(404).send('😃');
})

// ===========================================

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
