const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const manager = require('./database/user');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, 'dist')));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'content-type');
    next();
});

app.get('/user', async (req, res) => {
    const { username, password } = req.query;
    try {
        await manager.authorize(username, password);
        res.send({
            'status': 200,
            'msg': 'ok',
        });
    } catch (e) {
        res.send({
            'status': 403,
            'msg': 'Incorrect username or password!',
        });
    }
});

app.post('/user', async (req, res) => {
    const { username, password } = req.body;
    try {
        await manager.isRegistered(username);
        await manager.register(username, password);
        res.send({
            'status': 200,
            'msg': 'ok',
        });
    } catch (e) {
        res.send({
            'status': 400,
            'msg': 'Existing username.',
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('App is running on port %s', 3000);
});
