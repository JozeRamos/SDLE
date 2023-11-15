import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { ShoppingList } from './shopping_list.js';
import { Item } from './item.js';

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
    const shopping_list = new ShoppingList("onePerReplica", []); //change code in future work

    this.app.use(express.static('public'));
    this.app.use(express.json());

    this.app.post('/manage-code', (req, res) => {
      console.log(req.body);
      res.json({ message: 'YEY' });
    });

    this.app.get('/api/shopping-list', (req, res) => {
      shopping_list.loadShoppingList();
      res.json(shopping_list.itemsList);
    });

    // Inside your '/update-list' route
    this.app.post('/update-list', (req, res) => {
        shopping_list.addItem(new Item(res.req.body.name,res.req.body.desiredQuantity));
        shopping_list.storeShoppingList();
        res.json({ message: 'List updated successfully' });
    });


    console.log(`Server is running on port ${port}`);
  }
}
