import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Item } from './item.js';
import { ShoppingList } from './shopping_list.js';

export class Node {
  constructor() {
    this.app = express();
  }

  async init(port) {
    this.app.use(bodyParser.json());
    this.app.use(express.static('public'));

    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      this.executeShoppingList(port);
    });
  }

  executeShoppingList(port) {
    const jsonFilePath = './shopping-lists/onePerReplica.json';
    const shoppingList = new ShoppingList('onePerReplica', []);
  
    // Load the shopping list from the JSON file
    shoppingList.loadShoppingList();
  
    this.app.use(express.static('public'));
    this.app.use(express.json());
  
    this.app.get('/api/shopping-list', (req, res) => {
      // Send the shopping list data as JSON
      res.json(shoppingList.getData());
    });
  
    this.app.post('/update-list', (req, res) => {
      const { name, desiredQuantity, quantityBought } = req.body;
  
      // Lógica para percorrer os itens da lista, atualizar o item relevante e salvar a lista
      const updated = shoppingList.updateItem(new Item(name, desiredQuantity, quantityBought));
  
      if (updated) {
        // Salvar a lista atualizada
        fs.writeFileSync(jsonFilePath, JSON.stringify(shoppingList.getData(), null, 2), 'utf8');
        res.json({ message: 'List updated successfully' });
      } else {
        res.status(400).json({ message: 'Item not found in the shopping list' });
      }
    });
  
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}  