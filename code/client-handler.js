import express from 'express';
import bodyParser from 'body-parser';
import { Client } from './src/client.js';
import { ShoppingList } from "./src/shopping_list.js";
import { Item } from './src/item.js';

const PORT = process.argv[2] || 5000; // Retrieve port from command line argument

//const baseURL = `http://localhost:${PORT}`;

let client = new Client(PORT, null);

client.app.use(express.static('public'));
client.app.use(express.json());
client.app.use(bodyParser.json());

client.app.listen(client.port, () => {
    console.log(`Client is running on port ${client.port}`);

    client.app.post('/manage-code', (req, res) => {
        client.changeCode(req.body.code);
        if (req.body.message === "new list") {
        client.shopping_list.createShoppingList();
        }
        res.json({ message: 'List code updated successfully' });
    });
    
    client.app.get('/api/shopping-list', (req, res) => {
        if(!client.shopping_list.loadShoppingList()){
        res.redirect('/');
        }
        else {res.json(client.shopping_list.itemsList);}
    });
    
    // Inside your '/update-list' route
    client.app.post('/update-list', (req, res) => {
        client.shopping_list.addItem(new Item(res.req.body.name,res.req.body.desiredQuantity));
        client.shopping_list.storeShoppingList();
        res.json({ message: 'List updated successfully' });
    });
});






