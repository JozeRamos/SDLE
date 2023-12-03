const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');

class Server {
  constructor(port) {
    this.app = express();
    this.dic = {};
    this.port = port;
    this.routerSocket = new WebSocket('ws://localhost:8080', 'server'); // Connect to the router
  }

  async init() {
    this.app.use(bodyParser.json());
    this.app.use(cors()); // Enable CORS for all routes

    this.routerSocket.on('open', () => {
      console.log('Connected to router');
    });

    this.app.listen(this.port,() => {
      console.log(`Server is running on port ${this.port}`);
      this.executeLists(this.port);

      this.routerSocket.on('message', (message) => {
        // Handle messages from the router if needed
        console.log('Received message from router:', JSON.parse(message));

        const { sender } = JSON.parse(message);
        const { content } = JSON.parse(message);

        if (sender == "Local") {
          console.log(`Message received on port ${req.socket.localPort}: ${JSON.stringify(req.body)}`);
          const dicLength = Object.keys(this.dic).length
          res.send(`${dicLength}`); // Respond with number of lists
        }
        else if (sender == "Cloud"){
          if (content in this.dic) {
            const folderName = `/shopping-lists/cloud/server${this.port}/`;
            const fileName = `server_${this.port}_list_${content}.json`;
            const currentFilePath = __filename;
            const filePath = path.join(path.dirname(currentFilePath), '..', folderName, fileName);
            this.routerSocket.send(fs.readFileSync(filePath, 'utf8'));
          }
          else {
            this.routerSocket.send(JSON.stringify("List not found"));
          }
          
        }
      });

    });
  }


  executeLists(port) {

    // Read the file content
    const fileContent = fs.readFileSync(`shopping-lists/cloud/server${port}/list.json`, 'utf-8');
    
    // Parse the JSON content
    const jsonData = JSON.parse(fileContent);
    
    // Populate the dictionary with names    
    jsonData.items.forEach(item => {
      this.dic[item.name] = true;
    });
    
    console.log(this.dic);
    
  }
}

module.exports = Server;
