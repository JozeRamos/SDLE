const path = require('path');
const fs = require('fs');
const Item = require('./item.js');
const fileURLToPath = require('url');
//const dirname = require('__dirname');
//const meta = require('meta');
const AddWinSet = require('../crdts/add-win-set.js');

const WebSocket = require('ws');

class ShoppingList {
    constructor(code, initialList) {
        this.code = code;
        this.itemsList = initialList;
        this.addWinSet = new AddWinSet();
    }

    // addItem(item) {
    //     if(item.desiredQuantity==0) {
    //         this.removeItem(item);
    //         return;
    //     }

    //     // Check if an item with the same name already exists in the list
    //     for (const i in this.itemsList) {
    //         if (this.itemsList[i].name === item.name) {
    //             this.itemsList[i].changeDesiredQuantity(item.desiredQuantity);
    //             return;
    //         }
    //     }
    //     this.itemsList.push(item);
    // }
    

    // removeItem(item) {
    //     this.itemsList = this.itemsList.filter((i) => i.name !== item.name);
    // }

    createList(elements) {
        this.itemsList = [];
        for (const itemName in elements) {
            const quantity = elements[itemName];
            const newItem = new Item(itemName, quantity);
            this.itemsList.push(newItem);
        }
    }

    storeShoppingList(port) {
        const folderName = 'shopping-lists/local/';
        const fileName = `local_client_${port}_list_${this.code}.json`;

        this.createList(this.addWinSet.elements);
    
        // Include initial lines
        const data = {
            listId: this.code,
            replicaId: fileName,
            items: this.itemsList,
        };
    
        const currentFilePath = __filename;
        const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);
    
        // Make sure the folder exists, create if not
        if (!fs.existsSync(path.join('..', folderName))) {
            fs.mkdirSync(path.join('..', folderName));
        }
            
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        // console.log(`Shopping list stored in ${filePath}`);
    }
    

    loadShoppingList(port) {
        this.addWinSet = new AddWinSet();

        const folderName = 'shopping-lists/local/';
        const fileName = `local_client_${port}_list_${this.code}.json`;

        const currentFilePath = __filename;
        const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);


        if (!fs.existsSync(filePath)) {
            console.log(`Shopping list with code ${this.code} does not exist.`);
            return null; // Return null as there are no items in the new file
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (const itemName in data.items) {
            const itemData = data.items[itemName];
            // const newItem = new Item(itemData.name, itemData.desiredQuantity);
            // this.addItem(newItem);
            this.addWinSet = this.addWinSet.add(itemData.name, itemData.desiredQuantity);
        }

        return data;
    }

    createShoppingList(port) {
        this.itemsList = [];

        const folderName = 'shopping-lists/local/';
        const fileName = `local_client_${port}_list_${this.code}.json`;

        const currentFilePath = __filename;
        const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);

        console.log(`Creating a new file with code ${this.code}...`);
    
        // Create an empty data object to write to the new file
        const newData = {
            listId: this.code,
            replicaId: fileName,
            items: {},
        };

        // Write the new file with the empty data
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
        console.log(`New shopping list file created at ${filePath}`);
    }

    pullShoppingList(port,data) {
        const folderName = 'shopping-lists/local/';
        const fileName = `local_client_${port}_list_${this.code}.json`;

        const currentFilePath = __filename;
        const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);

        // Write the new file with the empty data
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`New shopping list file created at ${filePath}`);
    }

}

module.exports = ShoppingList;