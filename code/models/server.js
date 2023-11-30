const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

class Server {
  constructor() {
    this.app = express();
    this.routerSocket = new WebSocket('ws://localhost:8080', 'server'); // Connect to the router - add router port
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
        console.log('Received message from router:', JSON.parse(message));

        const server = Math.abs(port) % 10

        const folderName = `/shopping-lists/cloud/server${server}/`;
        const fileName = `server_${server}_list_${JSON.parse(message)}.json`;
        const currentFilePath = __filename;
        const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);

        if(fs.existsSync(filePath)) {
          this.routerSocket.send(fs.readFileSync(filePath, 'utf8'));
          //this.routerSocket.send(JSON.stringify("List found"));
        } else {
          this.routerSocket.send(JSON.stringify("List not found"));
        }

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

module.exports = Server;