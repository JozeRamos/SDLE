import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

export class Server {
  constructor() {
    this.app = express();
    this.dic = {};
  }

  async init(port) {
    this.app.use(bodyParser.json());


    // Middleware to log the port for requests on all ports except 3000, 3001, and 3002
    this.app.use((req, res, next) => {
      const excludedPorts = [/*3000, 3001, 3002*/];
      if (!excludedPorts.includes(req.socket.localPort)) {
        console.log(`Message received on port ${req.socket.localPort}: ${JSON.stringify(req.body)}`);
      }
      next();
    });

    this.app.listen(port,() => {
      console.log(`Server is running on http://localhost:${port}`);
      this.executeLists(port);
    });
  }

  executeLists(port) {

    // Read the file content
    const fileContent = fs.readFileSync(`shopping-lists/cloud/server${port}/list.json`, 'utf-8');
    
    // Parse the JSON content
    const jsonData = JSON.parse(fileContent);
    
    // Create a dictionary with names    
    jsonData.items.forEach(item => {
      this.dic[item.name] = true;
    });
    
    console.log(this.dic);
    
    
    console.log(`Server is running on port ${port}`);
  }
}
