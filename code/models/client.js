const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ShoppingList = require('./shopping-list.js');

const WebSocket = require('ws');
const { resourceUsage } = require('process');

class Client {
    constructor(port, code) {
      this.app = express();
      this.port = port;
      this.code = code;
      this.shopping_list =  new ShoppingList(code, []);
      this.routerSocket = new WebSocket('ws://localhost:8080', 'client'); // Connect to the router
    }

    async init() {
      this.app.use(express.static('public'));
      this.app.use(express.json());
      this.app.use(bodyParser.json());
  
      this.app.listen(this.port, () => {
        console.log(`Client is running on http://localhost:${this.port}`);
        this.executeShoppingList();
        this.executeMerge();
      });

      this.routerSocket.on('open', () => {
        console.log('Connected to router');
      });
    }

    searchCloudForList(listCode) {
      var code_in_cloud = false;
      const msg = {
        sender: 'Cloud',
        content: `${listCode}`,
      };
      this.routerSocket.send(JSON.stringify(msg));      
      this.routerSocket.on('message', (message) => {
        console.log('Received list from router');
        this.shopping_list.pullShoppingList(this.port,JSON.parse(message));
        code_in_cloud = true;
      });
      return code_in_cloud;
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
      } while (this.codeExistsLocally(newCode) || this.searchCloudForList(newCode));

      this.code = newCode;
      this.shopping_list.code = newCode;
    }

    codeExistsLocally(code) {  
      const folderName = '/shopping-lists/local/';
      const fileName = `local_client_${this.port}_list_${code}.json`;
      const currentFilePath = __filename;
      const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);

      return fs.existsSync(filePath);
    }

    executeMerge(){      
      this.app.post('/merge', (req, res) => {
        console.log(req.body);
        let server = [];
        let consumption = [];
        const { content } = req.body;
        const exists = false;
        
        if (exists){
          const msg = {
            sender: 'Server',
            content: `${content}`,
          };
          this.routerSocket.send(JSON.stringify(msg));  
          this.routerSocket.on('message', (message) => {
            const { content } = JSON.parse(message);
            server.push(content);
            console.log(server)
            console.log(consumption)
          });
        }
        else {
          const msg = {
            sender: 'Local',
          };
          this.routerSocket.send(JSON.stringify(msg));
          this.routerSocket.on('message', (message) => {
            
            const { content } = JSON.parse(message);
            const { port } = JSON.parse(message);
            server.push(port);
            consumption.push(content);
            console.log(server)
            console.log(consumption)
          });
        }
      });
    }
  
    executeShoppingList() {
      this.app.post('/manage-code', (req, res) => {
        this.changeCode(req.body.code);

        if(!this.codeExistsLocally(req.body.code) && req.body.code) {
          this.searchCloudForList(req.body.code);
        }

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