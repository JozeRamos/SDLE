import express from 'express';
import bodyParser from 'body-parser';
import { Client } from './client.js';
import { Item } from './item.js';

const WebSocket = require('ws');

export class Server {
  constructor() {
    this.app = express();
    this.routerSocket = new WebSocket('ws://localhost:8080'); // Connect to the router - add router port
  }

  async init(port) {
    this.app.use(bodyParser.json());
    //this.app.use(express.static('public'));

    this.routerSocket.on('open', () => {
      console.log('Connected to router');
    });

    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);

      this.routerSocket.on('message', (message) => {
        // Handle messages from the router if needed
        console.log('Received message from router:', message);
      });

      // Example of how a server might send its list data to the router
      //const listData = { listId: 'unique_id', items: [] };
      //this.routerSocket.send(JSON.stringify(listData));
    });
  }

  /*executeShoppingList(port) {
    const client = new Client(port, null);

    this.app.use(express.static('public'));
    this.app.use(express.json());

    this.app.post('/manage-code', (req, res) => {
      client.changeCode(req.body.code);
      if (req.body.message === "new list") {
        client.shopping_list.createShoppingList();
      }
      res.json({ message: 'List code updated successfully' });
    });

    this.app.get('/api/shopping-list', (req, res) => {
      if(!client.shopping_list.loadShoppingList()){
        res.redirect('/');
      }
      else {res.json(client.shopping_list.itemsList);}
    });

    // Inside your '/update-list' route
    this.app.post('/update-list', (req, res) => {
        client.shopping_list.addItem(new Item(res.req.body.name,res.req.body.desiredQuantity));
        client.shopping_list.storeShoppingList();
        res.json({ message: 'List updated successfully' });
    });


    console.log(`Server is running on port ${port}`);
  }*/
}
