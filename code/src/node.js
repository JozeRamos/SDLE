import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Item } from './item.js';
import { ShoppingList } from './shopping_list.js';

export class Node {
  constructor() {
    this.app = express();
  }

  async init(port) {
    this.app.use(bodyParser.json());
    this.app.use(express.static('public'));

    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      this.executeShoppingList(port);
    });
  }

  executeShoppingList(port) {
    const jsonFilePath = './shopping-lists/onePerReplica.json';
    const shoppingList = new ShoppingList('onePerReplica', []);

    // Load the shopping list from the JSON file
    shoppingList.loadShoppingList()


    this.app.use(express.static('public'));
    this.app.use(express.json());

    let shoppingListData = {};


    this.app.get('/api/shopping-list', (req, res) => {
      // Send the shopping list data as JSON
      res.json(shoppingList.getData());
    });
  

    this.app.post('/update-list', (req, res) => {
      const { name, desiredQuantity, quantityBought } = req.body;

      // Use the ShoppingList and Item classes to update quantities
      const item = new Item(name, desiredQuantity, quantityBought);
      shoppingList.updateItem(item);

      // Store the updated shopping list
      shoppingList.storeShoppingList();

      res.json({ message: 'List updated successfully' });
    });
    
    console.log(`Server is running on port ${port}`);
  }
}
