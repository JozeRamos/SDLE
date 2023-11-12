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

    this.app.use(express.static('public'));
    this.app.use(express.json());

    let shoppingListData = {};


    // Assuming the URL will be like '/api/shopping-list/:code'
    this.app.get('/api/shopping-list/:code', (req, res) => {
      const code = req.params.code;
      const shoppingList = ShoppingList.loadShoppingList(code);
  
      if (shoppingList) {
          res.json(shoppingList.getItems());
      } else {
          res.status(404).json({ error: 'Shopping list not found' });
      }
  });
  

    // Inside your '/update-list/:code' route
        this.app.post('/update-list/:code', (req, res) => {
            const code = req.params.code;
            const shoppingList = ShoppingList.loadShoppingList(code);

            if (!shoppingList) {
                res.status(404).json({ error: 'Shopping list not found' });
                return;
            }

            const { name, desiredQuantity, quantityBought } = req.body;
            const item = shoppingList.getItemByName(name);

            if (item) {
                item.changeDesiredQuantity(desiredQuantity);
                item.changeAcquiredQuantity(quantityBought);
            } else {
                const newItem = new Item(name, desiredQuantity, quantityBought);
                shoppingList.addItem(newItem);
            }

            shoppingList.storeShoppingList();
            res.json({ message: 'List updated successfully' });
        });


    console.log(`Server is running on port ${port}`);
  }
}
