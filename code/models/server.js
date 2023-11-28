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
    this.app.use(express.static('public'));

    this.app.listen(port, () => {
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
    const namesDictionary = {};
    jsonData.items.forEach(item => {
      namesDictionary[item.name] = true;
    });
    
    console.log(namesDictionary);
    
    
    console.log(`Server is running on port ${port}`);
  }
}
