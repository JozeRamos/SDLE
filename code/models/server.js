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
      const { sender } = req.body;
      const { content } = req.body;
      console.log(content)
      if (sender == "Local") {
        console.log(`Message received on port ${req.socket.localPort}: ${JSON.stringify(req.body)}`);
        const dicLength = Object.keys(this.dic).length
        res.send(`${dicLength}`); // Respond with 'Received' when a message is received
      }
      else if (sender == "Cloud"){
        console.log(`Message received on port ${req.socket.localPort}: ${JSON.stringify(req.body)}`);
        if (content in this.dic) {
          res.send(`${content} is in the dictionary.`); // Respond with 'Received' when a message is received
        }
        else {
          res.send(`${content} is not in the dictionary.`); // Respond with 'Received' when a message is received
        }
        
      }
      else {
        next()
      }
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
