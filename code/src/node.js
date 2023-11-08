
export class Node {
    async init(port) {
        const express = require('express');
        const bodyParser = require('body-parser');
        const app = express();
        const port = 3000;

        app.use(bodyParser.json());
        app.use(express.static('public'));
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

        executeShoppingList();
    }

    executeShoppingList() {
        const jsonFilePath = path.join(__dirname, 'shopping-lists', 'onePerReplica.json');

        app.use(express.static('public'));
        app.use(express.json()); // Middleware to parse JSON data

        // Read the initial JSON data from the file
        let shoppingListData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        app.get('/api/shopping-list', (req, res) => {
        res.json(shoppingListData);
        });

        app.post('/update-list', (req, res) => {
        // Extract the name, desiredQuantity, and quantityBought from the request body
        const { name, desiredQuantity, quantityBought } = req.body;

        // Check if the item exists in the shopping list data
        if (shoppingListData.items[name]) {
            // If the item exists, update its quantities
            shoppingListData.items[name].desiredQuantity = desiredQuantity;
            shoppingListData.items[name].quantityBought = quantityBought;
        } else {
            // If the item is new, add it to the shopping list
            shoppingListData.items[name] = { itemName: name, desiredQuantity, quantityBought };
        }

        // Save the updated data to the JSON file
        fs.writeFileSync(jsonFilePath, JSON.stringify(shoppingListData, null, 2), 'utf8');

        res.json({ message: 'List updated successfully' });
        });

        app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        });
    }
}