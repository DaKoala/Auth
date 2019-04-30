const admin = require('firebase-admin');
const serviceAccount = require('../../private.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://billy-test-app.firebaseio.com',
});

const db = admin.database();

module.exports = class Database {
    constructor(tableName) {
        this.table = db.ref(tableName);
    }

    async has(key) {
        const snapshot = await this.table.once('value');
        if (snapshot.val()[key] !== undefined) {
            return;
        } else {
            return Promise.reject('Data not found.');
        }
    }

    async get(key) {
        const snapshot = await this.table.once('value');
        return snapshot.val()[key];
    }

    set(key, value) {
        return this.table.set({
            [key]: value,
        });
    }
}
