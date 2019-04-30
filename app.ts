import admin = require('firebase-admin');
import express = require('express');
const serviceAccount = require('./private.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://billy-test-app.firebaseio.com',
});

const db = admin.database();

class Database<T> {
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
            key: value,
        });
    }
}

interface Account {
    username: string;
    password: string;
    score: number;
}

class UserManager {
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
