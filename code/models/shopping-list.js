import fs from 'fs';
import path from 'path';
import { Item } from './item.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export class ShoppingList {
    constructor(code, initialList) {
        this.code = code;
        this.itemsList = initialList;
    }

    addItem(item) {
        if(item.desiredQuantity==0) {
            this.removeItem(item);
            return;
        }

        // Check if an item with the same name already exists in the list
        for (const i in this.itemsList) {
            if (this.itemsList[i].name === item.name) {
                this.itemsList[i].changeDesiredQuantity(item.desiredQuantity);
                return;
            }
        }
        this.itemsList.push(item);
    }
    

    removeItem(item) {
        this.itemsList = this.itemsList.filter((i) => i.name !== item.name);
    }

    storeShoppingList() {
        const folderName = 'shopping-lists/';
        const fileName = `${this.code}.json`;
    
        // Include initial lines
        const data = {
            listId: this.code,
            replicaId: 'unique-replica-identifier',
            listName: 'Shopping List Name',
            items: this.itemsList,
        };
    
        const currentFilePath = fileURLToPath(import.meta.url);
        const filePath = path.join(dirname(currentFilePath), '..', folderName, fileName);
    
        // Make sure the folder exists, create if not
        if (!fs.existsSync(path.join('..', folderName))) {
            fs.mkdirSync(path.join('..', folderName));
        }
            
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        // console.log(`Shopping list stored in ${filePath}`);
    }
    

    loadShoppingList() {
        const folderName = 'shopping-lists/';
        const fileName = `${this.code}.json`;

        const currentFilePath = fileURLToPath(import.meta.url);
        const filePath = path.join(dirname(currentFilePath), '..', folderName, fileName);


        if (!fs.existsSync(filePath)) {
            console.log(`Shopping list with code ${this.code} does not exist.`);
            return null; // Return null as there are no items in the new file
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (const itemName in data.items) {
            const itemData = data.items[itemName];
            const newItem = new Item(itemData.name, itemData.desiredQuantity);
            this.addItem(newItem);
        }

        return data;
    }

    createShoppingList() {
        this.itemsList = [];

        const folderName = 'shopping-lists/';
        const fileName = `${this.code}.json`;

        const currentFilePath = fileURLToPath(import.meta.url);
        const filePath = path.join(dirname(currentFilePath), '..', folderName, fileName);

        console.log(`Creating a new file with code ${this.code}...`);
    
        // Create an empty data object to write to the new file
        const newData = {
            listId: this.code,
            replicaId: 'unique-replica-identifier',
            listName: 'Shopping List Name',
            items: {},
        };

        // Write the new file with the empty data
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
        console.log(`New shopping list file created at ${filePath}`);
    }

}
