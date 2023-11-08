/*const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes and server-side logic here

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});*/

// define routes for handling shopping lists, reading/writing JSON files, and managing clients' data.
// Define models, routes, and controllers for your application        --> this needs to be before the app.listen() call
//const shoppingListRoutes = require('./routes/shoppingListRoutes');
//app.use('/api/shopping-lists', shoppingListRoutes);


// CRUD Operations Implementation
//In the routes, implement Create, Read, Update, and Delete (CRUD) operations for managing shopping lists
//For example, create routes like /api/lists, /api/lists/:clientId, and so on


// For handling JSON Files:
/*const fs = require('fs');
const data = fs.readFileSync('shopping-lists/main.json', 'utf8'); // read from JSON File
const shoppingList = JSON.parse(data);
fs.writeFileSync('shopping-lists/main.json', JSON.stringify(shoppingList, null, 2)); // write to JSON File*/


// Testing 
// test the app locally by running 'node server.js' and accessing http://localhost:3000


import { Node } from "./src/node.js";

const PORT = process.env.PORT || 3000;

const node = new Node();
await node.init(PORT);

//await node.loadAccounts();