import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

export class ShoppingList {
    constructor(initialList) {
        this.itemsList = initialList;
    }

    addItem(item) {
        this.itemsList.push(item);
    }

    removeItem(item) {
        this.itemsList = this.itemsList.filter((i) => i.name !== item.name);
    }
}
