const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ShoppingList = require('./shopping-list.js');
const fileURLToPath = require('url');

const WebSocket = require('ws');

class Client {
    constructor(port, code) {
      this.port = port;
      this.app = express();
      this.code = code;
      this.shopping_list =  new ShoppingList(code, []);
      this.routerSocket = new WebSocket('ws://localhost:8080'); // Connect to the router
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

    changeCode(code) {
        this.code = code;
        this.shopping_list.code = code;
        this.shopping_list =  new ShoppingList(code, []);
    }

    createRandomCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const codeLength = 8;
      let newCode;

      do {
        newCode = '';
        for (let i = 0; i < codeLength; i++) {
          newCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      } while (this.codeExists(newCode));

      this.code = newCode;
      this.shopping_list.code = newCode;
    }

    codeExists(code) {  
      const folderName = '../shopping-lists/local/';
      const fileName = `local_client_${this.port}_list_${code}.json`;
      const currentFilePath = __filename;
      const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);

      return fs.existsSync(filePath);
    }
  
    executeShoppingList() {
      this.app.post('/manage-code', (req, res) => {
        this.changeCode(req.body.code);
        if (req.body.message === "new list") {
          this.createRandomCode();
          this.shopping_list.createShoppingList(this.port);
        }
        res.json({ message: 'List code updated successfully' });
      });
  
      this.app.get('/api/shopping-list', (req, res) => {
        if(!this.shopping_list.loadShoppingList(this.port)){
          res.redirect('/');
        }
        else {
          const response = {
            code: this.code,
            itemsList: this.shopping_list.addWinSet.elements,
        };
        res.json(response);
        }
      });
  
      // Inside your '/update-list' route
      this.app.post('/update-list', (req, res) => {
          // this.shopping_list.addItem(new Item(res.req.body.name,res.req.body.desiredQuantity));

          if(req.body.quantityDifference > 0) {
            this.shopping_list.addWinSet = this.shopping_list.addWinSet.add(req.body.name, req.body.quantityDifference);
          }
          if(req.body.quantityDifference < 0) {
            this.shopping_list.addWinSet = this.shopping_list.addWinSet.remove(req.body.name, -req.body.quantityDifference);
          }
          
          this.shopping_list.storeShoppingList(this.port);
          res.json({ message: 'List updated successfully' });
      });
    }
}

module.exports = Client;