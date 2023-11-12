import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Item } from './item.js';

export class ShoppingList {
    constructor(code, initialList) {
        this.code = code;
        this.itemsList = initialList;
        this.repository = new ShoppingListRepository(code); // new code
    }

    addItem(item) {
        this.itemsList.push(item);
        this.repository.saveShoppingList(this.itemsList); // new code
    }

    removeItem(item) {
        this.itemsList = this.itemsList.filter((i) => i.name !== item.name);
        this.repository.saveShoppingList(this.itemsList); // new code
    }

    loadShoppingList() {
        this.itemsList = this.repository.loadShoppingList();
    }

}

class ShoppingListRepository {

    constructor(code) {
        this.code = code;
        this.folderName = 'shopping-lists';
        this.filePath = path.join(__dirname, '..', this.folderName, `${this.code}.json`);
    }


    saveShoppingList(itemsList) {
        const data = JSON.stringify(itemsList, null, 2);

        if (!fs.existsSync(path.dirname(this.filePath))) {
            fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
        }

        fs.writeFileSync(this.filePath, data, 'utf8');
        console.log(`Shopping list stored in ${this.filePath}`);
    }


    loadShoppingList() {
        if (!fs.existsSync(this.filePath)) {
            console.log(`Shopping list with code ${this.code} does not exist`);
            return [];
        }

        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data);
    }
}
