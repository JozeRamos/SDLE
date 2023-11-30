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

    this.routerSocket.on('open', () => {
      console.log('Connected to router');
    });

    this.app.get('/', (req, res) => {
      const serverNum = Math.abs(port) % 10;
      const folderName = `/shopping-lists/cloud/server${serverNum}/`;
    
      fs.readdir(path.join(__dirname, '..', folderName), (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          res.send(`<h1>List Codes Available:</h1><ul>No List Available</ul>`);
        } else {
          const listCodes = files.map((file) => {
            const match = file.match(/^server_\d+_list_(.+)\.json$/);
            return match ? `<li>${match[1]}</li>` : '';
          });
          res.send(`<h1>List Codes Available:</h1><ul>${listCodes.join('')}</ul>`);
        }
      });
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

    });
  }
}

module.exports = Server;