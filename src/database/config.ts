import admin = require('firebase-admin');
const serviceAccount = require('../../private.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://billy-test-app.firebaseio.com',
});

const db = admin.database();

module.exports = class Database<T> {
    public table: admin.database.Reference;

    public constructor(tableName: string) {
        this.table = db.ref(tableName);
    }

    public async has(key: string): Promise<void> {
        const snapshot = await this.table.once('value');
        if (snapshot.val()[key] !== undefined) {
            return;
        } else {
            return Promise.reject('Data not found.');
        }
    }

    public async get(key: string): Promise<T | void> {
        const snapshot = await this.table.once('value');
        return snapshot.val()[key];
    }

    public set(key: string, value: T): Promise<void> {
        return this.table.set({
            [key]: value,
        });
    }
}
