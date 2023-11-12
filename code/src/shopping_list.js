import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Item } from './item.js';

export class ShoppingList {
    constructor(code, initialList) {
        this.code = code;
        this.itemsList = initialList;
    }

    addItem(item) {
        this.itemsList.push(item);
    }

    removeItem(item) {
        this.itemsList = this.itemsList.filter((i) => i.name !== item.name);
    }

    storeShoppingList() {
        const folderName = 'shopping-lists/';
        const data = this.itemsList.map(item => ({
            name: item.name,
            desiredQuantity: item.desiredQuantity,
            acquiredQuantity: item.acquiredQuantity,
        }));
        const fileName = `${this.code}.json`;
        const filePath = path.join('..', folderName, fileName);

        // Make sure the folder exists, create if not
        if (!fs.existsSync(path.join('..', folderName))) {
            fs.mkdirSync(path.join('..', folderName));
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Shopping list stored in ${filePath}`);
    }

    static loadShoppingList(code) {
        const folderName = 'shopping-lists/';
        const fileName = `${code}.json`;
        const filePath = path.join('..', folderName, fileName);

        if (!fs.existsSync(filePath)) {
            console.log(`Shopping list with code ${code} does not exist`);
            return null;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Convert data back to Item instances
        const items = data.map(itemData => new Item(itemData.name, itemData.desiredQuantity, itemData.acquiredQuantity));

        // Implement additional functionalities (Load Balance, Replication) if needed

        return new ShoppingList(code, items);
    }
}
