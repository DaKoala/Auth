const Database = require('./config');

interface Account {
    username: string;
    password: string;
    score: number;
}

class UserManager {
    // @ts-ignore
    private table = new Database<Account>('users');

    public isRegistered(username: string): Promise<void> {
        return this.table.has(username);
    }

    public register(username: string, password: string): Promise<void> {
        return this.table.set(username, {
            username,
            password,
            score: 0,
        });
    }

    public async authorize(username: string, password: string): Promise<void> {
        const account = await this.table.get(username);
        // @ts-ignore
        if (account === undefined || account.password !== password) {
            return Promise.reject('Incorrect username / password!');
        } else {
            return;
        }
    }
}

module.exports = new UserManager();