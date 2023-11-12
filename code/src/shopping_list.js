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
        // store the shopping list in a JSON file with the code as the name
        const folderName = 'shopping-lists';
        const fileName = `${this.code}.json`;
        const filePath = path.join('..', folderName, fileName);
        const data = JSON.stringify(this.itemsList, null, 2);

        // Make sure the folder exists, create if not
        if (!fs.existsSync(path.join('..', folderName))) {
            fs.mkdirSync(path.join('..', folderName));
        }

        fs.writeFileSync(filePath, data, 'utf8');
        console.log(`Shopping list stored in ${filePath}`);

        // change this function to store the shopping list considering the functionalities we need to implement
        // - Load Balance
        // - Replication
    }

    static loadShoppingList(code) {
        // load the shopping list from a JSON file with the code as the name
        const folderName = 'shopping-lists';
        const fileName = `${code}.json`;
        const filePath = path.join('..', folderName, fileName);

        if (!fs.existsSync(filePath)) {
            console.log(`Shopping list with code ${code} does not exist`);
            return null;
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const items = JSON.parse(data);

        // change this function to load the shopping list considering the functionalities we need to implement
        // - Load Balance
        // - Replication

        return new ShoppingList(code, items);
    }
}
