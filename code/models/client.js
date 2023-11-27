import express from 'express';
import bodyParser from 'body-parser';
import { ShoppingList } from "./shopping-list.js";
import { Item } from './item.js';

export class Client {
    constructor(port, code) {
      this.port = port;
      this.app = express();
      this.code = code;
      this.shopping_list =  new ShoppingList(code, []);
    }

    changeCode(code) {
        this.code = code;
        this.shopping_list.code = code;
    }

    async init() {
      this.app.use(express.static('public'));
      this.app.use(express.json());
      this.app.use(bodyParser.json());
  
      this.app.listen(this.port, () => {
        console.log(`Client is running on http://localhost:${this.port}`);
        this.executeShoppingList();
      });
    }
  
    executeShoppingList() {
      this.app.post('/manage-code', (req, res) => {
        this.changeCode(req.body.code);
        if (req.body.message === "new list") {
          this.shopping_list.createShoppingList();
        }
        res.json({ message: 'List code updated successfully' });
      });
  
      this.app.get('/api/shopping-list', (req, res) => {
        if(!this.shopping_list.loadShoppingList()){
          res.redirect('/');
        }
        else {res.json(this.shopping_list.itemsList);}
      });
  
      // Inside your '/update-list' route
      this.app.post('/update-list', (req, res) => {
          this.shopping_list.addItem(new Item(res.req.body.name,res.req.body.desiredQuantity));
          this.shopping_list.storeShoppingList();
          res.json({ message: 'List updated successfully' });
      });
    }
}