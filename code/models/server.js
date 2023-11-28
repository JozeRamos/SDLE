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

    // requests go here
    this.app.use((req, res, next) => {
      const { sender } = req.body;
      const { content } = req.body;
      
      if (sender == "Local") {
        console.log(`Message received on port ${req.socket.localPort}: ${JSON.stringify(req.body)}`);
        const dicLength = Object.keys(this.dic).length
        res.send(`${dicLength}`); // Respond with number of lists
      }
      else if (sender == "Cloud"){
        console.log(`Message received on port ${req.socket.localPort}: ${JSON.stringify(req.body)}`);
        if (content in this.dic) {
          res.send(`${content} is in the dictionary.`); // Respond with elem is in dictionary
        }
        else {
          res.send(`${content} is not in the dictionary.`); // Respond with elem is not in dictionary
        }
        
      }
      else {
        next()
      }
    });

    this.app.listen(port,'0.0.0.0',() => {
      console.log(`Server is running on port ${port}`);
      this.executeLists(port);
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
