import express = require('express');
import bodyParser = require('body-parser');
const manager = require('./database/user');

const app = express();

app.use(bodyParser.json());

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
