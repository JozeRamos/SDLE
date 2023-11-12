import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Item } from './item.js';



// Create a class to represent the shopping list
export class ShoppingList {
    constructor(code, initialList) {
        this.code = code;
        this.itemsList = initialList;
    }

    addItem(item) {
        //const existingItemIndex = this.itemsList.findIndex(i => i.name === item.name);
        const existingItem = this.itemsList.find(i => i.name.toLowerCase() === item.name.toLowerCase());

        /*if (existingItemIndex !== -1) {
            // If the item already exists, update its properties
            this.itemsList[existingItemIndex].desiredQuantity = item.desiredQuantity;
            this.itemsList[existingItemIndex].quantityBought = item.quantityBought;
        } else {
            // If the item does not exist, add it to the list
            this.itemsList.push(item);
        }*/
        if(existingItem){
            existingItem.desiredQuantity += item.desiredQuantity;
            existingItem.quantityBought = item.quantityBought;
        }
        else{
            this.itemsList.push(item);
        }
    }

    removeItem(item) {
        //this.itemsList = this.itemsList.filter((i) => i.name !== item.name);
        this.itemsList = this.itemsList.filter(i => i.name.toLowerCase() !== itemName.toLowerCase());
    }

    updateItemQuantities(itemName, newDesiredQuantity, newAcquiredQuantity) {
        const item = this.itemsList.find(i => i.name.toLowerCase() === itemName.toLowerCase());

        if (item) {
            item.changeDesiredQuantity(newDesiredQuantity);
            item.changeAcquiredQuantity(newAcquiredQuantity);
        }
    }

    getList() {
        return this.itemsList;
    }

    toJSON() {
        // Convert the shopping list to JSON format
        return {
            items: this.itemsList.reduce((acc, item) => {
                acc[item.name] = {
                    desiredQuantity: item.desiredQuantity,
                    quantityBought: item.quantityBought,
                };
                return acc;
            }, {}),
        };
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
}
