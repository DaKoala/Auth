const Database = require('./config');

class UserManager {
    constructor() {
        this.table = new Database('users');
    }

    async isRegistered(username) {
        try {
            await this.table.has(username);
            return Promise.reject();
        } catch (e) {
            return Promise.resolve();
        }
    }

    register(username, password) {
        return this.table.set(username, {
            username,
            password,
            score: 0,
        });
    }

    async authorize(username, password) {
        const account = await this.table.get(username);
        if (account === undefined || account.password !== password) {
            return Promise.reject('Incorrect username / password!');
        } else {
            return;
        }
    }
}

module.exports = new UserManager();
