import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

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

    this.app.use(express.static('public'));
    this.app.use(express.json());

    let shoppingListData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    this.app.get('/api/shopping-list', (req, res) => {
      res.json(shoppingListData);
    });

    // Inside your '/update-list' route
    this.app.post('/update-list', (req, res) => {
        const { name, desiredQuantity, quantityBought } = req.body;

        // Convert item name to lowercase
        const normalizedStr = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const lowercaseName = normalizedStr.toLowerCase();

        if (shoppingListData.items[lowercaseName]) {
            shoppingListData.items[lowercaseName].desiredQuantity = desiredQuantity;
            shoppingListData.items[lowercaseName].quantityBought = quantityBought;
        } else {
            shoppingListData.items[lowercaseName] = { itemName: lowercaseName, desiredQuantity, quantityBought };
        }

        fs.writeFileSync(jsonFilePath, JSON.stringify(shoppingListData, null, 2), 'utf8');

        res.json({ message: 'List updated successfully' });
    });


    console.log(`Server is running on port ${port}`);
  }
}
