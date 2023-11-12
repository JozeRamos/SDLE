import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Item } from './item.js';



// Create a class to represent the shopping list
export class ShoppingList {
    constructor(initialList) {
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
}
