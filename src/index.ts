import express, { Router } from 'express';
require('dotenv').config();
import path from 'path';

const app: express.Application = express();

// app.set('views', path.join(__dirname, '../views'));
// app.set('view engine', 'ejs');
app.use(express.json());

// ===========================================

app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API ROUTES ================================

import { MessageRoute } from "./routes/index";

const apiRoutes = express.Router();
apiRoutes.use('/message', MessageRoute);

app.use('/api/v1', apiRoutes);

// ===========================================

app.get('/lib/full.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'lib/full.js'));
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
    res.status(404).send('😃');
})

// ===========================================

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
