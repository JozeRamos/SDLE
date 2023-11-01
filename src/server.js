const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes and server-side logic here

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// define routes for handling shopping lists, reading/writing JSON files, and managing clients' data.

// For handling JSON Files:
/*const fs = require('fs');

// Read JSON file
const data = fs.readFileSync('shopping-lists/main.json', 'utf8');
const shoppingList = JSON.parse(data);

// Write to JSON file
fs.writeFileSync('shopping-lists/main.json', JSON.stringify(shoppingList, null, 2));*/



// CRUD Operations Implementation
//In the routes, implement Create, Read, Update, and Delete (CRUD) operations for managing shopping lists
//For example, create routes like /api/lists, /api/lists/:clientId, and so on


// Testing 
// test the app locally by running 'node server.js' and accessing http://localhost:3000